/**
 * When creating a GPT, you are only allowed 20 files.
 *
 * So... we have to concatenate
 *
 * Each file can be up to 512MB haha
 *
 */
import path from 'node:path';
import os from 'node:os';
import { globbyStream } from 'globby';
import { $ } from 'execa';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const CWD = process.cwd();

const output = path.join(CWD, 'dist');
const tmp = path.join(os.tmpdir(), `ember-ai-${Date.now()}`);

await mkdir(tmp, { recursive: true });
await mkdir(output, { recursive: true });

const only = ['reactiveweb'];

const separator = `
---

`;

const sources = [
  {
    name: 'reactiveweb',
    git: 'https://github.com/universal-ember/reactiveweb.git',
    prepare: async ({ cwd }) => {
      await $({ shell: true, cwd })`pnpm install`;
      await $({ shell: true, cwd })`pnpm build`;
      await $({ shell: true, cwd })`pnpm build:docs`;
    },
    folder: 'docs/dist',
    pattern: '**/*.html',
  },
  {
    name: 'ember-api-docs',
    git: 'https://github.com/ember-learn/ember-api-docs-data.git',
    folder: 'json-docs/ember/5.12.0/',
    pattern: '**/*.json',
  },
  {
    name: 'ember-data-api-docs',
    git: 'https://github.com/ember-learn/ember-api-docs-data.git',
    folder: 'json-docs/ember/5.12.0/',
    pattern: '**/*.json',
  },
  {
    name: 'limber-tutorial',
    git: 'https://github.com/NullVoxPopuli/limber.git',
    folder: 'apps/tutorial/public/docs/',
    pattern: '**/prose.md',
  },
  {
    name: 'ember-primitives',
    git: 'https://github.com/universal-ember/ember-primitives.git',
    folder: 'docs-app/public/docs',
    pattern: '**/*.md',
  },
  {
    name: 'ember-resources',
    git: 'https://github.com/NullVoxPopuli/ember-resources.git',
    folder: 'docs/docs/',
    pattern: '**/*.md',
  },
  {
    name: 'embroider',
    git: 'https://github.com/embroider-build/embroider.git',
    folder: 'docs',
    pattern: '**/*.md',
  },
  {
    name: 'guides-source',
    git: 'git@github.com:ember-learn/guides-source.git',
    folder: 'guides/release',
    pattern: '**/*.md',
  },
  {
    name: 'ember-data',
    git: 'https://github.com/emberjs/data.git',
    folder: 'guides',
    pattern: '**/*.md',
  },
  {
    name: 'NullVoxPopuli',
    git: 'https://github.com/NullVoxPopuli/website.git',
    folder: 'content',
    pattern: '**/*.md',
    filter: (filePath) => {
      return [
        'setting-up-gjs',
        'avoiding-lifecycle',
        'effects-in-ember',
        'template-only',
        'how-does-di-work',
      ].some((x) => filePath.includes(x));
    },
  },
];

async function getgit(source) {
  await $({ shell: true, cwd: tmp })`git clone ${source.git} ${source.name}`;

  let repoDir = path.join(tmp, source.name);
  let sourceDir = path.join(repoDir, source.folder);
  let targetDir = path.join(output, source.name);

  if ('prepare' in source) {
    await source.prepare({ cwd: repoDir });
  }

  await mkdir(targetDir, { recursive: true });

  let fileContents = ``;
  let outputFile = path.join(targetDir, source.name);

  for await (const filePath of globbyStream(source.pattern, {
    cwd: sourceDir,
  })) {
    let fullSourcePath = path.join(sourceDir, filePath);

    if (source.filter) {
      if (!source.filter(fullSourcePath)) {
        continue;
      }
    }

    let buffer = await readFile(fullSourcePath);
    let content = buffer.toString();

    fileContents += content;
    fileContents += separator;
  }

  await writeFile(outputFile, fileContents);
}

await Promise.all(
  (only.length > 0
    ? sources.filter((source) => only.includes(source.name))
    : sources
  ).map((source) => {
    if ('git' in source) {
      return getgit(source);
    }
  }),
);
