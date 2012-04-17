test('fHTML.containsBlockLevelHTML', function () {
  var inlineWithException = '<a></a><nav></nav>';
  var block = '<ul><li><div></div></li></ul>';
  var onlyInline = '<a></a><time></time><a><em>fff</em></a>';

  strictEqual(fHTML.containsBlockLevelHTML(inlineWithException), true, 'Check for <nav> (which is inline but treated as block-level)');
  strictEqual(fHTML.containsBlockLevelHTML(inlineWithException, true), false, 'Check for <nav> as normal inline');

  strictEqual(fHTML.containsBlockLevelHTML(block), true, 'Find the block-level <div>');
  strictEqual(fHTML.containsBlockLevelHTML(block, true), true, 'Find block-level <div> (strict)');

  strictEqual(fHTML.containsBlockLevelHTML(onlyInline), false, 'Find no block-level elements');
  strictEqual(fHTML.containsBlockLevelHTML(onlyInline, true), false, 'Find no-block-level elements (strict)');
});

test('fHTML.convertNewLines', function () {
  var hasBlock = '<ul><li>my string</li></ul>';
  strictEqual(fHTML.convertNewLines(hasBlock), hasBlock, 'No processing for a string with block-level elements.');

  var noBlocks = "My string\nMystring\n\n";
  var result = "My string<br>\nMystring<br>\n<br>\n";
  strictEqual(fHTML.convertNewLines(noBlocks), result, noBlocks.replace(/\n/g, "\\n") + ' -> ' + result.replace(/\n/g, "\\n"));
});

test('fHTML.decode', function () {
  var original = 'My friend &amp; I &lt;&gt;';
  var result = 'My friend & I <>';

  strictEqual(fHTML.decode(original), result, result);
});

test('fHTML.encode', function () {
  var original = 'My friend & I <>';
  var result = 'My friend &amp; I &lt;&gt;';

  // Needs more testing
  strictEqual(fHTML.encode(original), result, result);
  strictEqual(fHTML.encode(fHTML.decode(result)), result, 'Verify inverse operation.');
});

test('fHTML.makeLinks', function () {
  var original = 'My site http://www.tatsh.net http://amazon.com';
  var ret1 = 'My site <a href="http://www.tatsh.net" title="http://www.tatsh.net">http...</a> <a href="http://amazon.com" title="http://amazon.com">http...</a>';
  var ret2 = 'My site <a href="http://www.tatsh.net">http://www.tatsh.net</a> <a href="http://amazon.com">http://amazon.com</a>';

  strictEqual(fHTML.makeLinks(original, 4), ret1, 'Called with link text length 4.');
  strictEqual(fHTML.makeLinks(original), ret2, 'Called with no maximum link text length.');
});

test('fHTML.prepare', function () {
  // TODO Currently fails in IE7,8
  var original = '<param></param><p class="mine" data-i="1 2">Bad markup & <></p>';
  var good = '<param></param><p class="mine" data-i="1 2">Bad markup &amp; &lt;&gt;</p>';
  strictEqual(fHTML.prepare(original), good, 'Called with unsanitised &, <, >.');
});
