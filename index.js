var sass = require('node-sass');
var sassport = require('./dist/index.js');
var _ = require('lodash');

function camelCase(msg) {
  return _.camelCase(msg);
}

var foo = sassport.wrap(function(message) {
  return 'Hi, '+message+'!';
});

var say = sassport
  .module('say')
  .functions({
    'say($message)': function(message) {
      return sass.types.String(message.getValue() + '!!!');
    }
  })
  .exports('./imports.scss')
  .variables({
    '$test-again': 'a normal js string',
    '$color-primary': 'green'
  });

var sassOptions = {
  file: './test.scss'
};

sassport([
  say
]).render(sassOptions, function(err, result) {
  console.log(err);
  console.log(result.css.toString());
});
