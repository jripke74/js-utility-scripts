const fs = require("fs");
const path = require("path");

const folder = path.join(process.env.HOME, "Downloads", "music-cds");

function renameFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      renameFiles(fullPath);
      continue;
    }

    if (entry.name === ".DS_Store") {
      continue;
    }

    const ext = path.extname(entry.name);
    const base = path.basename(entry.name, ext);

    const newName =
      base
        .toLowerCase()
        .replace(/'/g, "")
        .replace(/\./g, "-")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-") + ext.toLowerCase();

    if (entry.name === newName) continue;

    const tempName = "__temp__" + Date.now() + "_" + Math.random() + ext;
    const tempPath = path.join(dir, tempName);
    const newPath = path.join(dir, newName);

    fs.renameSync(fullPath, tempPath);
    fs.renameSync(tempPath, newPath);

    console.log(`${entry.name} -> ${newName}`);
  }
}

renameFiles(folder);
console.log("Finished!");
