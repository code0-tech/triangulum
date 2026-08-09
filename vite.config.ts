import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      // "index" is browser-safe; "schemas" is server-only because it pulls in
      // ts-json-schema-generator (and transitively `fs`).
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        server: resolve(__dirname, 'src/server.ts')
      },
      name: 'triangulum',
      fileName: (format, entryName) => `${entryName}.${format}.js`,
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: [
        'typescript',
        '@code0-tech/sagittarius-graphql-types',
        'ts-json-schema-generator',
        'path',
        'fs'
      ],
      output: {
        globals: {
          typescript: 'ts'
        }
      }
    }
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      tsconfigPath: './tsconfig.build.json',
      include: ['src/**/*.ts'],
      afterDiagnostic: diagnostics => {
        if (diagnostics.length > 0) {
          throw new Error("dts failed");
        }
      }
    })
  ]
});

