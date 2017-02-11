import path from 'path';
import test from 'tape';
import ts from 'typescript';

import convertOpts, {
  convertLibs,
  convertModule,
  convertTarget,
  convertType
} from '../../lib/convert';

test('convertOpts()', (t) => {
  t.deepEqual(
    convertOpts({ moduleResolution: '', target: '' }), {
      types: [],
      lib: [],
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      target: ts.ScriptTarget.ES5
    }, 'applies defaults');

  t.end();
});

test('convertTarget()', (t) => {
  t.equal(
    convertTarget(''),
    ts.ScriptTarget.ES5,
    'applies default'
  );

  t.equal(
    convertTarget('es2016'),
    ts.ScriptTarget.ES2016,
    'converts to enum'
  );

  t.equal(
    convertTarget('eSnEXt'),
    ts.ScriptTarget.ESNext,
    'ignores case'
  );

  t.end();
});

test('convertModule()', (t) => {
  t.equal(
    convertModule(''),
    ts.ModuleResolutionKind.NodeJs,
    'applies default'
  );

  t.equal(
    convertModule('classic'),
    ts.ModuleResolutionKind.Classic,
    'converts to enum'
  );

  t.equal(
    convertModule('clASSic'),
    ts.ModuleResolutionKind.Classic,
    'ignores case'
  );

  t.end();
});

test('convertType()', (t) => {
  /* beautify preserve:start */
  t.deepEqual(
    convertType('node').split(path.sep)
      .slice(-3),
    ['node_modules', '@types', 'node'],
    'adds module path'
  );

  t.equal(
    ...convertType('casedModule').split(path.sep)
      .slice(-1),
    'casedModule',
    'preserves case'
  );
  /* beautify preserve:end */

  t.end();
});

test('convertLibs()', (t) => {
  t.equal(
    convertLibs('es6'),
    'lib.es6.d.ts',
    'add library file *ixes'
  );

  t.equal(
    convertLibs('scRIPtHOsT'),
    'lib.scripthost.d.ts',
    'ignores case'
  );

  t.end();
});
