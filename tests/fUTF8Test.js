test('fUTF8.explode', function () {
  // Taken from http://svn.flourishlib.com/trunk/tests/classes/fUTF8/fUTF8Test.php
  // Format is input, delimiter, output
  var outputs = [
    ['', null, ['']],
    [' ', null, [' ']],
    ["a\nb", null, ['a', "\n", 'b']],
    ["\na\nb\n\n", null, ["\n", "a", "\n", "b", "\n", "\n"]],
    ['abcdefg', null, ['a', 'b', 'c', 'd', 'e', 'f', 'g']],
    ['Iñtërnâtiônàlizætiøn', null, ['I', 'ñ', 't', 'ë', 'r', 'n', 'â', 't', 'i', 'ô', 'n', 'à', 'l', 'i', 'z', 'æ', 't', 'i', 'ø', 'n']],

    ["a\nb", '', ['a', "\n", 'b']],

    ["a\nb", 'a', ['', "\nb"]],

    ["a\nb", "\n", ['a', 'b']],
    ['Iñtërnâtiônàlizætiøn', 'nà', ['Iñtërnâtiô', 'lizætiøn']]
  ];

  for (var i = 0; i < outputs.length; i++) {
    deepEqual(fUTF8.explode(outputs[i][0], outputs[i][1]), outputs[i][2], 'input: "' + outputs[i][0] + '", delimiter: ' + outputs[i][1] + ', output: "' + outputs[i][2] + '"');
  }
});

test('fUTF8.rpos', function () {
  var outputs = [
    ['', '', 0, false],
    [' ', '', 0, false],
    ['abc', '', 0, false],

    ['abc', 'a', 0, 0],
    ['abc', 'b', 0, 1],
    ['abc', 'c', 0, 2],
    ['aaa', 'a', 0, 2],

    ['aaa', 'a', 1, 2],
    ['aaa', 'a', 2, 2],

    ['aaa', 'a', -1, 2],
    ['aaa', 'a', -2, 1],
    ['aaa', 'a', -3, 0],

    ['Iñtërnâtiônàlizætiøn', 'â', 0, 6],
    ['Iñtërnâtiônàlizætiøn', 'æ', 0, 15]
  ];

  for (var i = 0; i < outputs.length; i++) {
    strictEqual(fUTF8.rpos(outputs[i][0], outputs[i][1], outputs[i][2]), outputs[i][3], 'input: "' + outputs[i][0] + '", needle: "' + outputs[i][1] + '", offset: ' + outputs[i][2] + '; returns: ' + outputs[i][3]);
  }
});

test('fUTF8.trim', function () {
  var outputs = [
    ['  hello', null, 'hello'],
    ['hello ', null, 'hello'],
    ['hello ',' o', 'hell'],
    ['hello ', ' elo', 'h'],
    [' Iñtërnâtiônàlizætiøn ', null, 'Iñtërnâtiônàlizætiøn'],
    [' Iñtërnâtiônàlizætiøn   ', ' øn', 'Iñtërnâtiônàlizæti'],
    [' Iñtërnâtiônàlizætiøn   ', " \x6b..\x6e", 'Iñtërnâtiônàlizætiø']
  ];

  for (var i = 0; i < outputs.length; i++) {
    strictEqual(fUTF8.trim(outputs[i][0], outputs[i][1]), outputs[i][2], 'input: "' + outputs[i][0] + '", delimiter: ' + (outputs[i][1] === null ? 'null' : '"' + outputs[i][1] + '"') + '; returns ' + outputs[i][2]);
  }
});

test('fUTF8.ltrim', function () {
  var outputs = [
    ['  hello ', null, 'hello '],
    ['hello ', null, 'hello '],
    ['hello ',' o', 'hello '],
    ['hello ', ' elo', 'hello '],
    [' Iñtërnâtiônàlizætiøn ', null, 'Iñtërnâtiônàlizætiøn '],
    [' Iñtërnâtiônàlizætiøn   ', ' ñI', 'tërnâtiônàlizætiøn   '],
    [' Iñtërnâtiônàlizætiøn   ', " \x49..\x6e", 'ñtërnâtiônàlizætiøn   ']
  ];

  for (var i = 0; i < outputs.length; i++) {
    strictEqual(fUTF8.ltrim(outputs[i][0], outputs[i][1]), outputs[i][2], 'input: "' + outputs[i][0] + '", delimiter: ' + (outputs[i][1] === null ? 'null' : '"' + outputs[i][1] + '"') + '; returns ' + outputs[i][2]);
  }
});

test('fUTF8.rtrim', function () {
  var outputs = [
    ['  hello ', null, '  hello'],
    ['hello ', null, 'hello'],
    ['hello ', ' o', 'hell'],
    ['hello ', ' elo', 'h'],
    [' Iñtërnâtiônàlizætiøn ', null, ' Iñtërnâtiônàlizætiøn'],
    [' Iñtërnâtiônàlizætiøn   ', ' ønI', ' Iñtërnâtiônàlizæti'],
    [' Iñtërnâtiônàlizætiøn   ', " \x6b..\x6eI",  ' Iñtërnâtiônàlizætiø']
  ];

  for (var i = 0; i < outputs.length; i++) {
    strictEqual(fUTF8.rtrim(outputs[i][0], outputs[i][1]), outputs[i][2], 'input: "' + outputs[i][0] + '", delimiter: ' + (outputs[i][1] === null ? 'null' : '"' + outputs[i][1] + '"') + '; returns ' + outputs[i][2]);
  }
});

test('fUTF8.ucwords', function () {
  var outputs = [
    ['hello', 'Hello'],
    ['This is a longer phrase', 'This Is A Longer Phrase'],
    ['This phrase (contains some) punctuation/that might cause "issues"', 'This Phrase (Contains Some) Punctuation/That Might Cause "Issues"'],
    ["Single prime \"apostrophes\" aren't an issue, and 'single prime' quotes work", "Single Prime \"Apostrophes\" Aren't An Issue, And 'Single Prime' Quotes Work"],
    ["Apostrophes aren’t an issue", "Apostrophes Aren’t An Issue"],
    ["‘single’ and “double” quotes are handled too", "‘Single’ And “Double” Quotes Are Handled Too"],
    ["Hyphens-get-handled-too", "Hyphens-Get-Handled-Too"],
    ["\\'Backslashed single quote'", "\\'Backslashed Single Quote'"]
  ];

  for (var i = 0; i < outputs.length; i++) {
    strictEqual(fUTF8.ucwords(outputs[i][0]), outputs[i][1], 'input: "' + outputs[i][0] + '"; returns: "' + outputs[i][1] + '"');
  }
});
