var assert = require('assert');
var should = require('should');
var sass = require('node-sass');

import sassport from '../dist/index.js';

var assertRenderSync = require('./util/assertRenderSync.js');

describe('Sassport.globals', function() {

  describe('standard JS values', function() {
    var testModule = sassport.module('test');

    testModule.globals({
      '$string': 'foobar',
      '$number': 123.456,
      '$list': ['a', 'b', 'c'],
      '$map': { a: 1, b: 2, c: 3 },
      '$boolean': false 
    });

    it('should convert plain JS values to Sass values', function(done) {    
      assertRenderSync(
        sassport([testModule]),
        '@import "test"; test { string: inspect($string); number: inspect($number); list: inspect($list); map: inspect($map); boolean: inspect($boolean); }',
        'test{string:foobar;number:123.456;list:a, b, c;map:(a: 1, b: 2, c: 3);boolean:false}\n',
        done);
    });
  });

  describe('variables deprecation', function() {
    var testModule = sassport.module('test');

    testModule.variables({
      '$string': 'foobar'
    });

    it('should still work with legacy .variables()', function(done) {    
      assertRenderSync(
        sassport([testModule]),
        '@import "test"; test { string: inspect($string); }',
        'test{string:foobar}\n',
        done);
    });
  });

  describe('standard JS value types', function() {
    var testModule = sassport.module('test');

    testModule.globals({
      '$string': 'foobar',
      '$number': 123.456,
      '$list': ['a', 'b', 'c'],
      '$map': { a: 1, b: 2, c: 3 },
      '$boolean': false,
      '$null': null
    });

    it('should map JS value types to Sass types correctly', function(done) {    
      assertRenderSync(
        sassport([testModule]),
        '@import "test"; test { string: type-of($string); number: type-of($number); list: type-of($list); map: type-of($map); boolean: type-of($boolean); null: type-of($null); }',
        'test{string:string;number:number;list:list;map:map;boolean:bool;null:null}\n',
        done);
    });
  });

  describe('Sass value types', function() {
    var testModule = sassport.module('test');
    var sassList = sass.types.List(3);
    sassList.setValue(0, sass.types.String('a'));
    sassList.setValue(1, sass.types.String('b'));
    sassList.setValue(2, sass.types.String('c'));

    var sassMap = sass.types.Map(3);
    sassMap.setKey(0, sass.types.String('a'));
    sassMap.setKey(1, sass.types.String('b'));
    sassMap.setKey(2, sass.types.String('c'));
    sassMap.setValue(0, sass.types.String('one'));
    sassMap.setValue(1, sass.types.String('two'));
    sassMap.setValue(2, sass.types.String('three'));

    testModule.globals({
      '$string': sass.types.String('foobar'),
      '$number': sass.types.Number(123.456),
      '$number-unit': sass.types.Number(123.456, 'px'),
      '$color': sass.types.Color(200, 200, 200, 0.8),
      '$list': sassList,
      '$map': sassMap,
      '$boolean': sass.types.Boolean(false),
      '$null': sass.types.Null()
    });

    it('should map JS value types to Sass types correctly', function(done) {    
      assertRenderSync(
        sassport([testModule]),
        '@import "test"; test {string: type-of($string); number: type-of($number); number-unit: type-of($number-unit); color: type-of($color); list: type-of($list); map: type-of($map); boolean: type-of($boolean); null: type-of($null); }',
        'test{string:string;number:number;number-unit:number;color:color;list:list;map:map;boolean:bool;null:null}\n',
        done);
    });
  });

  describe('global() Sass function', () => {
    let testModule = sassport()
      .globals({
        '$foo': 'foo value',
        '$bar': 'bar value'
      });

    it('should retrieve the proper global variables from the root module', (done) => {
      testModule.render({
        data: 'test { foo: global("$foo"); }',
        outputStyle: 'compressed'
      }, (err, result) => {
        done(assert.equal(
          result.css.toString(),
          'test{foo:foo value}\n'));
      });
    });
  });
});
