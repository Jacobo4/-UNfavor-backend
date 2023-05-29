from typing import Dict, Tuple
from pymilvus import utility, Collection, connections
from models.schema import schema, collection_name, pos_collection_name, pos_schema
from manager.load_config import CONFIG 

def connectMilvus() -> None:
    connections.connect(
        alias=CONFIG["DB_ALIAS"],
        host=CONFIG["DB_HOST"],
        port=CONFIG["DB_PORT"]
    )


def setupMilvusCollection() -> Tuple[Collection, Collection]:
    index_params: Dict = {
        "metric_type": "L2",
        "index_type": "IVF_SQ8",
        "params":{"nlist": 1024}
    }
    pos_index_params: Dict = {
        "metric_type": "L2",
        "index_type": "IVF_FLAT",
        "params": {"nlist": 1024}
    }


    col: None | Collection = None
    pos_col: None | Collection = None
    if not utility.has_collection("UserFavor"):
        col = Collection(
            name=collection_name,
            schema=schema,
            using=CONFIG["DB_ALIAS"]
        )
        col.create_index(field_name="favor", index_params=index_params)
        pos_col = Collection(
            name=pos_collection_name,
            schema=pos_schema,
            using=CONFIG["DB_ALIAS"]
        )
        pos_col.create_index(field_name="pos", index_params=pos_index_params)
    else:
        col = Collection("UserFavor")
        pos_col = Collection("UserPosition")

    assert(isinstance(col, Collection))
    assert(isinstance(pos_col, Collection))

    col.load()
    pos_col.load()

    return col, pos_col

def releaseMilvus(*args):
    if not connections.has_connection(CONFIG["DB_ALIAS"]):
        return

    for collection in args:
        assert(isinstance(collection, Collection))
        collection.flush()
        collection.release()

    
    connections.disconnect("default")
