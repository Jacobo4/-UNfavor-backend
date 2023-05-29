from flask import Flask
from flask.json.provider import DefaultJSONProvider
from vectorDB.setup import setupMilvusCollection, connectMilvus
from pprint import pprint
import numpy as np

class VectorArrayEncoder(DefaultJSONProvider):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        else:
            return super().default(obj)

class SpecialFlask(Flask):
    json_provider_class = VectorArrayEncoder


pprint("INITIALIZING: Starting Flask")
app = SpecialFlask(__name__)
pprint("INITIALIZING: Connecting to MILVUS")
connectMilvus()
pprint("INITIALIZING: Setting up Milvus Collection")
collection, pos_collection = setupMilvusCollection()
pprint("INITIALIZING: FINALIZED")
non_indexed_count = 0
