test('fCore.enableDebugging', function () {
  equal(fCore.getDebug(), false, 'Make sure it is false by default');
  equal(fCore._debugEnabled, false, 'Make sure it is false by default (check the static variable)');

  fCore.enableDebugging(true);
  equal(true, fCore.getDebug());
  equal(true, fCore._debugEnabled);

  fCore.enableDebugging(false);
  equal(false, fCore.getDebug());
  equal(false, fCore._debugEnabled);
});
