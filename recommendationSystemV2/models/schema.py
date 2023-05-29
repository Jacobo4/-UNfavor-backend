from pymilvus import DataType, FieldSchema, CollectionSchema

# Define vector shcema for collection favors
userid = FieldSchema(
    name="userid",
    dtype=DataType.VARCHAR,
    max_length=200,
    is_primary=True,
)
favor = FieldSchema(
    name="favor",
    dtype=DataType.FLOAT_VECTOR,
    dim=1024
)
category = FieldSchema(
    name="category",
    dtype=DataType.VARCHAR,
    max_length=50
)

schema = CollectionSchema(
    fields=[userid, favor, category],
    description="User Favor collection"
)

collection_name = "UserFavor"


# Define Collection schema for location and distances
userid = FieldSchema(
    name="userid",
    dtype=DataType.VARCHAR,
    max_length=200,
    is_primary=True,
)
pos = FieldSchema(
    name="pos",
    dtype=DataType.FLOAT_VECTOR,
    dim=3
)

pos_schema = CollectionSchema(
    fields=[userid, pos],
    description="User Position collection"
)

pos_collection_name = "UserPosition"
