/** The full shape of `components.json` — the design system's component manifest. */
export interface ComponentsManifest {
  /** The npm package these components are published under, e.g. `'@mono/ui'`. */
  package: string;
  /** The complete set of valid `category` values usable on a {@link ComponentEntry}. */
  categories: ComponentCategory[];
  /** One entry per exported component or hook. */
  components: ComponentEntry[];
  /** Shared prop-shape types (variant unions, option/value interfaces) referenced by component props. */
  types: TypeDefinition[];
}

/** The taxonomy used to classify a {@link ComponentEntry}. Keep in sync with the `categories` list in AGENTS.md. */
export type ComponentCategory =
  'Layout' | 'Feedback' | 'Data Display' | 'User Input' | 'Overlay' | 'Navigation' | 'Decorative';

/** A single exported component or hook. */
export interface ComponentEntry {
  /** Exported name, e.g. `'Alert'` or `'useToast'`. */
  name: string;
  /** Whether this entry is a React component or a hook. */
  type: 'component' | 'hook';
  /** Classification used to group/filter components in listings. */
  category: ComponentCategory;
  /** One-to-two sentence description of what it does and when to use it. */
  description: string;
  /** Path to the source file, relative to the package root. */
  sourcePath: string;
  /** The native HTML attributes interface this component's props extend, if any (e.g. `"ButtonHTMLAttributes<HTMLButtonElement>"`). */
  extends: string | null;
  /** Additional behavior worth knowing (accessibility wiring, focus management, defaults not obvious from `props`, etc.), if any. */
  notes: string | null;
  /** Custom props declared on this component. Native HTML attributes inherited via `extends` are not repeated here. */
  props: PropDefinition[];
  /** A short, realistic usage snippet (JSX/TSX source as a string). */
  example: string;
  /** Return value, present only on `type: 'hook'` entries. */
  returns?: {
    /** The TypeScript type of the returned value. */
    type: string;
    /** What the returned value contains and how to use it. */
    description: string;
  };
}

/** A single prop (or hook parameter) and its documentation. */
export interface PropDefinition {
  /** Prop name as declared in the component's Props interface. */
  name: string;
  /** The prop's TypeScript type as a string, e.g. `"AlertVariant"` or `"() => void"`. */
  type: string;
  /** Whether the prop must be supplied. */
  required: boolean;
  /** The default value applied when the prop is omitted (as source text, e.g. `"'neutral'"`), or `null` if there is none. */
  default: string | null;
  /** What the prop controls. */
  description: string;
}

/** A shared type referenced by one or more components' props — either a union of literal values or an object shape. */
export type TypeDefinition = UnionTypeDefinition | InterfaceTypeDefinition;

/** A shared type defined as a union of string literals, e.g. `AlertVariant`. */
export interface UnionTypeDefinition {
  name: string;
  kind: 'union';
  /** The literal values that make up the union. */
  values: string[];
  description: string;
  /** Names of the {@link ComponentEntry} entries (or other {@link TypeDefinition} entries) that reference this type. */
  usedBy: string[];
}

/** A shared type defined as an object shape, e.g. `SelectOption`. */
export interface InterfaceTypeDefinition {
  name: string;
  kind: 'interface';
  description: string;
  /** The interface's fields. */
  fields: FieldDefinition[];
  /** Names of the {@link ComponentEntry} entries (or other {@link TypeDefinition} entries) that reference this type. */
  usedBy: string[];
}

/** A single field on an {@link InterfaceTypeDefinition}. */
export interface FieldDefinition {
  name: string;
  /** The field's TypeScript type as a string. */
  type: string;
  required: boolean;
  description: string;
}
