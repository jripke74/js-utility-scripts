# FLAC Metadata Extraction Guide

This guide explains how to extract metadata from every `.flac` file
under your `~/Downloads/music-cds` folder (including all subdirectories)
and save the results to a JSON file.

## What the Program Does

-   Recursively searches `~/Downloads/music-cds`
-   Includes all subdirectories
-   Finds every `.flac` file
-   Extracts all metadata using the `music-metadata` library
-   Creates one JSON entry per FLAC file
-   Writes the results to:

``` text
~/Downloads/flac-metadata.json
```

------------------------------------------------------------------------

# JavaScript Program

Save the following as:

``` text
~/Downloads/extract-flac-metadata.js
```

``` javascript
#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");
const mm = require("music-metadata");

const ROOT = path.join(os.homedir(), "Downloads", "music-cds");
const OUTPUT = path.join(os.homedir(), "Downloads", "flac-metadata.json");

const results = [];

async function walk(dir) {
    const entries = await fs.promises.readdir(dir, {
        withFileTypes: true
    });

    for (const entry of entries) {

        if (entry.name === ".DS_Store") continue;

        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            await walk(fullPath);
            continue;
        }

        if (!entry.name.toLowerCase().endsWith(".flac")) continue;

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
```

------------------------------------------------------------------------

# Metadata Extracted

The `music-metadata` library can extract:

-   Title
-   Artist
-   Album
-   Album Artist
-   Composer
-   Conductor
-   Lyricist
-   Genre
-   Year
-   Date
-   Track Number
-   Disc Number
-   ISRC
-   MusicBrainz IDs
-   ReplayGain
-   BPM
-   Comments
-   Lyrics
-   Publisher
-   Copyright
-   Encoder
-   Album Art
-   Duration
-   Sample Rate
-   Channels
-   Bit Depth
-   Bitrate
-   Codec
-   Lossless Flag
-   Container Type
-   Native Vorbis Comments
-   Custom Tags

------------------------------------------------------------------------

# Install Node.js

Install Homebrew (if needed):

``` bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Install Node.js:

``` bash
brew install node
```

Verify installation:

``` bash
node -v
```

------------------------------------------------------------------------

# Install Required Library

``` bash
cd ~/Downloads
npm install music-metadata
```

------------------------------------------------------------------------

# Run the Program

``` bash
cd ~/Downloads
node extract-flac-metadata.js
```

------------------------------------------------------------------------

# Output

After the program completes, you'll have:

``` text
~/Downloads/flac-metadata.json
```

Each FLAC file is represented by one JSON object containing the complete
metadata returned by the parser.
