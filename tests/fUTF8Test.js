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
