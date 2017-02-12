# start-typescript


[![npm](https://img.shields.io/npm/v/start-typescript.svg?style=flat-square)](https://www.npmjs.com/package/start-typescript)
[![linux build](https://img.shields.io/circleci/project/github/effervescentia/start-typescript/master.svg?label=linux&style=flat-square)](https://circleci.com/gh/effervescentia/start-typescript)
[![windows build](https://img.shields.io/appveyor/ci/effervescentia/start-typescript/master.svg?label=windows&style=flat-square)](https://ci.appveyor.com/project/effervescentia/start-typescript)
[![coverage](https://img.shields.io/codecov/c/github/effervescentia/start-typescript/master.svg?style=flat-square)](https://codecov.io/github/effervescentia/start-typescript)
[![deps](https://david-dm.org/effervescentia/start-typescript.svg?style=flat-square)](https://david-dm.org/effervescentia/start-typescript)

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
[![greenkeeper](https://badges.greenkeeper.io/effervescentia/start-typescript.svg)](https://greenkeeper.io/)

Typescript compilation task for [Start](https://github.com/start-runner/start)

## Install

```sh
npm install --save-dev start-typescript
# or
yarn add --dev start-typescript
```

## Usage (Build)

```js
import Start from 'start';
import reporter from 'start-pretty-reporter';
import files from 'start-files';
import read from 'start-read';
import write from 'start-write';
import typescript from 'start-typescript';

const start = Start(reporter());

export const task = () => start(
  files('lib/index.ts'), // must reference a single entrypoint
  read(),
  typescript(),
  write('build/')
);
```

## Usage (Test)

```js
import Start from 'start';
import reporter from 'start-pretty-reporter';
import files from 'start-files';
import read from 'start-read';
import write from 'start-write';
import split from 'start-split';
import mocha from 'start-mocha';
import typescript from 'start-typescript';

const start = Start(reporter());

export const task = () => start(
  files('test/index.ts'), // must reference a single entrypoint
  read(),
  typescript(),
  split({
    lib: () => [write('.scratch/lib')],
    test: () => [write('.scratch/test')]
  }),
  files('.scratch/test/**/*.js'),
  mocha()
);
```

This task relies on `[{ path, data, map }]` input and provides the same, see [documentation](https://github.com/start-runner/start#readme) for details.

## Arguments

`typescript(opts)`

*   `opts`
    *   `configFile` - path to an alternate `tsconfig.json`
    *   `compilerOptions` - tsconfig `compilerOptions` as specified
        [here](http://www.typescriptlang.org/docs/handbook/compiler-options.html)
