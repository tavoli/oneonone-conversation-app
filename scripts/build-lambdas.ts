import { build } from 'esbuild';
import { readdirSync, rmSync } from 'fs';
import { join } from 'path';

const srcDir = 'lambda';
const outBase = 'dist/lambda';

// Clean previous builds
rmSync(outBase, { recursive: true, force: true });

// Discover lambda subfolders
const lambdaDirs = readdirSync(srcDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

// Build each Lambda
for (const dir of lambdaDirs) {
  const entry = join(srcDir, dir, 'index.ts');
  const outdir = join(outBase, dir);

  build({
    entryPoints: [entry],
    bundle: true,
    platform: 'node',
    target: 'node18',
    outdir,
    sourcemap: true,
    external: ['@aws-sdk/client-secrets-manager'], // avoid bundling AWS SDK v3 modules
  }).then(() => {
    console.log(`✅ Built lambda/${dir}`);
  }).catch((err) => {
    console.error(`❌ Failed to build lambda/${dir}`, err);
    process.exit(1);
  });
}

