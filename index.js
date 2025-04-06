/**
 * When creating a GPT, you are only allowed 20 files.
 *
 * So... we have to concatenate
 *
 * Each file can be up to 512MB haha
 *
 */
import { inspect } from 'node:util';
import assert from 'node:assert';

import { default as github } from './src/github.js';
import { default as devto } from './src/dev-to.js';

const sources = {
  github,
  devto,
};

let [, , ...args] = process.argv;

let source = args[0];
let todo = [];

assert(
  Object.keys(sources).includes(source),
  `invalid source passed to script. Received: \`${source}\`. Allowed: ${Object.keys(sources).join(', ')}`,
);

if (source) {
  console.log(`Using source: ${source}`);
  todo.push(sources[source]);
} else {
  todo = Object.values(sources);
}

assert(todo.length > 0, `There are no active sources`);

let results = await Promise.allSettled(todo.map((fn) => fn()));

console.log(inspect(results, false, null));
