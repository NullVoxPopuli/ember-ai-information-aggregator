import { writeFile } from 'node:fs/promises';
import { output } from './file.js';
import { join } from 'node:path';

const outputFile = join(output, 'other-llms-texts.md');

const URLs = [
  /**
    * WarpDrive is the new version of ember-data
    */
`https://warp-drive.io/llms-full.txt`,
];

async function fetchAll() {
  return await Promise.all(URLs.map(async url => {
    let response = await fetch(url);
    let text = await response.text();

    return {
      text,
      url,
    };
  }))
}

export default async function getAll() {
   let keep = await fetchAll();


  let text = '';

  for (let article of keep) {
    text += '\n\n';
    text += '-----------------------------------------------------------';
    text += `LLMs Text from URL: ${article.url}`;
    text += '-----------------------------------------------------------';
    text += article.text;
    text += '\n\n';
  }

  await writeFile(outputFile, text);

  return { 'other llms texts': 'success' };
}
