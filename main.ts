// main.ts — entrypoint. Copies game/ and screenshots/ into the output
// directory and writes dossier.json with buildDossier from
// vendor/makefun-game.ts. Node 22 standard library only.
import { cp, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-game.ts";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

await mkdir(join(outDir, "game"), { recursive: true });
await mkdir(join(outDir, "screenshots"), { recursive: true });
await cp(join(repoRoot, "game"), join(outDir, "game"), { recursive: true });
await cp(join(repoRoot, "screenshots"), join(outDir, "screenshots"), {
  recursive: true,
});

const dossier = await buildDossier(outDir, { text_max_bytes: 163840 });
await writeFile(join(outDir, "dossier.json"), dossier);
console.log(`wrote ${outDir}/dossier.json (${dossier.length} bytes)`);
