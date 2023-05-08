import requests

url = 'http://localhost:5000'

users = [
    {
        "userid": "1",
        "favor_title": "Teeth Brushing",
        "favor_description": "I will brush your teeth for you during my spare time."
    },
    {
        "userid": "2",
        "favor_title": "Paint your house.",
        "favor_description": "I will paint your house and detail any paintjob in your house."
    },
    {
        "userid": "3",
        "favor_title": "Clean your house",
        "favor_description": "I will clean your house for you and make sure it smells good."
    },
    {
        "userid": "4",
        "favor_title": "Drywall repair",
        "favor_description": "I will repair any drywall you need around your house or garage."
    },
    {
        "userid": "adf6969",
        "favor_title": "Lawn Mowing",
        "favor_description": "I will mow your lawn and detail the garden."
    },
    {
        "userid": "6",
        "favor_title": "Ramen Eater",
        "favor_description": "I will eat your ramen and give you a review on it's quality and taste"
    },
    {
        "userid": "7",
        "favor_title": "Chef and Cook",
        "favor_description": "I will cook your meals for you and your family. I make savory and sweet dishes."
    },
    {
        "userid": "8",
        "favor_title": "Profesional Bather",
        "favor_description": "I will bathe and was your loins for you as many times as you want. I am an expert at bodily cleaning functions."
    },
    {
        "userid": "9",
        "favor_title": "Trainer",
        "favor_description": "I can be your training coach and help you meet your fitness goals."
    },
    {
        "userid": "10",
        "favor_title": "Ass wiping",
        "favor_description": "I wil wipe your ass for you after you take a shit."
    }
]

for user in users:
    print(requests.post(f"{url}/vectorDB/favor/add", json=user).text)
