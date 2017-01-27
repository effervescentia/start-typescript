import ts from 'typescript';
import tsconfig from 'tsconfig';
import { relative } from 'path';

const DEFAULTS = {
  sourceMap: true
};
const FORCED = {
  noEmitOnError: true
};

export default (opts = {}) => (input) => {
  return function buildTypescript (log) {
    return tsconfig.load(process.cwd(), opts.configFile)
      .then((tscfg) => Object.assign({}, DEFAULTS, tscfg.config.compilerOptions, opts.compilerOptions, FORCED))
      .then((compilerOpts) => {
        const files = input.map((file) => file.data);
        const program = ts.createProgram(files, compilerOpts);
        const results = program.emit();

        let index = 0;
        ts.getPreEmitDiagnostics(program)
          .concat(results.diagnostics)
          .filter(() => index++ < 20)
          .forEach((diagnostic) => {
            if (diagnostic.file) {
              let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
              let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
              log(`${relative(process.cwd(), diagnostic.file.fileName)} (${line + 1},${character + 1}): ${message}`);
            }
          });

        return results.emitSkipped ? Promise.reject() : input;
      });
  };
};
