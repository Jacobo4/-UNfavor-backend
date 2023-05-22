import requests, random

# The API endpoint
users = "https://random-data-api.com/api/users/random_user"
register = "http://127.0.0.1:3000/user/register"

usuarios = [
    ["Ivan", "ilombana@unal.edu.co"],
    ["Jacobo", "juizquierdob@unal.edu.co"],
    ["Natalia", "nquirogac@unal.edu.co"],
    ["Alejandra", "mamantillam@unal.edu.co"],
    ["Andrés", "agutierrezt@unal.edu.co"],
    ["Angel", "alombana@unal.edu.co"],
    ["Nick", "ngalindoc@unal.edu.co"],
    ["Juan Camilo", "juzambranol@unal.edu.co"]
]

favors = [
    {'description': "Purchase and deliver groceries to someone's doorstep.", 'title': 'Grocery Run'},
    {'description': "Take care of someone's pets while they are away.", 'title': 'Pet Sitting'},
    {'description': 'Assist with troubleshooting and resolving technical issues.', 'title': 'Tech Support'},
    {'description': "Clean and organize someone's home.", 'title': 'House Cleaning'},
    {'description': 'Cook and package meals for someone who is busy or unable to cook.', 'title': 'Meal Preparation'},
    {'description': 'Help with gardening tasks such as weeding, watering, and planting.', 'title': 'Garden Maintenance'},
    {'description': 'Look after someone\'s children for a specified period of time.', 'title': 'Babysitting'},
    {'description': 'Run errands on behalf of someone, such as picking up prescriptions or mailing packages.', 'title': 'Errand Assistance'}
]

status = ['REVIEWING', 'PUBLISHED', 'DENIED']

def createUser(info, index):
    number = "3"
    month = random.randint(1,5)
    day = random.randint(1,28)
    review = random.randint(0,5)
    currently = random.choice(status)
    age = random.randint(-3,3)
    for i in range(9): number+=str(random.randint(0,9))
    
    data = {
        "user": {
            "name": info[0],
            "email": info[1],
            "password": "123",
            "phone": number,
            "age": 21+age,
        },
        "favor":{
            "title": f"{favors[index]['title']}",
            "description": f"{favors[index]['description']}",
            "location": "Unal",
            "date_published": f'2023-0{month}-{day}',
            "favor_state": currently,
            "reviews": {
                "review_num": day,
                "review_sum": review*day,
            }
        }
    }
    return data


for i in range(len(usuarios)):
    user = createUser(usuarios[i], i)
    # Register
    post_response = requests.post(register, json=user)
