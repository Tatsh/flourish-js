test('fGrammar.camelize', function () {
  strictEqual(fGrammar.camelize('a_b_c'), 'aBC');
  strictEqual(fGrammar.camelize('a_b_c', true), 'ABC');
  strictEqual(fGrammar.camelize('a-b-c', true, '-'), 'ABC');
  strictEqual(fGrammar.camelize('a-b-c', false, '-'), 'aBC');
  strictEqual(fGrammar.camelize('my_class_name'), 'myClassName');
  strictEqual(fGrammar.camelize('my_class_name', true), 'MyClassName');
});

test('fGrammar.humanize', function () {
  // All return values taken from the PHP version
  strictEqual(fGrammar.humanize('A B C'), 'A B C');
  strictEqual(fGrammar.humanize('A_B_C'), 'A B C');
  strictEqual(fGrammar.humanize('my string'), 'my string');
  strictEqual(fGrammar.humanize('My string'), 'My string');
  strictEqual(fGrammar.humanize('My string.pdf'), 'My string.pdf');
  strictEqual(fGrammar.humanize('myString'), 'My String');
  strictEqual(fGrammar.humanize('my_string'), 'My String');
  strictEqual(fGrammar.humanize('somefile.php'), 'Somefile.PHP');
  strictEqual(fGrammar.humanize('somefile.doc'), 'Somefile.Doc');
  strictEqual(fGrammar.humanize('somefile.id'), 'Somefile.ID');
  strictEqual(fGrammar.humanize('another file.id'), 'another file.id');
  strictEqual(fGrammar.humanize('anotherFile.id'), 'Another File.ID');
  strictEqual(fGrammar.humanize('another_File.id'), 'Another File.ID');
  strictEqual(fGrammar.humanize('another_file.id'), 'Another File.ID');
  strictEqual(fGrammar.humanize('api_pdf.swf'), 'API PDF.SWF');
});

test('fGrammar.inflectOnQuantity', function () {
  strictEqual(fGrammar.inflectOnQuantity(-1, '1 item', '%d items'), '-1 items');
  strictEqual(fGrammar.inflectOnQuantity(0, '1 item', '%d items'), '0 items');
  strictEqual(fGrammar.inflectOnQuantity(1, '1 item', '%d items'), '1 item');
  strictEqual(fGrammar.inflectOnQuantity(2, '1 item', '%d items'), '2 items');
});

test('fGrammar.underscorize', function () {
  strictEqual(fGrammar.underscorize('ABC'), 'a_b_c');
  strictEqual(fGrammar.underscorize('myWord'), 'my_word');
  strictEqual(fGrammar.underscorize('MyOtherWord'), 'my_other_word');
});
