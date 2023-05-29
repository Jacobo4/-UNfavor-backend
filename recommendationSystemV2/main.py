from typing import Dict, List
from flask import request

from manager.advanced_config import app

from security import exitHandler # DO NOT DELETE 

from endpoints import endpoints 

# START DEBUGGING LIBRARIES
# END DEBUGGING LIBRARIES

@app.route("/vectorDB/favor/add", methods=["POST"])
def addFavor():
    favor: None | Dict = request.json

    if not isinstance(favor, Dict):
        return {"status": 0}

    res: bool = endpoints.addFavor({
        "userid": favor["userid"],
        "favor": f"{favor['favor_title']}\n{favor['favor_description']}",
        "latitude": favor['latitude'],
        "longitude": favor['longitude'],
        "category": favor['category']
    })

    if not res:
        return {"status": 0}

    return {"status": 1}

@app.route("/vectorDB/favor", methods=["GET"])
def getFavor():
    favor: None | Dict = request.json

    if not isinstance(favor, Dict):
        return {"status": 0}

    res: Dict = endpoints.getFavor(favor)

    if not isinstance(res, Dict):
        return {"status": 0}

    if "favor" not in res:
        return {"status": 0}

    res["status"] = 1

    return res

@app.route("/vectorDB/favor/delete", methods=["GET"])
def deleteFavor():
    favor: None | Dict = request.json

    if not isinstance(favor, Dict):
        return {"status": 0}

    res: bool = endpoints.deleteFavor(favor)

    if not res:
        return {"status": 0}

    return {"status": 1}

@app.route("/vectorDB/favor/edit", methods=["POST"])
def editFavor():
    favor: None | Dict = request.json

    if not isinstance(favor, Dict):
        return {"status": 0}

    res: bool = endpoints.editFavor({
        "userid": favor["userid"],
        "favor": f"{favor['favor_title']}\n{favor['favor_description']}",
        'longitude': favor['longitude'],
        'latitude': favor['latitude'],
        'category': favor['category']
    })

    if not res:
        return {"status": 0}

    return {"status": 1}

@app.route("/recommender", methods=["POST"])
def getRecommendations():
    favor: None | Dict = request.json

    if not isinstance(favor, Dict):
        return {"status": 0}

    for i in ["history", "longitude", "latitude", "category", "userid", "max_distance"]:
        if i not in favor:
            return {"status": 0}

    for i in range(len(favor["history"])):
        favor["history"][i]["favor"] = f"{favor['history'][i]['favor_title']}\n{favor['history'][i]['favor_description']}"

    res: List | None = endpoints.getRecommendations(favor)

    if not res:
        return {"status": 0}

    return {"status": 1, "recommendations": res}


def main() -> None:
    return

if __name__ == '__main__':
    main()
