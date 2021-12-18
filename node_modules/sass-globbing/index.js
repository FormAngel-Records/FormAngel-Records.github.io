'use strict';

var fse = require('fs-extra'),
    glob = require('glob'),
    path = require('path');

function SassGlobbing(src, dest, options) {
    this.src = [];
    this.dest = dest;
    this.options = {
        useSingleQuotes: false,
        signature: '/* generated with sass-globbing */'
    };

    Object.assign(this.options, options);

    if (!!src) {
        if (Array.isArray(src)) {
            for (let pattern of src) {
                var exclusion = pattern.indexOf('!') === 0;

                if (exclusion) {
                    var exclusionPaths = glob.sync(pattern.slice(1));
                    this.src = this.src.filter(function(srcPath) {
                        return exclusionPaths.indexOf(srcPath) === -1;
                    })
                } else {
                    this.src = this.src.concat(glob.sync(pattern));
                }
            }
        } else {
            this.src = glob.sync(src);
        }
    }
}

SassGlobbing.prototype.build = function() {
    var dest = this.dest;

    var importMapFile = '';
    var importStatement = '';
    var importStatements = [];

    if (typeof this.options.signature === 'string' && this.options.signature !== '') {
        this.options.signature = this.options.signature + '\n\n';
    } else if (this.options.signature === false) {
        this.options.signature = '';
    }

    importMapFile = this.options.signature;

    var quoteSymbol = '"';
    if (this.options.useSingleQuotes === true) {
        quoteSymbol = '\'';
    }

    this.src.forEach(function(filePath) {

        if (filePath === dest) {
            return;
        }

        var importPath = path.dirname(path.relative(path.dirname(dest), filePath));
        var fileName = path.basename(filePath);
        fileName = fileName.replace(/^_/, '');
        importPath += path.sep + fileName.replace(path.extname(fileName), '');

        importStatement = '@import ' + quoteSymbol + importPath.replace(/\\/g, '/').replace(/^\.\//, '') + quoteSymbol + ';\n';

        if (importStatements.indexOf(importStatement) > -1) {
            throw new Error('There is also a partial next to file "' + filePath + '" - merge partial _' + fileName + ' and ' + fileName + ' to solve this issue');
        }

        importStatements.push(importStatement);
        importMapFile += importStatement;
    });

    fse.outputFileSync(dest, importMapFile);
}

module.exports = SassGlobbing;
