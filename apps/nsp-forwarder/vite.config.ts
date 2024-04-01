import { vitePlugin as remix } from '@remix-run/dev';
import { installGlobals } from '@remix-run/node';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

installGlobals();

export default defineConfig({
	ssr: {
		noExternal: true,
		external: [
			'node:stream',
			'node:crypto',
			'node:fs',
			'node:path',
			'node:fs/promises',
			'node:os',
			'node:util',
			'stream',
			'http',
			'https',
			'zlib',
			'fs',
			'crypto',
			'url',
		],
		target: 'node'
	},
	plugins: [remix({ presets: [] }), tsconfigPaths()],
});
