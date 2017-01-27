import Start from 'start';
import reporter from 'start-pretty-reporter';
import tape from 'start-tape';
import tapSpec from 'tap-spec';
import { restart } from 're-start';

const start = Start(reporter());

module.exports = restart(start, { test: tape, testOpts: tapSpec });
