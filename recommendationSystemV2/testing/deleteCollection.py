from vectorDB import setup
from pymilvus import utility

setup.connectMilvus()
utility.drop_collection("UserFavor")
utility.drop_collection("UserPosition")
setup.releaseMilvus()
