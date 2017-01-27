import ts from 'typescript';
import tsconfig from 'tsconfig';
import { relative } from 'path';
import Host from './host';

const DEFAULTS = {
  noImplicitAny: true,
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
      .then((tscfg) => Object.assign({}, DEFAULTS, FORCED))
      // .then((tscfg) => Object.assign({}, DEFAULTS, tscfg.config.compilerOptions, opts.compilerOptions, FORCED))
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
              let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
              let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
              log(`${relative(process.cwd(), diagnostic.file.fileName)} (${line + 1},${character + 1}): ${message}`);
            }
          });

        return results.emitSkipped ? Promise.reject() : host.emitFiles();
      });
  };
};
