#!/usr/bin/env node

import { createCommand } from "@commander-js/extra-typings";
import generateCommand from "../src/cli/command/generate.command.js";

const program = createCommand();

program
    .name('barrels')
    .description('Generate barrels')
    .version('{version}');

program
    .addCommand(generateCommand);

program.parse();
