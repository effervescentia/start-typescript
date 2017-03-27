import { relative } from 'path';
import * as tsconfig from 'tsconfig';
import * as ts from 'typescript';
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
  return function typescript(log) {
    log('loading tsconfig.json');

    return tsconfig.load(process.cwd(), opts.configFile)
      .then((tscfg) => {
        log('successfully loaded!');

        return {
          ...DEFAULTS,
          ...tscfg.config.compilerOptions,
          ...opts.compilerOptions,
          ...FORCED
        };
      })
      .then((compilerOpts) => {
        log('converting raw compiler options', compilerOpts);

        return convertOpts(compilerOpts);
      })
      .then((compilerOpts) => {
        log('successfully coverted!');
        const files = input.map((file) => file.path);
        const host = new Host(input, compilerOpts);

        log(files);
        const program = ts.createProgram(files, compilerOpts, host);

        log('transpiling files');
        const results = program.emit();

        ts.getPreEmitDiagnostics(program)
          .concat(results.diagnostics)
          .forEach((diagnostic) => logDiagnostic(diagnostic, log));

        if (results.emitSkipped) {
          throw new Error('emit skipped');
        }
        log('emit successful!');

        return host.emitFiles();
      })
      .catch((err) => {
        log(`compilation failed: ${err.message}`);
        throw err;
      });
  };
};
