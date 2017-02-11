import { join } from 'path';
import ts from 'typescript';

export const convertLibs = (lib) => `lib.${lib.toLowerCase()}.d.ts`;

export const convertType = (type) => join(process.cwd(), 'node_modules', '@types', type);

export const convertModule = (module) => {
  switch (module.toLowerCase()) {
    case 'classic':
      return ts.ModuleResolutionKind.Classic;
    case 'node':
    default:
      return ts.ModuleResolutionKind.NodeJs;
  }
};

export const convertTarget = (target) => {
  switch (target.toLowerCase()) {
    case 'es6':
      return ts.ScriptTarget.ES5;
    case 'es2015':
      return ts.ScriptTarget.ES2015;
    case 'es2016':
      return ts.ScriptTarget.ES2016;
    case 'es2017':
      return ts.ScriptTarget.ES2017;
    case 'esnext':
    case 'latest':
      return ts.ScriptTarget.ESNext;
    case 'es5':
    default:
      return ts.ScriptTarget.ES5;
  }
};

export default function(compilerOpts) {
  return Object.assign(compilerOpts, {
    lib: (compilerOpts.lib || []).map(convertLibs),
    types: (compilerOpts.types || []).map(convertType),
    moduleResolution: convertModule(compilerOpts.moduleResolution),
    target: convertTarget(compilerOpts.target)
  });
}
