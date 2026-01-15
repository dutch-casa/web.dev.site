import "fake-indexeddb/auto"

// Reset IndexedDB between tests
afterEach(async () => {
  const databases = await indexedDB.databases()
  for (const db of databases) {
    if (db.name) indexedDB.deleteDatabase(db.name)
  }
})
