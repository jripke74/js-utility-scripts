const fs = require("fs");
const path = require("path");

const folder = path.join(process.env.HOME, "Downloads", "test-folder");

const entries = fs.readdirSync(folder);

for (const file of entries) {
  const oldPath = path.join(folder, file);

  if (!fs.statSync(oldPath).isFile()) continue;

  const ext = path.extname(file);
  const base = path.basename(file, ext);

  const newName = base.toLowerCase() + ext.toLowerCase().replace(/'/g, "");

  if (file === newName) continue;

  const tempName = "__temp__" + Date.now() + "_" + Math.random() + ext;
  const tempPath = path.join(folder, tempName);
  const newPath = path.join(folder, newName);

  fs.renameSync(oldPath, tempPath);
  fs.renameSync(tempPath, newPath);

  console.log(`${file} -> ${newName}`);
}

console.log("Finished!");
