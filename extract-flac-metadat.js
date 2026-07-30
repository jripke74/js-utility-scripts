#!/usr/bin/env node

/**
 * Extract metadata from every FLAC file in:
 *
 * ~/Downloads/music-cds
 *
 * including all subdirectories.
 *
 * Output:
 * ~/Downloads/flac-metadata.json
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
const mm = require("music-metadata");

const ROOT = path.join(os.homedir(), "Downloads", "music-cds");
const OUTPUT = path.join(os.homedir(), "Downloads", "flac-metadata.json");

const results = [];

/**
 * Recursively walk directories
 */
async function walk(dir) {
    const entries = await fs.promises.readdir(dir, {
        withFileTypes: true
    });

    for (const entry of entries) {

        // Ignore macOS metadata
        if (entry.name === ".DS_Store") {
            continue;
        }

        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            await walk(fullPath);
            continue;
        }

        if (!entry.name.toLowerCase().endsWith(".flac")) {
            continue;
        }

        console.log("Reading:", fullPath);

        try {

            const metadata = await mm.parseFile(fullPath, {
                native: true
            });

            results.push({

                fileName: path.basename(fullPath),

                fullPath: fullPath,

                relativePath: path.relative(ROOT, fullPath),

                metadata: metadata

            });

        } catch (err) {

            results.push({

                fileName: path.basename(fullPath),

                fullPath: fullPath,

                relativePath: path.relative(ROOT, fullPath),

                error: err.message

            });

        }

    }
}

async function main() {

    console.log("Searching:", ROOT);

    await walk(ROOT);

    await fs.promises.writeFile(
        OUTPUT,
        JSON.stringify(results, null, 4),
        "utf8"
    );

    console.log("");
    console.log("Done.");
    console.log("Files processed:", results.length);
    console.log("Output:", OUTPUT);
}

main().catch(console.error);
