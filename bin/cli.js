#! /usr/bin/env node

const { ParseFile } = require('../index');
const fs = require("fs");
const path = require('path');

const argv = process.argv.slice(2);
if (argv.length === 2) {
    process.exit(1);
}
const [source,rootDirectory] = argv;
if(source === '--setup' && rootDirectory === 'react'){
    const working_directory = process.cwd();
    const webpack_config_file = path.join(working_directory,'/node_modules/react-scripts/config/webpack.config.js');
    const webpack_config_mod = `
    const actual_config = module.exports;
    module.exports = function(){
        const config = actual_config.call(this,...arguments);
        config.module.rules.push({
            test:/(\.xmd\.[a-zA-Z]+)$/,
            exclude:/node_modules/,
            loader: require('xyntax/lib/loaders/react')
        })
    }
    `;
    fs.appendFileSync(webpack_config_file,webpack_config_mod);
    process.exit(0);
}
ParseFile(source,rootDirectory);
process.exit(0);