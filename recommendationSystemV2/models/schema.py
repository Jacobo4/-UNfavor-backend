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

schema = CollectionSchema(
    fields=[userid, favor],
    description="User Favor collection"
)

collection_name = "UserFavor"
