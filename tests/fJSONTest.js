test('fJSON.decode', function () {
  var jsonNumber = '1';
  var jsonFloat = '1.2';
  var jsonTrue = 'true';
  var jsonFalse = 'false';
  var jsonNull = 'null';
  var jsonArray = '["a","b","c","d"]';
  var jsonObject = '{"a":1,"b":true,"c":1.2,"d":false,"e":{"a":{}},"f":[1,2,3],"g":' + jsonArray + '}';

  var realArray = ['a','b','c','d'];
  var realObject = {
    a: 1,
    b: true,
    c: 1.2,
    d: false,
    e: {a:{}},
    f: [1,2,3],
    g: realArray
  };

  strictEqual(fJSON.decode(jsonNumber), 1, 'JSON string: "' + jsonNumber + '"');
  strictEqual(fJSON.decode(jsonNumber, true), 1, 'JSON string: "' + jsonNumber + '" (non-native decoder)');

  strictEqual(fJSON.decode(jsonFloat), 1.2, 'JSON string: "' + jsonFloat + '"');
  strictEqual(fJSON.decode(jsonFloat, true), 1.2, 'JSON string: "' + jsonFloat + '" (non-native decoder)');

  strictEqual(fJSON.decode(jsonTrue), true, 'JSON string: "' + jsonTrue + '"');
  strictEqual(fJSON.decode(jsonTrue, true), true, 'JSON string: "' + jsonTrue + '" (non-native decoder)');

  strictEqual(fJSON.decode(jsonFalse), false, 'JSON string: "' + jsonFalse + '"');
  strictEqual(fJSON.decode(jsonFalse, true), false, 'JSON string: "' + jsonFalse + '" (non-native decoder)');

  strictEqual(fJSON.decode(jsonNull), null, 'JSON string: "' + jsonNull + '"');
  strictEqual(fJSON.decode(jsonNull, true), null, 'JSON string: "' + jsonNull + '" (non-native decoder)');

  deepEqual(fJSON.decode(jsonArray), realArray,  'JSON string: "' + jsonArray + '"');
  deepEqual(fJSON.decode(jsonArray, true), realArray,  'JSON string: "' + jsonArray + '" (non-native decoder)');

  deepEqual(fJSON.decode(jsonObject), realObject,  'JSON string: "' + jsonObject + '"');
  deepEqual(fJSON.decode(jsonObject, true), realObject,  'JSON string: "' + jsonObject + '" (non-native decoder)');

  strictEqual(fJSON.decode(), null, 'No arguments. Returns null');
  strictEqual(fJSON.decode(''), null, 'Empty string returns null');
});

test('fJSON.encode', function () {
  var jsonArray = '["a","b","c","d"]';
  var jsonObject = '{"a":1,"b":true,"c":1.2,"d":false,"e":{"a":{}},"f":[1,2,3],"g":' + jsonArray + '}';

  var realArray = ['a','b','c','d'];
  var realObject = {
    a: 1,
    b: true,
    c: 1.2,
    d: false,
    e: {a:{}},
    f: [1,2,3],
    g: realArray
  };

  strictEqual(fJSON.encode(1), '1', 'Encode integer');
  strictEqual(fJSON.encode(1.2), '1.2', 'Encode float');
  strictEqual(fJSON.encode(true), 'true', 'Encode boolean true');
  strictEqual(fJSON.encode(false), 'false', 'Encode boolean false');
  strictEqual(fJSON.encode(null), 'null', 'Encode null');
  strictEqual(fJSON.encode(realArray), jsonArray, 'Encode array: ' + jsonArray);
  strictEqual(fJSON.encode(realObject), jsonObject, 'Encode object: ' + jsonObject);
});
