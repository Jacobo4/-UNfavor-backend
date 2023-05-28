from vectorDB import setup
from pymilvus import utility

setup.connectMilvus()
col = setup.setupMilvusCollection()

print(f"collections: {utility.list_collections()}")
print(f"entities: {col.num_entities}")

col.release()
setup.releaseMilvus()
