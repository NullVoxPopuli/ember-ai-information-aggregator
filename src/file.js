import path from 'node:path';
import os from 'node:os';
import { mkdir } from 'node:fs/promises';

export const separator = `

---

`;

const CWD = process.cwd();

export const output = path.join(CWD, 'dist');
export const tmp = path.join(os.tmpdir(), `ember-ai-${Date.now()}`);

await mkdir(tmp, { recursive: true });
await mkdir(output, { recursive: true });
