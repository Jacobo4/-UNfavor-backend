from typing import Dict, List
from manager.load_config import CONFIG
import re
import numpy as np

from torch import embedding

from vectorizer.vectorizer import transform
from manager.advanced_config import collection as col
from manager.advanced_config import pos_collection as pos_col


# LONGITUDE LATITUDE MATHY
RADIUS = 6371

def __cleanData(favor: Dict) -> None | Dict:
    cleaned_userid = favor["userid"].split()[-1]
    if not re.match("^([a-z]*[0-9]*[A-Z]*)*$", cleaned_userid):
        return None

    favor["userid"] = cleaned_userid

    return favor

def __checkExistence(favor: Dict) -> None | List:
    res = col.query(
        expr = f"userid == \"{favor['userid']}\"",
        offset = 0,
        limit = 1,
        output_fields=["userid", "favor"],
        consistency_level="Strong"
    )

    if len(res) > 0:
        return res

    return None

def addFavor(favor: Dict) -> bool:
    if not __cleanData(favor):
        print("not clean")
        return False

    if __checkExistence(favor):
        print("exists")
        return False

    favor_vector: List = transform(favor["favor"]).flatten().tolist()

    posx = RADIUS * np.cos(favor['latitude']) * np.cos(favor['longitude'])
    posy = RADIUS * np.cos(favor['latitude']) * np.sin(favor['longitude'])
    posz = RADIUS * np.sin(favor['latitude'])


    new_favor: List = [
        [favor["userid"]],
        [favor_vector],
        [favor["category"]]
    ]

    new_pos: List = [
        [favor["userid"]],
        [[posx, posy, posz]]
    ]

    col.insert(new_favor)
    col.flush()

    pos_col.insert(new_pos)
    pos_col.flush()

    return True


def getFavor(favor: Dict) -> Dict:
    if not __cleanData(favor):
        return {}

    res: None | List = __checkExistence(favor)

    if not res:
        return {}

    res = res[-1]

    assert(isinstance(res, Dict))

    return res

def deleteFavor(favor: Dict) -> bool:

    print("wwww")
    if not __cleanData(favor):
        print("not clean")
        return False

    res: None | List = __checkExistence(favor)
    
    print("wwww")

    if not res:
        print("not exists")
        return False

    print("sssss")

    res2 = col.delete(expr=f"userid in [\"{favor['userid']}\"]")
    res3 = pos_col.delete(expr=f"userid in [\"{favor['userid']}\"]")

    print("a   ", res2, res3)

    if not res2 or not res3:
        return False

    return True

def editFavor(favor: Dict) -> bool:
    if not deleteFavor(favor):
        print("Couldn't delete")
        return False

    return addFavor(favor)

def getRecommendations(favor: Dict) -> List | None:
    embeddings: List = []
    for fa in favor["history"]:
        if not __cleanData(fa):
            return None

        favor_vector: List = transform(fa["favor"]).flatten().tolist()
        embeddings.append(favor_vector)

    for _ in range(CONFIG["BOUNCINESS"]):
        embeddings.append(np.random.uniform(low=-2.0, high=2.0, size=1024))

    search_params: Dict = {"metric_type": "L2", "params": {"nprobe": 10}}

    filters: None | str = ""

    userids_list: str = f"[\"{favor['userid']}\""
    for i in range(len(favor["history"])):
        userids_list += f",\"{str(favor['history'][i]['userid'])}\""
    userids_list += "]"

    filters = f"userid not in {userids_list}"

    if favor["max_distance"] != -69:
        posx = RADIUS * np.cos(favor['latitude']) * np.cos(favor['longitude'])
        posy = RADIUS * np.cos(favor['latitude']) * np.sin(favor['longitude'])
        posz = RADIUS * np.sin(favor['latitude'])

        res = pos_col.search(
            data=[[posx, posy, posz]],
            anns_field="pos",
            param=search_params,
            limit=5,
            expr=filters
        )

        allowed_user_ids_list: str = "["

        for aux in res:
            for entity in aux:
                som = pos_col.query(f"userid in [\"{entity.id}\"]", offset=0, limit=1, consistency_level="Strong", output_fields=["pos"])[-1]
                print(entity.id, entity.distance, som["pos"], [posx, posy, posz])
                if entity.distance <= (favor["max_distance"]**2)+1:
                    allowed_user_ids_list += f"\"{entity.id}\","

        if allowed_user_ids_list[-1] != '[':
            allowed_user_ids_list = allowed_user_ids_list[:-1]

        allowed_user_ids_list += "]"

        filters = f"userid in {allowed_user_ids_list}"

    if favor["category"] != "Any":
        filters += f" && category in [\"{favor['category']}\"]"

    print(filters)

    res = col.search(
        data=embeddings,
        anns_field="favor",
        param=search_params,
        limit=5,
        expr=filters
    )

    print(res)

    recommendations = set()
    for aux in res: # type: ignore
        for entity in aux:
            recommendations.add(entity.id)

    return [{"userid": i} for i in np.random.choice(list(recommendations), size=min(5, len(recommendations)), replace=False).tolist()]
