import path from 'path';
import { expect } from 'chai';
import ts from 'typescript';

import convertOpts, {
  convertLibs,
  convertModule,
  convertTarget,
  convertType
} from '../../lib/convert';

describe('convertOpts()', () => {
  it('applies defaults', () => {
    const opts = convertOpts({});

    expect(opts).to.eql({
      types: [],
      lib: [],
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      target: ts.ScriptTarget.ES5
    });
  });
});

describe('convertTarget()', () => {
  it('should apply default', () => {
    expect(convertTarget('')).to.eq(ts.ScriptTarget.ES5);
  });

  it('should convert to enum', () => {
    expect(convertTarget('es2016')).to.eq(ts.ScriptTarget.ES2016);
  });

  it('should ignore case', () => {
    expect(convertTarget('eSnEXt')).to.eq(ts.ScriptTarget.ESNext);
  });
});

describe('convertModule()', () => {
  it('should apply default', () => {
    expect(convertModule('')).to.eq(ts.ModuleResolutionKind.NodeJs);
  });

  it('should convert to enum', () => {
    expect(convertModule('classic')).to.eq(ts.ModuleResolutionKind.Classic);
  });

  it('should ignore case', () => {
    expect(convertModule('clASSic')).to.eq(ts.ModuleResolutionKind.Classic);
  });
});

describe('convertType()', () => {
  it('should add module path', () => {
    expect(convertType('node').split(path.sep)
      .slice(-3)).to.eql(['node_modules', '@types', 'node']);
  });

  it('should preserve case', () => {
    expect(...convertType('casedModule').split(path.sep)
      .slice(-1)).to.eq('casedModule');
  });
});

describe('convertLibs()', () => {
  it('should add file *ixes', () => {
    expect(convertLibs('es6')).to.eq('lib.es6.d.ts');
  });

  it('should ignore case', () => {
    expect(convertLibs('scRIPtHOsT')).to.eq('lib.scripthost.d.ts');
  });
});
