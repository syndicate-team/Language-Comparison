// deno run --allow-run=deno --allow-read=README.md --allow-write=README.md scripts/fix.ts README.md

import { readLines } from "https://deno.land/std@0.121.0/io/buffer.ts";

type Table = Record<string, Record<string, boolean>>;

const sortKeys = <T>(obj: Record<string, T>) =>
  Object.fromEntries(
    Object.keys(obj).sort().sort((a, b) =>
      a.length < b.length ? -1 : a.length > b.length ? 1 : 0
    ).map((k) => [k, obj[k]]),
  );

const sortTable = (obj: Table): Table =>
  Object.fromEntries(
    Object.keys(obj).sort().sort((a, b) =>
      a.length < b.length ? -1 : a.length > b.length ? 1 : 0
    ).map((k) => [k, sortKeys(obj[k])]),
  );

const parseTable = async (table: Deno.Reader) => {
  const keys: string[] = [];

  const result: Table = {};

  for await (const line of readLines(table)) {
    if (keys.length === 0 && line.startsWith("|")) {
      keys.splice(0, 0, ...line.split("|").slice(2, -1).map((x) => x.trim()));
      continue;
    }

    if (keys.length > 0 && line.startsWith("|")) {
      const row = line.split("|").slice(1, -1).map((x) => x.trim());
      if (row.every((col) => [...col].every((c) => c === "-"))) {
        continue;
      }
      const feature = row[0];
      if (feature === "**Sum**") {
        continue;
      }
      const support = row.slice(1).map((x) => x === "✅");
      for (let i = 0; i < support.length; i++) {
        result[keys[i]] = result[keys[i]] ?? {};
        result[keys[i]][feature] = support[i];
      }
    }
  }
  return result;
};

const stringifyTable = (table: Table, sum = false) => {
  let result = "";
  const keys = Object.keys(table);
  result += "||" + keys.join("|") + "|\n";
  result += "|-|" + keys.map(() => "-").join("|") + "|\n";
  const features = [
    ...new Set(Object.values(table).flatMap((x) => Object.keys(x))),
  ];
  for (const feature of features) {
    result += "|" + feature + "|";
    for (const lang of Object.values(table)) {
      result += (lang[feature] ? "✅" : "❌") + "|";
    }
    result += "\n";
  }
  if (sum) {
    const summed = Object.entries(table).map(([k, v]) =>
      Object.values(v).filter((x) => x).length
    );

    result += "|**Sum**|" + summed.join("|") + "|\n";
  }
  return result;
};

const [input, output = input] = Deno.args;

const file = await Deno.open(input);
const result = await parseTable(file);
file.close();

const sorted = sortTable(result);

const out = `# Languages

<!-- ✅❌❓⚠️ -->

${stringifyTable(sorted, true)}
`;
await Deno.writeTextFile(output, out);

await Deno.run({
  cmd: ["deno", "fmt", output],
}).status();
