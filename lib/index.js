import { relative } from 'path';
import tsconfig from 'tsconfig';
import ts from 'typescript';
import convertOpts from './convert';
import Host from './host';

const DEFAULTS = {
  noImplicitAny: false,
  sourceMap: true
};
const FORCED = { noEmitOnError: true };

export const formatMsg = (fileName, [line, character], message) =>
  // eslint-disable-next-line no-magic-numbers
  `${relative(process.cwd(), fileName)} (${line + 1},${character + 1}): ${message}`;

export const logDiagnostic = (diagnostic, log) => {
  if (diagnostic.file) {
    const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');

    log(formatMsg(diagnostic.file.fileName, [line, character], message));
  }
};

export default (opts = {}) => (input) => {
  return function buildTypescript(log) {
    return tsconfig.load(process.cwd(), opts.configFile)
      .then((tscfg) => Object.assign({},
        DEFAULTS,
        tscfg.config.compilerOptions,
        opts.compilerOptions,
        FORCED))
      .then(convertOpts)
      .then((compilerOpts) => {
        const files = input.map((file) => file.path);
        const host = new Host(input, compilerOpts);
        const program = ts.createProgram(files, compilerOpts, host);
        const results = program.emit();

        ts.getPreEmitDiagnostics(program)
          .concat(results.diagnostics)
          .forEach((diagnostic) => logDiagnostic(diagnostic, log));

        if (results.emitSkipped) {
          throw new Error('emit skipped');
        }

        return host.emitFiles();
      })
      .catch((err) => log(`compilation failed: ${err.message}`));
  };
};
