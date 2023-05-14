from typing import Dict, List
import re

from torch import embedding

from vectorizer.vectorizer import transform
from manager.advanced_config import collection as col

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
        return False

    if __checkExistence(favor):
        return False

    favor_vector: List = transform(favor["favor"]).flatten().tolist()

    new_favor: List = [
        [favor["userid"]],
        [favor_vector]
    ]

    col.insert(new_favor)
    col.flush()

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
    if not __cleanData(favor):
        return False

    res: None | List = __checkExistence(favor)

    if not res:
        return False

    res2 = col.delete(expr=f"userid in [\"{favor['userid']}\"]")

    if not res2:
        return False

    return True

def editFavor(favor: Dict) -> bool:
    if not deleteFavor(favor):
        return False

    return addFavor(favor)

def getRecommendations(favor: Dict) -> List | None:
    embeddings: List = []
    for fa in favor["history"]:
        if not __cleanData(fa):
            return None

        favor_vector: List = transform(fa["favor"]).flatten().tolist()
        embeddings.append(favor_vector)

    search_params: Dict = {"metric_type": "L2", "params": {"nprobe": 10}}

    res = col.search(
        data=embeddings,
        anns_field="favor",
        param=search_params,
        limit=5
    )

    recommendations = []
    for aux in res: # type: ignore
        for entity in aux:
            recommendations.append({"userid": entity.id})

    return recommendations
