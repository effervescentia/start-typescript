import test from 'tape';

import CompilerHost from '../../lib/host';

test('CompilerHost', (t) => {
  const opts = {};
  let host = new CompilerHost([], opts);

  t.deepEqual(host.outFiles, {}, 'initializes empty outFiles');

  t.deepEqual(host.files, {}, 'convert empty input');

  t.equal(host.compilerOpts, opts, 'uses opts');

  /* conver input */

  const file1 = { path: '/1' };
  const file2 = { path: '/2' };
  const input = [file1, file2];

  host = new CompilerHost(input, {});

  t.deepEqual(Object.keys(host.files), ['/1', '/2'], 'registers file path');

  t.deepEqual(host.files['/2'], file2, 'registers file data');

  t.end();
});

test('CompilerHost.writeFile()', (t) => {
  const data = {};
  const host = new CompilerHost([], {});

  host.writeFile('myModule', data);

  t.deepEqual(Object.keys(host.outFiles), ['myModule'], 'registers file');

  t.deepEqual(Object.keys(host.outFiles.myModule), ['path', 'data', 'map'], 'has metadata');

  t.equal(host.outFiles.myModule.path, 'myModule', 'registers path');

  t.equal(host.outFiles.myModule.data, data, 'registers data');

  t.equal(host.outFiles.myModule.map, null, 'has null map');

  t.end();
});
