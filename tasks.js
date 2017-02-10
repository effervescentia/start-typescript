import tape from 'start-tape';
import tapSpec from 'tap-spec';
import { restart } from 're-start';

module.exports = restart({ test: tape, testOpts: tapSpec });
