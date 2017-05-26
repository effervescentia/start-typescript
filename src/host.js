import * as ts from 'typescript';

// returned by CScript sys environment
const UNSUPPORTED_FILE_ENCODING_ERR_CODE = -2147024809;

/* beautify preserve:start */
export const keyByPath = (map, file) => Object.assign(map, { [file.path]: file });
/* beautify preserve:end */

/* eslint-disable class-methods-use-this, immutable/no-mutation */
export default class CompilerHost {

  outFiles = {};

  constructor(input, compilerOpts) {
    this.files = input.reduce(keyByPath, {});
    this.compilerOpts = compilerOpts;
  }

  useCaseSensitiveFileNames() {
    return ts.sys.useCaseSensitiveFileNames;
  }

  getNewLine() {
    return ts.getNewLineCharacter(this.compilerOpts);
  }

  getDefaultLibLocation() {
    return ts.getDirectoryPath(ts.normalizePath(ts.sys.getExecutingFilePath()));
  }

  getDefaultLibFileName(options) {
    return ts.combinePaths(this.getDefaultLibLocation(), ts.getDefaultLibFileName(options));
  }

  getCurrentDirectory() {
    return ts.sys.getCurrentDirectory();
  }

  getCanonicalFileName(fileName) {
    return this.useCaseSensitiveFileNames() ? fileName : fileName.toLowerCase();
  }

  fileExists(fileName) {
    return !!this.files[fileName] || ts.sys.fileExists(fileName);
  }

  readFile(fileName) {
    if (this.files[fileName]) {
      return this.files[fileName].data;
    }

    return ts.sys.readFile(fileName);
  }

  getSourceFile(fileName, languageVersion, onError) {
    let text = null;

    if (this.files[fileName]) {
      text = this.files[fileName].data;
    } else {
      try {
        text = ts.sys.readFile(fileName, this.compilerOpts.charset);
      } catch (e) {
        if (onError) {
          onError(e.number === UNSUPPORTED_FILE_ENCODING_ERR_CODE ?
            ts.createCompilerDiagnostic(ts.Diagnostics.Unsupported_file_encoding).messageText :
            e.message);
        }
        text = '';
      }
    }

    if (text !== null) {
      return ts.createSourceFile(fileName, text, languageVersion, this.setParentNodes);
    }
  }

  writeFile(fileName, data) {
    this.outFiles[fileName] = {
      path: fileName,
      data,
      map: null
    };
  }

  emitFiles() {
    return Object.keys(this.outFiles)
      .reduce((emitted, file) => {
        if (file.endsWith('.map')) {
          // eslint-disable-next-line no-magic-numbers, max-len
          this.outFiles[file.substring(0, file.length - 4)].map = JSON.parse(this.outFiles[file].data);
        } else {
          const sourceFile = this.outFiles[file];
          // start-write will add these back for us
          const match = sourceFile.data.match(/\/\/# sourceMappingURL=.+$/);

          if (match) {
            // eslint-disable-next-line no-magic-numbers
            sourceFile.data = sourceFile.data.substr(0, match.index).trim();
          }

          emitted.push(sourceFile);
        }

        return emitted;
      }, []);
  }
}
