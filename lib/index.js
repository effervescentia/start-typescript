import ts from 'typescript';
import tsconfig from 'tsconfig';
import { relative } from 'path';
import Host from './host';

const DEFAULTS = {
  noImplicitAny: false,
  sourceMap: true,
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.CommonJS
};
const FORCED = {
  noEmitOnError: true
};

export default (opts = {}) => (input) => {
  return function buildTypescript (log) {
    return tsconfig.load(process.cwd(), opts.configFile)
      .then((tscfg) => Object.assign({}, DEFAULTS, tscfg.config.compilerOptions, opts.compilerOptions, FORCED))
      .then(convertOpts)
      .then((compilerOpts) => {
        const files = input.map((file) => file.path);
        const host = new Host(input, compilerOpts);
        const program = ts.createProgram(files, compilerOpts, host);
        let results;

        try {
          results = program.emit();
        } catch (e) {
          console.error(e);
        }

        ts.getPreEmitDiagnostics(program)
          .concat(results.diagnostics)
          .forEach((diagnostic) => {
            if (diagnostic.file) {
              const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
              const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
              log(`${relative(process.cwd(), diagnostic.file.fileName)} (${line + 1},${character + 1}): ${message}`);
            }
          });

        return results.emitSkipped ? Promise.reject('emit skipped') : host.emitFiles();
      })
      .catch((err) => log(`compilation failed: ${err.message}`));
  };
};

function convertOpts (compilerOpts) {
  if (compilerOpts.lib) {
    compilerOpts.lib = compilerOpts.lib.map((lib) => `lib.${lib.toLowerCase()}.d.ts`);
  }
  switch (compilerOpts.moduleResolution.toLowerCase()) {
    case 'node':
      compilerOpts.moduleResolution = ts.ModuleResolutionKind.NodeJs;
      break;
    case 'classic':
      compilerOpts.moduleResolution = ts.ModuleResolutionKind.Classic;
      break;
  }
  switch (compilerOpts.target.toLowerCase()) {
    case 'es5':
      compilerOpts.target = ts.ScriptTarget.ES5;
      break;
    case 'es6':
      compilerOpts.target = ts.ScriptTarget.ES5;
      break;
    case 'es2015':
      compilerOpts.target = ts.ScriptTarget.ES2015;
      break;
    case 'es2016':
      compilerOpts.target = ts.ScriptTarget.ES2016;
      break;
    case 'es2017':
      compilerOpts.target = ts.ScriptTarget.ES2017;
      break;
    case 'esnext':
    case 'latest':
      compilerOpts.target = ts.ScriptTarget.ESNext;
      break;
  }
  return compilerOpts;
}
