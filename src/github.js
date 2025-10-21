import path from 'node:path';
import { globbyStream } from 'globby';
import { $ } from 'execa';
import { readFile, writeFile } from 'node:fs/promises';
import { tmp, output, separator } from './file.js';

const only = [];

const DEFAULT_PATTERN = '**/*';

/**
 * This outputs a document per top-level array.
 * Because we are limited to 20 documents, we need to do some combining
 */
const sources = [
  {
    name: 'glint',
    git: 'https://github.com/typed-ember/glint.git',
    folder: 'docs',
    pattern: '**/*.md',
    ext: 'md',
  },
  {
    name: 'ember-rfcs',
    git: 'https://github.com/emberjs/rfcs.git',
    folder: 'text',
    pattern: '*.md',
    ext: 'md',
  },
  {
    name: 'reactiveweb',
    git: 'https://github.com/universal-ember/reactiveweb.git',
    prepare: async ({ cwd }) => {
      await $({ shell: true, cwd })`pnpm install`;
      await $({ shell: true, cwd })`pnpm build`;
      await $({ shell: true, cwd })`pnpm build:docs`;
    },
    folder: 'reactiveweb/src',
  },
  {
    name: 'low-level-code',
    ext: '.js.md',
    group: [
      {
        name: 'babel-plugin-ember-template-compilation',
        git: 'https://github.com/emberjs/babel-plugin-ember-template-compilation.git',
        folder: 'src',
        pattern: '**/*.ts',
      },
    ],
  },
  {
    name: 'api-docs',
    ext: '.json.md',
    group: [
      {
        name: 'ember-api-docs',
        git: 'https://github.com/ember-learn/ember-api-docs-data.git',
        folder: 'json-docs/ember/6.8.0/',
        pattern: '**/*.json',
      },
      {
        name: 'ember-data-api-docs',
        git: 'https://github.com/ember-learn/ember-api-docs-data.git',
        folder: 'json-docs/ember/6.8.0/',
        pattern: '**/*.json',
      },
    ],
  },
  {
    name: 'limber-tutorial',
    git: 'https://github.com/NullVoxPopuli/limber.git',
    folder: 'apps/tutorial/public/docs/',
    pattern: '**/prose.md',
    ext: 'md',
  },
  {
    name: 'ember-primitives',
    git: 'https://github.com/universal-ember/ember-primitives.git',
    folder: ['docs-app/public/docs', 'ember-primitives/src'],
  },
  {
    name: 'ember-resources',
    git: 'https://github.com/NullVoxPopuli/ember-resources.git',
    folder: 'docs/docs/',
    pattern: '**/*.md',
    ext: 'md',
  },
  {
    name: 'embroider',
    ext: 'md',
    group: [
      {
        name: 'vite-codemod',
        git: 'https://github.com/mainmatter/ember-vite-codemod.git',
        folder: '.',
        pattern: 'README.md',
      },
      {
        name: 'embroider',
        git: 'https://github.com/embroider-build/embroider.git',
        folder: 'docs',
        pattern: '**/*.md',
      },
      {
        name: 'addon-blueprint',
        git: 'https://github.com/embroider-build/addon-blueprint.git',
        folder: '.',
        pattern: 'README.md',
      },
      {
        name: 'app-blueprint',
        git: 'https://github.com/embroider-build/app-blueprint.git',
        folder: '.',
        pattern: 'README.md',
      },
    ],
  },
  {
    name: 'guides-source',
    ext: 'md',
    git: 'https://github.com/ember-learn/guides-source.git',
    folder: 'guides/release',
    pattern: '**/*.md',
  },
  {
    name: 'ember-data',
    ext: 'md',
    git: 'https://github.com/emberjs/data.git',
    folder: 'guides',
    pattern: '**/*.md',
  },
  {
    name: 'community-bloggers',
    ext: 'md',
    group: [
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
            'where-do-i',
            'design-systems',
          ].some((x) => filePath.includes(x));
        },
      },
      {
        name: 'runspired',
        git: 'https://github.com/runspired/runspired.com.git',
        folder: '_posts',
        pattern: '**/*.md',
      },
    ],
  },
];

async function getgit(source) {
  let fileContents = await contentsForGit(source);
  let fileName = source.name + (source.ext ? `.${source.ext}` : '');
  let outputFile = path.join(output, fileName);

  await writeFile(outputFile, fileContents);
}

async function contentsForGit(source) {
  console.log(`Fetching: ${source.git}`);

  await $({ shell: true, cwd: tmp })`git clone ${source.git} ${source.name}`;

  let repoDir = path.join(tmp, source.name);
  let fileContents = ``;

  let folders = Array.isArray(source.folder) ? source.folder : [source.folder];

  for (let sourceFolder of folders) {
    let sourceDir = path.join(repoDir, sourceFolder);

    if ('prepare' in source) {
      await source.prepare({ cwd: repoDir });
    }

    for await (const filePath of globbyStream(
      source.pattern ?? DEFAULT_PATTERN,
      {
        cwd: sourceDir,
      },
    )) {
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
  }

  return fileContents;
}

async function getGroup({ name, group, ext }) {
  let fileContents = '';
  let fileName = name + (ext ? `.${ext}` : '');
  let outputFile = path.join(output, fileName);

  console.log(`Working on group: ${name}`);

  for (let item of group) {
    fileContents += `\n\n------------------------\n`;
    fileContents += `# ${name}\n`;
    fileContents += `------------------------\n`;

    fileContents += await contentsForGit(item);
    fileContents += separator;
  }

  await writeFile(outputFile, fileContents);
}

export default async function getAll() {
  let results = await Promise.allSettled(
    (only.length > 0
      ? sources.filter((source) => only.includes(source.name))
      : sources
    ).map((source) => {
      if ('git' in source) {
        return getgit(source);
      } else if ('group' in source) {
        return getGroup(source);
      }
    }),
  );

  return results;
}
