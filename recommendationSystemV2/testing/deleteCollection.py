from vectorDB import setup
from pymilvus import utility

setup.connectMilvus()
utility.drop_collection("UserFavor")
setup.releaseMilvus()
