test('fTimestamp.getFuzzyDifference', function () {
  var timestamp = new fTimestamp(strtotime('-2 weeks'));

  strictEqual(timestamp.getFuzzyDifference(), '2 weeks ago');
});
