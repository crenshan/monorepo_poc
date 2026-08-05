import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ComponentsManifest } from './manifest-types.js';
import { TokensManifest } from './token-types.js';
import { examples } from './examples.js';

const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const COMPONENTS_MANIFEST = join(PROJECT_ROOT, '..', 'ui', 'components.json');
const TOKENS_MANIFEST = join(PROJECT_ROOT, '..', 'ui', 'tokens.json');

const EMPTY_MANIFEST = {
  package: '',
  categories: [],
  components: [],
  types: [],
};

const EMPTY_TOKENS: TokensManifest = {
  package: '',
  groups: [],
  tokens: [],
};

function loadManifest(): ComponentsManifest {
  if (!existsSync(COMPONENTS_MANIFEST)) {
    return EMPTY_MANIFEST;
  }
  try {
    const raw = readFileSync(COMPONENTS_MANIFEST, 'utf-8');
    return JSON.parse(raw) as ComponentsManifest;
  } catch {
    return EMPTY_MANIFEST;
  }
}

function loadTokens(): TokensManifest {
  if (!existsSync(TOKENS_MANIFEST)) {
    return EMPTY_TOKENS;
  }
  try {
    const raw = readFileSync(TOKENS_MANIFEST, 'utf-8');
    return JSON.parse(raw) as TokensManifest;
  } catch {
    return EMPTY_TOKENS;
  }
}

export function createServer(): McpServer {
  const server = new McpServer({
    name: 'design-system-server',
    version: '1.0.0',
  });

  // --------------------------------------------------
  // TOOLS
  // --------------------------------------------------

  // List Components
  server.registerTool(
    'list_components',
    {
      title: 'List components',
      description:
        'Returns name, category, and description for each component listed in the manifest.',
    },
    async () => {
      const { components } = loadManifest();

      if (components.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'No components found.',
            },
          ],
        };
      }

      const summary = components
        .map((comp) =>
          [`- **${comp.name} (${comp.category})**`, `  Description: ${comp.description}`].join(
            '\n',
          ),
        )
        .join('\n\n');

      return {
        content: [
          {
            type: 'text',
            text: `Found ${components.length} component(s):\n\n${summary}`,
          },
        ],
      };
    },
  );

  // Get Component Props
  server.registerTool(
    'get_component_props',
    {
      title: 'List prop details',
      description: 'Returns prop details for the given component',
      inputSchema: z.object({
        name: z.string().describe('Name of the component from the manifest.'),
      }),
    },
    async ({ name }) => {
      const { components } = loadManifest();

      const component = components.filter(
        (comp) => name.toLowerCase() === comp.name.toLowerCase(),
      )[0];

      if (!component) {
        return {
          content: [
            {
              type: 'text',
              text: 'No components found.',
            },
          ],
        };
      }

      const summary = component.props
        .map((prop) =>
          [
            `- **${prop.name}${!prop.required ? '?' : ''}: _${prop.type}_**`,
            `  Description: ${prop.description}`,
          ].join('\n'),
        )
        .join('\n\n');

      return {
        content: [
          {
            type: 'text',
            text: `Found ${component.props.length} props(s) for the ${name} component:\n\n${summary}`,
          },
        ],
      };
    },
  );

  // Get Tokens
  server.registerTool(
    'get_tokens',
    {
      title: 'List available design tokens',
      description:
        'Returns the JS key, CSS variable, and value for design system tokens (colors, space, etc), grouped by category.',
    },
    async () => {
      const { groups, tokens } = loadTokens();

      if (tokens.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'No tokens found.',
            },
          ],
        };
      }

      const sections = groups
        .map((group) => {
          const groupTokens = tokens.filter((token) => token.group === group);
          const list = groupTokens
            .map((token) => `- **${token.jsKey}** → \`${token.cssVar}\` = \`${token.value}\``)
            .join('\n');

          return `### ${group} (${groupTokens.length})\n\n${list}`;
        })
        .join('\n\n');

      return {
        content: [
          {
            type: 'text',
            text: `Found ${tokens.length} token(s) across ${groups.length} group(s):\n\n${sections}`,
          },
        ],
      };
    },
  );

  server.registerTool(
    'search_usage_examples',
    {
      title: 'Search usage examples',
      description:
        'Search curated examples showing how to compose @mono/ui components. ' +
        'Use this before building a UI pattern to see the established approach.',
      inputSchema: {
        query: z
          .string()
          .describe(
            "What you're trying to build. Can be a component name ('Button'), " +
              "a UI pattern ('form with validation', 'modal confirmation'), or a " +
              "use case ('loading state', 'empty state').",
          ),
        limit: z
          .number()
          .int()
          .min(1)
          .max(10)
          .optional()
          .describe('Max results to return. Defaults to 3.'),
      },
    },
    async ({ query, limit = 3 }) => {
      const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

      const scored = examples
        .map((ex) => {
          const haystack = [ex.title, ex.notes ?? '', ...ex.tags, ...ex.components]
            .join(' ')
            .toLowerCase();
          const score = terms.filter((t) => haystack.includes(t)).length;
          return { ex, score };
        })
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      if (scored.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text:
                `No examples found for "${query}". ` +
                `Call list_components to see what's available.`,
            },
          ],
        };
      }

      const text = scored
        .map(
          ({ ex }) =>
            `## ${ex.title}\n` +
            `Components: ${ex.components.join(', ')}\n` +
            (ex.notes ? `${ex.notes}\n` : '') +
            `\n\`\`\`tsx\n${ex.code}\n\`\`\``,
        )
        .join('\n\n---\n\n');

      return { content: [{ type: 'text', text }] };
    },
  );

  // --------------------------------------------------
  // RESOURCES
  // --------------------------------------------------

  // Tokens
  // -- DEMO ONLY:
  // -- This is already already available as a tool. Here as an example resource only.
  server.registerResource(
    'design-tokens',
    'ds://tokens',
    {
      title: 'Design tokens',
      description: 'All design system tokens with their CSS variable names.',
      mimeType: 'application/json',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify(
            loadTokens().tokens.map(({ jsKey, value, cssVar }) => ({
              key: jsKey,
              value,
              cssVar,
            })),
            null,
            2,
          ),
        },
      ],
    }),
  );

  // --------------------------------------------------
  // PROMPTS
  // --------------------------------------------------

  // New View
  // -- DEMO ONLY:
  // -- This will already be inferred by the LLM. Here as an example prompt only.
  server.registerPrompt(
    'new-view',
    {
      title: 'Scaffold a new view',
      description: 'Guided prompt for building a view that follows DS conventions.',
      argsSchema: {
        description: z.string().describe('What the view should do.'),
      },
    },
    ({ description }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Build a new view in website/src/views/ that does the following:

${description}

Follow this workflow before writing code:
1. Call search_usage_examples with a query describing the pattern (e.g. "form with validation", "table with filtering", "empty state") to see how this codebase already composes @mono/ui for similar cases. Prefer matching an established pattern over inventing a new one.
2. Call list_components for the full set of available primitives, then get_component_props for each component you plan to use so props are passed correctly.
3. Only call get_tokens if you need view-level CSS beyond what the components already provide (layout, spacing between components, etc).

Conventions (see website/AGENTS.md):
- Use only @mono/ui components. Never hand-roll a table, dialog, menu, or form control with raw HTML, even if similar markup exists elsewhere in this app — if a primitive you need doesn't exist in @mono/ui, stop and ask.
- One file pair per view in src/views/: ViewName.tsx + ViewName.css (imported as \`import './ViewName.css'\`). This is plain CSS, not CSS Modules — CSS Modules are a packages/ui-only convention.
- Use --space-*, --color-*, --fontSize-*, --radius-* for spacing, color, typography, and radii — don't use the deprecated --text/--border/--text-h variables from src/index.css. Raw values are acceptable for layout mechanics (percentages, viewport units, fr, flex, container max-widths, 1px borders). If a spacing or size value is a design decision rather than layout and doesn't map to an existing token, add a token to tokens.ts rather than hardcoding it.
- Wire the new view into the demo switcher in App.tsx (the \`view\` state plus a button to reach it), the same way LoginView/ReportsView/TeamSettingsView are, so it's actually reachable.

When done, run pnpm lint and pnpm typecheck.`,
          },
        },
      ],
    }),
  );

  return server;
}
