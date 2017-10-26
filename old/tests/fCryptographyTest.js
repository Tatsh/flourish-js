test('fCryptography.random', function () {
  strictEqual(fCryptography.random(1, 1), 1, 'Range 1-1 leads to return value 1');
  notStrictEqual(fCryptography.random(1, 10), 0, 'Range 1-10 leads to a value that is not 0');
  notStrictEqual(fCryptography.random(1, 10), 11, 'Range 1-10 leads to a value that is not 11 or greater');
});

test('fCryptography.randomString', function () {
  strictEqual(fCryptography.randomString().length, 32, 'Default random string length is 32');
  strictEqual(fCryptography.randomString(16).length, 16, 'String length 16 passed and returned string length is 16');
  notStrictEqual(fCryptography.randomString(16, 'numeric'), 'a', 'String returned with argument "numeric" has only numbers');
  notStrictEqual(fCryptography.randomString(16, 'alpha'), '1', 'String returned with argument "alpha" has only letters');
});
