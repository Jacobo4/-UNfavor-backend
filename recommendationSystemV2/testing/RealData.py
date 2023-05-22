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
            "title": f"Testing user {index+1}",
            "description": f"This is a testing favor that belongs to {info[0]}",
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