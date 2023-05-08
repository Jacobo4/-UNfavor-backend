from typing import List
from sentence_transformers import SentenceTransformer
from manager.load_config import CONFIG
from torch import Tensor
from numpy import ndarray

__model = SentenceTransformer(CONFIG["TRANSFORMER_MODEL"])

def transform(sentence: str) -> Tensor:
    global __model
    res: List[Tensor] | ndarray | Tensor = __model.encode(sentence, convert_to_tensor=True)
    assert(isinstance(res, Tensor))
    return res
