# start-typescript


[![npm](https://img.shields.io/npm/v/start-typescript.svg?style=flat-square)](https://www.npmjs.com/package/start-typescript)
[![linux build](https://img.shields.io/circleci/project/github/benteichman/start-typescript/master.svg?label=linux&style=flat-square)](https://circleci.com/gh/benteichman/start-typescript)
[![windows build](https://img.shields.io/appveyor/ci/benteichman/start-typescript/master.svg?label=windows&style=flat-square)](https://ci.appveyor.com/project/benteichman/start-typescript)
[![coverage](https://img.shields.io/codecov/c/github/benteichman/start-typescript/master.svg?style=flat-square)](https://codecov.io/github/benteichman/start-typescript)
[![deps](https://david-dm.org/benteichman/start-typescript.svg?style=flat-square)](https://david-dm.org/benteichman/start-typescript)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
[![greenkeeper](https://badges.greenkeeper.io/benteichman/start-typescript.svg)](https://greenkeeper.io/)

typescript task checker for [Start](https://github.com/start-runner/start)

## Install

```sh
npm install --save-dev start-typescript
# or
yarn add --dev start-typescript
```

## Usage

```js
import Start from 'start';
import reporter from 'start-pretty-reporter';
import files from 'start-files';
import startTypescript from 'start-typescript';

const start = Start(reporter());

export const task = () => start(
  files([ 'lib/**/*.js', 'test/**/*.js' ]),
  startTypescript()
);
```

This task relies on array of files and provides the same, see [documentation](https://github.com/start-runner/start#readme) for details.

## Arguments

`startTypescript(<ARG1>, <ARG2>)`

* `<ARGUMENT NAME>` – `<ARGUMENT DESCRIPTION>`
