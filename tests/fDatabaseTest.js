var db = new fDatabase('qunit');
var db2 = new fDatabase('qunit', '2.0');

test('fDatabase', function () {
  notStrictEqual(db, null, 'db not null');
  notStrictEqual(db2, null, 'db2 not null');
  strictEqual(db2.getVersion(), '2.0', 'db2 version = 2.0');
});

asyncTest('fDatabase.connect', function () {
  var outer = db;

  if (fDatabase._supportsIndexedDB) {
    strictEqual(outer, outer.connect(function (db) {
      strictEqual(outer, db, 'Verify passed argument to callback matches original fDatabase instance');

      var idb = db.getConnection();
      notStrictEqual(null, idb, 'getConnection() returns IDBDatabase object');

      // Raw properties of the database
      strictEqual(idb.name, 'qunit', 'IDBDatabase name = qunit');

      // NOTE Currently fails in Chrome 17.0.963.79
      // NOTE Firefox 11 returns 1 (number) instead of 1.0 as a string
      equal(idb.version, '1.0', 'IDBDatabase version = 1.0');

      start();

      test('fDatabase.getConnection', function () {
        notStrictEqual(db.getConnection(), null, 'Connection is established');
        strictEqual(db2.getConnection(), null, 'Connection is not established. Not testing for indexedDB support.');
      });

      test('fDatabase.isConnected', function () {
        strictEqual(db.isConnected(), true, 'Database connected.');
      });
    }));
  }
  else {
    setTimeout(function () {
      strictEqual(db.connect(), db, 'Connect does nothing (as intended). No support for indexedDB in this browser.');
      start();
    }, 0);
  }
});

test('fDatabase.getErrorHandler', function () {
  strictEqual('function', typeof db.getErrorHandler(), 'Returns function.');
});

test('fDatabase.getName', function () {
  strictEqual('qunit', db.getName(), 'name = qunit');
});

if (!fDatabase._supportsIndexedDB) {
  test('fDatabase.getConnection', function () {
    strictEqual(db.getConnection(), null, 'No support for indexedDB in this browser.');
    strictEqual(db2.getConnection(), null, 'No support for indexedDB in this browser.');
  });
}

test('fDatabase.getVersion', function () {
  strictEqual('1.0', db.getVersion(), 'version = 1.0');
  strictEqual('2.0', db2.getVersion(), 'version = 2.0');
});

if (!fDatabase._supportsIndexedDB) {
  test('fDatabase.isConnected', function () {
    strictEqual(db.isConnected(), false, 'Not connected. No support for indexedDB in this browser.');
    strictEqual(db2.isConnected(), false, 'Not connected. Not testing for indexedDB support.');
  });
  test('fDatabase.getConnection', function () {
    strictEqual(db.getConnection(), null, 'No connection. No support for indexedDB in this browser.');
    strictEqual(db2.getConnection(), null, 'Not connected. Not testing for indexedDB support.');
  });
}

if (fDatabase._supportsIndexedDB) {
  test('fDatabase.setConnection', function () {
    var idb = window.indexedDB.open('qunit3');
    db.setConnection(idb);
    strictEqual(idb, db.getConnection());
  });
  test('fDatabase.setDatabase', function () {
    var idb = window.indexedDB.open('qunit2');
    db.setDatabase(idb);
    strictEqual(idb, db.getConnection());
  });
}
else {
  test('fDatabase.setConnection', function () {
    strictEqual(true, true, 'No support for indexedDB in this browser.');
  });
  test('fDatabase.setDatabase', function () {
    strictEqual(true, true, 'No support for indexedDB in this browser.');
  });
}
