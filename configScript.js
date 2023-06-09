import { basename } from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';
import {promptQ} from "./helper.js"
import { writeFileSync } from 'fs';

const configDocs = {
    "token": "Your discord token",
    "audioLengthSeconds": "How long the audio file should look like when sent (in seconds)",
}

const beginConfiguring = async () => {
    let cfg = {...config};
    for(const key of Object.keys(cfg)){
        console.clear();

        console.log(`\n\n[Leave blank to continue]\n${key} - ${configDocs[key]} (current value: ${cfg[key]})`);
        const value = await promptQ(`\nNew value for ${key}: `);
        if(value === "") continue;
        cfg[key] = value;
    }

    if(JSON.stringify(cfg) == JSON.stringify(config)) return console.log("No changes were made, exiting.");
    console.clear();

    writeFileSync("./config.js", `${`// THIS FILE IS AUTOGENERATED. IF YOU WANT TO SETUP CONFIG USE BUILTIN EDITOR\n`.repeat(3)}\nexport default ${JSON.stringify(cfg, null, 4)}`);
    console.log(Object.entries(cfg).map(([key, value]) => `${key}: ${value}`).join("\n"));
}


// Check if the script is being run directly
;(() => {
    const modulePath = fileURLToPath(import.meta.url);
    if (process.argv[1] === modulePath) {
        return beginConfiguring();
    }
    console.log(`This script (${basename(modulePath)}) is being imported from another module, please run it directly.`);
})();