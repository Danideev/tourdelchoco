// Scan: busca .map( cuyo callback no tenga key= en las 6 líneas siguientes
import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";

const ROOT = "src";
const files = [];
const walk = (dir) => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".tsx")) files.push(p);
  }
};
walk(ROOT);

for (const f of files) {
  const lines = readFileSync(f, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    if (!line.includes(".map(")) return;
    const next = lines.slice(i + 1, i + 7).join("\n");
    if (!next.includes("key=")) {
      console.log(`${f}:${i + 1}  ${line.trim().slice(0, 90)}`);
    }
  });
}
