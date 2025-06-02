import path, { join } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';

import { globby } from 'globby';

let outputFile = path.join('dist', 'llms-full.txt');

export async function createLLMsTxt() {
  let files = await globby('*', { cwd: join(process.cwd(), 'dist') });

  let txt = '';

  for (let file of files) {
    txt += heading(file);

    let contents = await readFile(join(process.cwd(), 'dist', file), 'utf-8');
    txt += contents;

    txt += '\n\n';
  }

  await writeFile(outputFile, txt);
}

const sep = `----------------------------------------------------------`;

function heading(name) {
  return sep + '\n' + sep + '\n' + name + '\n' + sep + '\n' + '\n';
}
