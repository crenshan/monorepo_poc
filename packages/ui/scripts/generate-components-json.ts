// Generates components.json — the design system's component/prop manifest, consumed by
// ds-mcp's list_components/get_component_props tools — by parsing
// src/components/**/*.{ts,tsx} with ts-morph. Run it whenever component source changes:
// npx tsx scripts/generate-components-json.ts
// This keeps component/hook source (and its JSDoc) as the single source of truth —
// components.json is a build artifact, never hand-edited.
//
// Discovery is structural, not convention-based: an exported function/arrow-function
// counts as a hook if its name matches /^use[A-Z]/, or as a component if its name is
// PascalCase (a hard JSX requirement, not just style) AND its body contains JSX. This
// stays correct even if naming conventions like `{Name}Props` lapse. Every discovered
// entry is then required to carry @category/@example JSDoc tags — a missing or invalid
// tag throws instead of silently omitting or mis-tagging the entry, so a documentation
// gap fails the build loudly rather than producing incomplete manifest data.

import { Node, Project, SyntaxKind } from 'ts-morph';
import type {
  InterfaceDeclaration,
  JSDoc,
  LiteralTypeNode,
  ParameterDeclaration,
  PropertySignature,
  SourceFile,
  StringLiteral,
} from 'ts-morph';
import { writeFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const COMPONENTS_DIR = join(PACKAGE_ROOT, 'src', 'components');

const CATEGORIES = [
  'Layout',
  'Feedback',
  'Data Display',
  'User Input',
  'Overlay',
  'Navigation',
  'Decorative',
] as const;
type ComponentCategory = (typeof CATEGORIES)[number];

interface PropDefinition {
  name: string;
  type: string;
  required: boolean;
  default: string | null;
  description: string;
}

interface ComponentEntry {
  name: string;
  type: 'component' | 'hook';
  category: ComponentCategory;
  description: string;
  sourcePath: string;
  extends: string | null;
  notes: string | null;
  props: PropDefinition[];
  example: string;
  returns?: { type: string; description: string };
}

interface FieldDefinition {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

type TypeDefinition =
  | { name: string; kind: 'union'; values: string[]; description: string; usedBy: string[] }
  | {
      name: string;
      kind: 'interface';
      description: string;
      fields: FieldDefinition[];
      usedBy: string[];
    };

function normalizeProse(text: string): string {
  // ts-morph's comment-text extraction leaves `{@link X}`/`{@link X|label}` tags as
  // literal text rather than resolving them — collapse to the link's display text.
  const withoutLinks = text.replace(
    /\{@link(?:code|plain)?\s+([^}|]+?)(?:\|([^}]+))?\}/g,
    (_match, target: string, label: string | undefined) => (label ?? target).trim(),
  );
  return withoutLinks.replace(/\s+/g, ' ').trim();
}

// -----------------------------------------------------------------------
// Discovery: every exported function-like declaration in a file, whether it's
// `export function X()` or `export const X = () => {}`.
// -----------------------------------------------------------------------

interface Callable {
  name: string;
  jsDocs: JSDoc[];
  parameters: ParameterDeclaration[];
  bodyNode: Node | undefined;
  getReturnTypeText(): string;
}

function getExportedCallables(sourceFile: SourceFile): Callable[] {
  const callables: Callable[] = [];

  for (const fn of sourceFile.getFunctions()) {
    if (!fn.isExported()) continue;
    const name = fn.getName();
    if (!name) continue;
    callables.push({
      name,
      jsDocs: fn.getJsDocs(),
      parameters: fn.getParameters(),
      bodyNode: fn.getBody(),
      getReturnTypeText: () => (fn.getReturnTypeNode() ?? fn.getReturnType()).getText(),
    });
  }

  for (const statement of sourceFile.getVariableStatements()) {
    if (!statement.isExported()) continue;
    for (const decl of statement.getDeclarations()) {
      const init = decl.getInitializer();
      if (!init || !(Node.isArrowFunction(init) || Node.isFunctionExpression(init))) continue;
      callables.push({
        name: decl.getName(),
        jsDocs: statement.getJsDocs(),
        parameters: init.getParameters(),
        bodyNode: init.getBody(),
        getReturnTypeText: () => (init.getReturnTypeNode() ?? init.getReturnType()).getText(),
      });
    }
  }

  return callables;
}

function containsJsx(node: Node | undefined): boolean {
  if (!node) return false;
  if (Node.isJsxElement(node) || Node.isJsxSelfClosingElement(node) || Node.isJsxFragment(node)) {
    return true;
  }
  return (
    node.getDescendantsOfKind(SyntaxKind.JsxElement).length > 0 ||
    node.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement).length > 0 ||
    node.getDescendantsOfKind(SyntaxKind.JsxFragment).length > 0
  );
}

// -----------------------------------------------------------------------
// JSDoc extraction, with required-tag validation as the safety net for the
// structural discovery above.
// -----------------------------------------------------------------------

function requireJsDoc(jsDocs: JSDoc[], context: string): JSDoc {
  const doc = jsDocs.at(-1);
  if (!doc) {
    throw new Error(`${context}: missing a JSDoc block (requires @category and @example).`);
  }
  return doc;
}

function getTagText(jsDoc: JSDoc, tagName: string): string | null {
  const tag = jsDoc.getTags().find((t) => t.getTagName() === tagName);
  if (!tag) return null;
  return (tag.getCommentText() ?? '').trim();
}

function requireTagText(jsDoc: JSDoc, tagName: string, context: string): string {
  const text = getTagText(jsDoc, tagName);
  if (!text) {
    throw new Error(`${context}: missing a required @${tagName} JSDoc tag.`);
  }
  return text;
}

function requireCategory(jsDoc: JSDoc, context: string): ComponentCategory {
  const raw = requireTagText(jsDoc, 'category', context);
  if (!(CATEGORIES as readonly string[]).includes(raw)) {
    throw new Error(
      `${context}: @category "${raw}" is not one of the known categories (${CATEGORIES.join(', ')}).`,
    );
  }
  return raw as ComponentCategory;
}

function extractExample(jsDoc: JSDoc, context: string): string {
  const raw = requireTagText(jsDoc, 'example', context);
  const match = raw.match(/```(?:tsx|jsx|ts|js)?\r?\n([\s\S]*?)```/);
  if (!match) {
    throw new Error(`${context}: @example tag doesn't contain a fenced code block.`);
  }
  return match[1]!.trimEnd();
}

function extractNotes(jsDoc: JSDoc): string | null {
  const remarks = getTagText(jsDoc, 'remarks');
  const throwsText = getTagText(jsDoc, 'throws');
  const parts = [
    remarks ? normalizeProse(remarks) : null,
    throwsText ? `Throws: ${normalizeProse(throwsText)}` : null,
  ].filter((p): p is string => Boolean(p));
  return parts.length > 0 ? parts.join(' ') : null;
}

// -----------------------------------------------------------------------
// Props/extends resolution: from the actual parameter type reference, never a
// guessed `{Name}Props` interface name.
// -----------------------------------------------------------------------

function getParamDefaults(param: ParameterDeclaration | undefined): Map<string, string> {
  const defaults = new Map<string, string>();
  if (!param) return defaults;
  const nameNode = param.getNameNode();
  if (!Node.isObjectBindingPattern(nameNode)) return defaults;
  for (const element of nameNode.getElements()) {
    const init = element.getInitializer();
    if (init) defaults.set(element.getName(), init.getText());
  }
  return defaults;
}

function buildPropDefinition(
  prop: PropertySignature,
  defaults: Map<string, string>,
  context: string,
): PropDefinition {
  const name = prop.getName();
  const typeNode = prop.getTypeNode();
  if (!typeNode) {
    throw new Error(`${context}: prop "${name}" has no explicit type annotation.`);
  }
  const doc = prop.getJsDocs().at(-1);
  if (!doc) {
    throw new Error(`${context}: prop "${name}" is missing a doc comment.`);
  }
  return {
    name,
    type: typeNode.getText(),
    required: !prop.hasQuestionToken(),
    default: defaults.get(name) ?? null,
    description: normalizeProse(doc.getDescription()),
  };
}

function formatExtends(interfaceDecl: InterfaceDeclaration): string | null {
  const heritageClauses = interfaceDecl.getExtends();
  if (heritageClauses.length === 0) return null;
  const heritage = heritageClauses[0]!;
  if (heritage.getExpression().getText() === 'Omit') {
    const typeArgs = heritage.getTypeArguments();
    const base = typeArgs[0]!.getText();
    const omittedNode = typeArgs[1]!;
    const keys = Node.isUnionTypeNode(omittedNode)
      ? omittedNode.getTypeNodes().map((n) => n.getText())
      : [omittedNode.getText()];
    return `${base} (omit ${keys.join(', ')})`;
  }
  return heritage.getText();
}

interface ResolvedProps {
  extends: string | null;
  props: PropDefinition[];
  localInterface: InterfaceDeclaration | null;
}

function resolveProps(
  sourceFile: SourceFile,
  param: ParameterDeclaration | undefined,
  context: string,
): ResolvedProps {
  if (!param) {
    return { extends: null, props: [], localInterface: null };
  }

  const typeNode = param.getTypeNode();
  if (!typeNode) {
    throw new Error(`${context}: parameter has no explicit type annotation.`);
  }
  if (Node.isTypeLiteral(typeNode)) {
    throw new Error(
      `${context}: parameter uses an inline type literal — extract it into a named interface.`,
    );
  }
  if (!Node.isTypeReference(typeNode)) {
    throw new Error(`${context}: unsupported parameter type "${typeNode.getText()}".`);
  }

  const referencedName = typeNode.getTypeName().getText();
  const localInterface = sourceFile.getInterface(referencedName);
  if (!localInterface) {
    // A bare reference to an external type (e.g. Table's TableHTMLAttributes<...>) —
    // nothing declared locally to walk, so no custom props.
    return { extends: typeNode.getText(), props: [], localInterface: null };
  }

  const defaults = getParamDefaults(param);
  const props = localInterface
    .getProperties()
    .map((prop) => buildPropDefinition(prop, defaults, context));

  return { extends: formatExtends(localInterface), props, localInterface };
}

// -----------------------------------------------------------------------
// Shared types (unions/interfaces referenced by at least one prop or field),
// with a computed one-hop `usedBy` graph.
// -----------------------------------------------------------------------

interface CandidateType {
  name: string;
  kind: 'union' | 'interface';
  description: string;
  values?: string[];
  fields?: FieldDefinition[];
  fieldTypeTexts: string[];
}

function collectCandidateTypes(
  sourceFiles: SourceFile[],
  claimedPropsInterfaceNames: Set<string>,
): CandidateType[] {
  const candidates: CandidateType[] = [];

  for (const sourceFile of sourceFiles) {
    const relSourcePath = relative(PACKAGE_ROOT, sourceFile.getFilePath());

    for (const alias of sourceFile.getTypeAliases()) {
      if (!alias.isExported()) continue;
      const typeNode = alias.getTypeNode();
      if (!Node.isUnionTypeNode(typeNode)) continue;
      const members = typeNode.getTypeNodes();
      const isStringLiteralUnion = members.every(
        (m) => Node.isLiteralTypeNode(m) && Node.isStringLiteral(m.getLiteral()),
      );
      if (!isStringLiteralUnion) continue;

      const values = members.map((m) =>
        ((m as LiteralTypeNode).getLiteral() as StringLiteral).getLiteralValue(),
      );
      const doc = alias.getJsDocs().at(-1);
      if (!doc) {
        throw new Error(
          `${relative(PACKAGE_ROOT, sourceFile.getFilePath())}: exported type "${alias.getName()}" is missing a doc comment.`,
        );
      }
      candidates.push({
        name: alias.getName(),
        kind: 'union',
        description: normalizeProse(doc.getDescription()),
        values,
        fieldTypeTexts: [],
      });
    }

    for (const iface of sourceFile.getInterfaces()) {
      if (!iface.isExported()) continue;
      const name = iface.getName();
      if (name.endsWith('Props') || claimedPropsInterfaceNames.has(name)) continue;

      const context = `${relSourcePath}: exported type "${name}"`;
      const doc = iface.getJsDocs().at(-1);
      if (!doc) {
        throw new Error(`${context}: is missing a doc comment.`);
      }
      const fields: FieldDefinition[] = iface.getProperties().map((prop) => {
        const typeNode = prop.getTypeNode();
        if (!typeNode) {
          throw new Error(`${context}: field "${prop.getName()}" has no explicit type annotation.`);
        }
        const fieldDoc = prop.getJsDocs().at(-1);
        if (!fieldDoc) {
          throw new Error(`${context}: field "${prop.getName()}" is missing a doc comment.`);
        }
        return {
          name: prop.getName(),
          type: typeNode.getText(),
          required: !prop.hasQuestionToken(),
          description: normalizeProse(fieldDoc.getDescription()),
        };
      });

      candidates.push({
        name,
        kind: 'interface',
        description: normalizeProse(doc.getDescription()),
        fields,
        fieldTypeTexts: fields.map((f) => f.type),
      });
    }
  }

  return candidates;
}

function referencesType(typeText: string, name: string): boolean {
  return new RegExp(`\\b${name}\\b`).test(typeText);
}

function computeTypeDefinitions(
  candidates: CandidateType[],
  components: ComponentEntry[],
): TypeDefinition[] {
  const result: TypeDefinition[] = [];

  for (const candidate of candidates) {
    const fromComponents = components
      .filter((c) => c.props.some((p) => referencesType(p.type, candidate.name)))
      .map((c) => c.name);
    const fromReturns = components
      .filter((c) => c.returns && referencesType(c.returns.type, candidate.name))
      .map((c) => c.name);
    const fromOtherTypes = candidates
      .filter((other) => other.name !== candidate.name)
      .filter((other) => other.fieldTypeTexts.some((t) => referencesType(t, candidate.name)))
      .map((other) => other.name);
    const usedBy = [...fromComponents, ...fromReturns, ...fromOtherTypes].sort();
    if (usedBy.length === 0) continue;

    result.push(
      candidate.kind === 'union'
        ? {
            name: candidate.name,
            kind: 'union',
            values: candidate.values!,
            description: candidate.description,
            usedBy,
          }
        : {
            name: candidate.name,
            kind: 'interface',
            description: candidate.description,
            fields: candidate.fields!,
            usedBy,
          },
    );
  }

  return result.sort((a, b) => a.name.localeCompare(b.name));
}

// -----------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------

const project = new Project({ tsConfigFilePath: join(PACKAGE_ROOT, 'tsconfig.app.json') });

const sourceFiles = project
  .getSourceFiles()
  .filter((f) => {
    const rel = relative(COMPONENTS_DIR, f.getFilePath());
    return !rel.startsWith('..') && !/\.test\.tsx?$/.test(f.getFilePath());
  })
  .sort((a, b) => a.getFilePath().localeCompare(b.getFilePath()));

const components: ComponentEntry[] = [];
const claimedPropsInterfaceNames = new Set<string>();

for (const sourceFile of sourceFiles) {
  const relSourcePath = relative(PACKAGE_ROOT, sourceFile.getFilePath());

  for (const fn of getExportedCallables(sourceFile)) {
    const isHook = /^use[A-Z]/.test(fn.name);
    const isComponent = !isHook && /^[A-Z]/.test(fn.name) && containsJsx(fn.bodyNode);
    if (!isHook && !isComponent) continue;

    const context = `${relSourcePath}: exported ${isHook ? 'hook' : 'component'} "${fn.name}"`;
    const jsDoc = requireJsDoc(fn.jsDocs, context);
    const category = requireCategory(jsDoc, context);
    const description = normalizeProse(jsDoc.getDescription());
    const example = extractExample(jsDoc, context);
    const notes = extractNotes(jsDoc);

    const resolved = resolveProps(sourceFile, fn.parameters[0], context);
    if (resolved.localInterface) claimedPropsInterfaceNames.add(resolved.localInterface.getName());

    const entry: ComponentEntry = {
      name: fn.name,
      type: isHook ? 'hook' : 'component',
      category,
      description,
      sourcePath: relSourcePath,
      extends: resolved.extends,
      notes,
      props: resolved.props,
      example,
    };

    if (isHook) {
      entry.returns = {
        type: fn.getReturnTypeText(),
        description: normalizeProse(requireTagText(jsDoc, 'returns', context)),
      };
    }

    components.push(entry);
  }
}

components.sort((a, b) => a.name.localeCompare(b.name));

const candidateTypes = collectCandidateTypes(sourceFiles, claimedPropsInterfaceNames);
const types = computeTypeDefinitions(candidateTypes, components);

const manifest = {
  package: '@mono/ui',
  categories: CATEGORIES,
  components,
  types,
};

const outPath = join(PACKAGE_ROOT, 'generated', 'components.json');
writeFileSync(outPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(
  `Wrote ${outPath} (${components.length} components/hooks, ${types.length} shared types)`,
);
