import { expect } from 'chai';

/* eslint-disable no-return-assign, no-unused-expressions */

import CompilerHost from '../../lib/host';

describe('CompilerHost', () => {

  describe('constructor()', () => {
    let host = null;

    beforeEach(() => host = new CompilerHost([], {}));

    it('should have empty outFiles', () => {
      expect(host.outFiles).to.eql({});
    });

    it('should have empty files', () => {
      expect(host.outFiles).to.eql({});
    });

    it('should set compilerOpts', () => {
      const opts = {};

      host = new CompilerHost([], opts);

      expect(host.compilerOpts).to.eq(opts);
    });

    it('should register file paths', () => {
      const file1 = { path: '/1' };
      const file2 = { path: '/2' };
      const input = [file1, file2];

      host = new CompilerHost(input, {});

      expect(Object.keys(host.files)).to.eql(['/1', '/2']);

      expect(host.files['/2']).to.eq(file2);
    });
  });

  describe('writeFile()', () => {
    it('should register file metadata', () => {
      const data = {};
      const host = new CompilerHost([], {});

      host.writeFile('myModule', data);

      expect(Object.keys(host.outFiles)).to.eql(['myModule']);

      expect(Object.keys(host.outFiles.myModule)).to.eql(['path', 'data', 'map']);

      expect(host.outFiles.myModule.path).to.eq('myModule');

      expect(host.outFiles.myModule.data).to.eq(data);

      expect(host.outFiles.myModule.map).to.be.null;
    });
  });
});
