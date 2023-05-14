from vectorDB.setup import setupMilvusCollection, connectMilvus, releaseMilvus

connectMilvus()
db = setupMilvusCollection()
db.release()
releaseMilvus()
