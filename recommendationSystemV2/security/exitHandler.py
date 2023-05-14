import atexit
import signal
from sys import exit
from manager.advanced_config import collection
from vectorDB.setup import releaseMilvus

def __gracefulExit() -> None:
    print("------- EXITING GRACEFULLY -------")
    collection.release()
    releaseMilvus()

def exitHandler() -> None:
    __gracefulExit()

    exit(0)

def forcedExitHandler(signal_recieved, frame) -> None:
    __gracefulExit()

    exit(0)

atexit.register(exitHandler)
signal.signal(signal.SIGINT, forcedExitHandler)
signal.signal(signal.SIGTSTP, forcedExitHandler)
