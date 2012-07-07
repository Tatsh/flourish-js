test('fURL.get', function () {
  strictEqual(fURL.get(), location.pathname, 'Returns location.pathname.');
});

test('fURL.getDomain', function () {
  strictEqual(fURL.getDomain(), location.protocol + '//' + location.hostname, 'Returns location.protocol + // + location.hostname');
});

test('fURL.getQueryString', function () {
  var ret = location.search ? location.search.substr(1) : '';
  strictEqual(fURL.getQueryString(), ret, 'Returns location.search or empty string.');
});
