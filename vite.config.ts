import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { cjsInterop } from 'vite-plugin-cjs-interop';
import griffel from '@griffel/vite-plugin';

declare module '@remix-run/node' {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig(({ command }) => ({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
    // Add CJS interop plugin for Fluent UI packages,
    // as they are CommonJS modules
    cjsInterop({
      dependencies: [
        '@fluentui/react-components',
        '@fluentui/react-nav-preview',
        '@fluentui/react-list-preview',
        '@fluentui/react-virtualizer',
        '@fluentui/react-motion-components-preview',
      ],
    }),
    // Add Griffel plugin for production optimization
    // command === 'build' && griffel(),
  ],
  // Required for Fluent UI icons in SSR
  ssr: {
    noExternal: ['@fluentui/react-icons'],
  },
}));
