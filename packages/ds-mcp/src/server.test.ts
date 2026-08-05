import { beforeEach, describe, expect, test, vi } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createServer } from './server.js';
import type { ComponentsManifest } from './manifest-types.js';
import type { TokensManifest } from './token-types.js';

// The manifests are read from disk via hardcoded paths in server.ts, so we
// mock node:fs and route reads by filename to keep tests deterministic and
// independent of the real packages/ui/{components,tokens}.json contents.
vi.mock('node:fs', () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
}));

const mockExistsSync = vi.mocked(existsSync);
const mockReadFileSync = vi.mocked(readFileSync);

const componentsFixture: ComponentsManifest = {
  package: '@mono/ui',
  categories: ['User Input'],
  components: [
    {
      name: 'Button',
      type: 'component',
      category: 'User Input',
      description: 'A clickable button.',
      sourcePath: 'src/components/Button/Button.tsx',
      extends: 'ButtonHTMLAttributes<HTMLButtonElement>',
      notes: null,
      props: [
        {
          name: 'variant',
          type: "'primary' | 'secondary'",
          required: false,
          default: "'primary'",
          description: 'Visual style of the button.',
        },
      ],
      example: '<Button>Click me</Button>',
    },
  ],
  types: [],
};

const tokensFixture: TokensManifest = {
  package: '@mono/ui',
  groups: ['color', 'space'],
  tokens: [
    {
      group: 'color',
      key: 'primary',
      jsKey: 'color.primary',
      cssVar: '--color-primary',
      value: '#0b5fff',
    },
    { group: 'space', key: 'md', jsKey: 'space.md', cssVar: '--space-md', value: '16px' },
  ],
};

function mockManifests({
  components = componentsFixture,
  tokens = tokensFixture,
}: {
  components?: ComponentsManifest | null;
  tokens?: TokensManifest | null;
} = {}) {
  mockExistsSync.mockImplementation((path: unknown) => {
    const p = String(path);
    if (p.endsWith('components.json')) return components !== null;
    if (p.endsWith('tokens.json')) return tokens !== null;
    return false;
  });
  mockReadFileSync.mockImplementation((path: unknown) => {
    const p = String(path);
    if (p.endsWith('components.json')) return JSON.stringify(components);
    if (p.endsWith('tokens.json')) return JSON.stringify(tokens);
    throw new Error(`Unexpected path read in test: ${p}`);
  });
}

async function connectedClient() {
  const server = createServer();
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: 'test-client', version: '1.0.0' });
  await Promise.all([client.connect(clientTransport), server.connect(serverTransport)]);
  return client;
}

function textOf(result: Awaited<ReturnType<Client['callTool']>>): string {
  const content = result.content as Array<{ type: string; text?: string }>;
  return content[0]?.text ?? '';
}

beforeEach(() => {
  vi.resetAllMocks();
  mockManifests();
});

describe('list_components', () => {
  test('returns name, category, and description for each component', async () => {
    const client = await connectedClient();
    const result = await client.callTool({ name: 'list_components', arguments: {} });
    const text = textOf(result);

    expect(text).toContain('Found 1 component(s)');
    expect(text).toContain('Button (User Input)');
    expect(text).toContain('A clickable button.');
  });

  test('reports no components found when the manifest has none', async () => {
    mockManifests({ components: { package: '', categories: [], components: [], types: [] } });
    const client = await connectedClient();
    const result = await client.callTool({ name: 'list_components', arguments: {} });

    expect(textOf(result)).toBe('No components found.');
  });

  test('reports no components found when the manifest file is missing', async () => {
    mockManifests({ components: null });
    const client = await connectedClient();
    const result = await client.callTool({ name: 'list_components', arguments: {} });

    expect(textOf(result)).toBe('No components found.');
  });
});

describe('get_component_props', () => {
  test('matches a component name case-insensitively and lists its props', async () => {
    const client = await connectedClient();
    const result = await client.callTool({
      name: 'get_component_props',
      arguments: { name: 'button' },
    });
    const text = textOf(result);

    expect(text).toContain('Found 1 props(s) for the button component');
    expect(text).toContain("- **variant?: _'primary' | 'secondary'_**");
    expect(text).toContain('Visual style of the button.');
  });

  test('omits the "?" suffix for required props', async () => {
    mockManifests({
      components: {
        ...componentsFixture,
        components: [
          {
            ...componentsFixture.components[0],
            props: [
              {
                name: 'label',
                type: 'string',
                required: true,
                default: null,
                description: 'Accessible label.',
              },
            ],
          },
        ],
      },
    });
    const client = await connectedClient();
    const result = await client.callTool({
      name: 'get_component_props',
      arguments: { name: 'Button' },
    });

    expect(textOf(result)).toContain('- **label: _string_**');
  });

  test('reports no components found for an unknown component', async () => {
    const client = await connectedClient();
    const result = await client.callTool({
      name: 'get_component_props',
      arguments: { name: 'DoesNotExist' },
    });

    expect(textOf(result)).toBe('No components found.');
  });
});

describe('get_tokens', () => {
  test('groups tokens by category', async () => {
    const client = await connectedClient();
    const result = await client.callTool({ name: 'get_tokens', arguments: {} });
    const text = textOf(result);

    expect(text).toContain('Found 2 token(s) across 2 group(s)');
    expect(text).toContain('### color (1)');
    expect(text).toContain('**color.primary** → `--color-primary` = `#0b5fff`');
    expect(text).toContain('### space (1)');
    expect(text).toContain('**space.md** → `--space-md` = `16px`');
  });

  test('reports no tokens found when the manifest has none', async () => {
    mockManifests({ tokens: { package: '', groups: [], tokens: [] } });
    const client = await connectedClient();
    const result = await client.callTool({ name: 'get_tokens', arguments: {} });

    expect(textOf(result)).toBe('No tokens found.');
  });

  test('reports no tokens found when the manifest file is missing', async () => {
    mockManifests({ tokens: null });
    const client = await connectedClient();
    const result = await client.callTool({ name: 'get_tokens', arguments: {} });

    expect(textOf(result)).toBe('No tokens found.');
  });
});

describe('search_usage_examples', () => {
  // search_usage_examples scores against the curated `examples` array in
  // examples.ts, not the file-backed manifests, so no fs mocking is needed
  // beyond the default beforeEach setup.

  test('finds an example matching multiple query terms', async () => {
    const client = await connectedClient();
    const result = await client.callTool({
      name: 'search_usage_examples',
      arguments: { query: 'modal confirm destructive' },
    });
    const text = textOf(result);

    expect(text).toContain('Confirmation modal before a destructive action');
    expect(text).toContain('Components: Modal, Button');
    expect(text).toContain('```tsx');
  });

  test('ranks results with more matching terms first', async () => {
    const client = await connectedClient();
    const result = await client.callTool({
      name: 'search_usage_examples',
      arguments: { query: 'table status badge', limit: 2 },
    });
    const text = textOf(result);
    const firstHeadingIndex = text.indexOf('## Status badges in a data table');

    expect(firstHeadingIndex).toBe(0);
  });

  test('defaults to 3 results and respects an explicit limit', async () => {
    const client = await connectedClient();

    const defaultResult = await client.callTool({
      name: 'search_usage_examples',
      arguments: { query: 'table' },
    });
    const limitedResult = await client.callTool({
      name: 'search_usage_examples',
      arguments: { query: 'table', limit: 1 },
    });

    expect(textOf(defaultResult).split('\n\n---\n\n').length).toBeLessThanOrEqual(3);
    expect(textOf(limitedResult).split('\n\n---\n\n').length).toBe(1);
  });

  test('returns a fallback message when nothing matches', async () => {
    const client = await connectedClient();
    const result = await client.callTool({
      name: 'search_usage_examples',
      arguments: { query: 'zzz-nonexistent-pattern' },
    });

    expect(textOf(result)).toContain('No examples found for "zzz-nonexistent-pattern"');
    expect(textOf(result)).toContain('Call list_components');
  });
});

describe('design-tokens resource', () => {
  test('returns tokens as a flat JSON array of key/value/cssVar', async () => {
    const client = await connectedClient();
    const result = await client.readResource({ uri: 'ds://tokens' });
    const [content] = result.contents as { text: string; mimeType?: string }[];

    expect(content.mimeType).toBe('application/json');
    expect(JSON.parse(content.text)).toEqual([
      { key: 'color.primary', value: '#0b5fff', cssVar: '--color-primary' },
      { key: 'space.md', value: '16px', cssVar: '--space-md' },
    ]);
  });
});

describe('new-view prompt', () => {
  test('embeds the requested description into the scaffold instructions', async () => {
    const client = await connectedClient();
    const result = await client.getPrompt({
      name: 'new-view',
      arguments: { description: 'A view that lists pending approvals.' },
    });
    const [message] = result.messages;
    const text = (message.content as { type: 'text'; text: string }).text;

    expect(message.role).toBe('user');
    expect(text).toContain('A view that lists pending approvals.');
    expect(text).toContain('Call search_usage_examples');
    expect(text).toContain('Use only @mono/ui components');
  });
});
