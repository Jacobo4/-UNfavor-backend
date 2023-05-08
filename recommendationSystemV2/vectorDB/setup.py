from typing import Dict
from pymilvus import utility, Collection, connections
from models.schema import schema, collection_name
from manager.load_config import CONFIG 

def connectMilvus() -> None:
    connections.connect(
        alias=CONFIG["DB_ALIAS"],
        host=CONFIG["DB_HOST"],
        port=CONFIG["DB_PORT"]
    )


def setupMilvusCollection() -> Collection:
    index_params: Dict = {
        "metric_type": "L2",
        "index_type": "IVF_SQ8",
        "params":{"nlist": 1024}
    }


    col: None | Collection = None
    if not utility.has_collection("UserFavor"):
        col = Collection(
            name=collection_name,
            schema=schema,
            using=CONFIG["DB_ALIAS"]
        )
        col.create_index(field_name="favor", index_params=index_params)
    else:
        col = Collection("UserFavor")

    assert(isinstance(col, Collection))

    col.load()

    return col

def releaseMilvus():
    if not connections.has_connection(CONFIG["DB_ALIAS"]):
        return
    
    connections.disconnect("default")
