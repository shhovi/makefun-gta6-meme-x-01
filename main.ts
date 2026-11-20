// gta6-meme-x-01 entry program (Node 22, standard library only).
// The entry is the X post itself; this program only hands POST.json to the
// gate by copying it from the repository root to the output directory.
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Fail loudly on a malformed POST.json instead of handing the gate junk:
// it must be a JSON object whose url names an X post.
const post = JSON.parse(readFileSync(join(botDir, 'POST.json'), 'utf8')) as { url?: unknown };
if (typeof post.url !== 'string' || !/^https:\/\/x\.com\/[^/]+\/status\/\d+$/.test(post.url)) {
  console.error(`POST.json does not name an X post: ${JSON.stringify(post)}`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
try {
  copyFileSync(join(botDir, 'POST.json'), join(outputDir, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${botDir}: ${(err as Error).message}`);
  process.exit(1);
}
