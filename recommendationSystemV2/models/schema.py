from pymilvus import DataType, FieldSchema, CollectionSchema

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
posx = FieldSchema(
    name="posx",
    dtype=DataType.DOUBLE
)
posy = FieldSchema(
    name="posy",
    dtype=DataType.DOUBLE
)
posz = FieldSchema(
    name="posz",
    dtype=DataType.DOUBLE
)
category = FieldSchema(
    name="category",
    dtype=DataType.VARCHAR,
    max_length=50
)

schema = CollectionSchema(
    fields=[userid, favor, posx, posy, posz, category],
    description="User Favor collection"
)

collection_name = "UserFavor"
