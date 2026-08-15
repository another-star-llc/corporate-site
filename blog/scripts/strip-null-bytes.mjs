import { readdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outputDirectory = fileURLToPath(new URL('../../dist/blog/', import.meta.url));

async function removeNullBytes(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await removeNullBytes(path);
      return;
    }

    if (extname(entry.name) !== '.html') return;

    const content = await readFile(path);
    if (!content.includes(0)) return;

    await writeFile(path, Buffer.from(content.filter((byte) => byte !== 0)));
  }));
}

await removeNullBytes(outputDirectory);
