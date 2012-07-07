test('fRequest.get', function () {
  strictEqual(fRequest.get('nonexistant'), null, 'Non-existant part of query string requested; returns null.');
  strictEqual(fRequest.get('nonexistant', 'string', 'default'), 'default', 'Default value is returned.');
  strictEqual(fRequest.get('nonexistant', 'boolean', 'default'), 'default', 'Default value is returned with cast to different type ignored.');

  var ret = false;
  if (location.search && location.search.match(/noglobals/)) {
    ret = true;
  }
  strictEqual(fRequest.get('noglobals', 'bool'), ret, 'Check for noglobals as boolean with cast argument "bool".');
  strictEqual(fRequest.get('noglobals', 'boolean'), ret, 'Check for noglobals as boolean with cast argument "boolean".');
  strictEqual(fRequest.get('noglobals', 'number'), ret ? 1 : 0, 'Check for noglobals as boolean with cast argument "number".');
  strictEqual(fRequest.get('noglobals', 'float'), ret ? 1 : 0, 'Check for noglobals as boolean with cast argument "float".');

  if (ret) {
    var value = location.search.substr(1).match(/noglobals=(\w+)&?/)[1];
    strictEqual(fRequest.get('noglobals'), value, 'Check for noglobals value as string: ' + value);
  }
});
