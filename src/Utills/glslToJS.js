/**
 * @author DongYi 2018/07/16
 */

const fs = require('fs');
const path = require('path');
const globby = require('globby');

function glslToJavaScript(minify, minifyStateFilePath) {
    fs.writeFileSync(minifyStateFilePath, minify);
    let minifyStateFileLastModified = fs.existsSync(minifyStateFilePath) ? fs.statSync(minifyStateFilePath).mtime.getTime() : 0;

// collect all currently existing JS files into a set, later we will remove the ones
// we still are using from the set, then delete any files remaining in the set.
    let leftOverJsFiles = {};
    globby.sync(['./../../src/Renderer/Shaders/**/*.js']).forEach(function (file) {
        leftOverJsFiles[path.normalize(file)] = true;
    });

    /*globby.sync(['../../Renderer/Shaders/!**!/!*.js']).forEach(function (file) {
        leftOverJsFiles[path.normalize(file)] = true;
    });*/

    let builtinFunctions = [];
    let builtinConstants = [];
    let builtinStructs = [];

    let glslFiles = globby.sync(['../../src/Renderer/Shaders/**/*.glsl']);
    /*let glslFiles = globby.sync(['../../Renderer/Shaders/!**!/!*.glsl']);*/
    glslFiles.forEach(function (glslFile) {
        glslFile = path.normalize(glslFile);
        let baseName = path.basename(glslFile, '.glsl');
        let jsFile = path.join(path.dirname(glslFile), baseName) + '.js';

        // identify built in functions, structs, and constants
        let baseDir = path.join('Source', 'Shaders', 'Builtin');
        if (glslFile.indexOf(path.normalize(path.join(baseDir, 'Functions'))) === 0) {
            builtinFunctions.push(baseName);
        }
        else if (glslFile.indexOf(path.normalize(path.join(baseDir, 'Constants'))) === 0) {
            builtinConstants.push(baseName);
        }
        else if (glslFile.indexOf(path.normalize(path.join(baseDir, 'Structs'))) === 0) {
            builtinStructs.push(baseName);
        }


        delete leftOverJsFiles[jsFile];

        let jsFileExists = fs.existsSync(jsFile);
        let jsFileModified = jsFileExists ? fs.statSync(jsFile).mtime.getTime() : 0;
        let glslFileModified = fs.statSync(glslFile).mtime.getTime();

        if (jsFileExists && jsFileModified > glslFileModified && jsFileModified > minifyStateFileLastModified) {
            return;
        }

        let contents = fs.readFileSync(glslFile, 'utf8');
        contents = contents.replace(/\r\n/gm, '\n');

        let copyrightComments = '';
        let extractedCopyrightComments = contents.match(/\/\*\*(?:[^*\/]|\*(?!\/)|\n)*?@license(?:.|\n)*?\*\//gm);
        if (extractedCopyrightComments) {
            copyrightComments = extractedCopyrightComments.join('\n') + '\n';
        }

        if (minify) {
            contents = glslStripComments(contents);
            contents = contents.replace(/\s+$/gm, '').replace(/^\s+/gm, '').replace(/\n+/gm, '\n');
            contents += '\n';
        }

        contents = contents.split('"').join('\\"').replace(/\n/gm, '\\n\\\n');
        contents = copyrightComments + '\
//This file is automatically rebuilt by the Speed3DGis build process.\n\
class ' + baseName + '{\
static theWord() {\n\
    return "' + contents + '";\n\
}} export {' + baseName + '};';
        fs.writeFileSync(jsFile, contents);
    });


    let generateBuiltinContents = function (contents, builtins, path) {
        let amdPath = contents.amdPath;
        let amdClassName = contents.amdClassName;
        let builtinLookup = contents.builtinLookup;
        for (let i = 0; i < builtins.length; i++) {
            let builtin = builtins[i];
            amdPath = amdPath + ',\n        \'./' + path + '/' + builtin + '\'';
            amdClassName = amdClassName + ',\n        ' + 'czm_' + builtin;
            builtinLookup = builtinLookup + ',\n        ' + 'czm_' + builtin + ' : ' + 'czm_' + builtin;
        }
        contents.amdPath = amdPath;
        contents.amdClassName = amdClassName;
        contents.builtinLookup = builtinLookup;
    };

//generate the JS file for Built-in GLSL Functions, Structs, and Constants
    let contents = {amdPath: '', amdClassName: '', builtinLookup: ''};
    generateBuiltinContents(contents, builtinConstants, 'Constants');
    generateBuiltinContents(contents, builtinStructs, 'Structs');
    generateBuiltinContents(contents, builtinFunctions, 'Functions');

    contents.amdPath = contents.amdPath.replace(',\n', '');
    contents.amdClassName = contents.amdClassName.replace(',\n', '');
    contents.builtinLookup = contents.builtinLookup.replace(',\n', '');

    let fileContents = '\
//This file is automatically rebuilt by the Speed3DGis build process.\n\
define([\n' +
        contents.amdPath +
        '\n    ], function(\n' +
        contents.amdClassName +
        ') {\n\
            \'use strict\';\n\
            return {\n' + contents.builtinLookup + '};\n\
});';
    fs.writeFileSync('../../dist/test.js', fileContents);
}

glslToJavaScript(false, 'test.state');