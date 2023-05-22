import requests, random

# The API endpoint
users = "https://random-data-api.com/api/users/random_user"
register = "http://127.0.0.1:3000/user/register"

favores = [
    "Ayuda para encontrar una dirección en la ciudad - Si estás perdido en la ciudad y necesitas ayuda para encontrar una dirección específica, puedo ayudarte a encontrarla - Online",
    "Asesoramiento para la creación de un plan de estudios - Ofrezco asesoramiento para la creación de un plan de estudios personalizado que se adapte a tus objetivos educativos y profesionales - Online",
    "Planificación de viajes personalizados - Ofrezco servicios de planificación de viajes personalizados para aquellos que buscan una experiencia de viaje única y adaptada a sus necesidades y preferencias - Online",
    "Clases de baile presenciales - Ofrezco clases de baile presenciales para todos los niveles, desde principiantes hasta avanzados, en varias ciudades de Colombia - Bogotá, Medellín, Cali, Barranquilla y Cartagena.",
    "Entrenamiento personalizado en línea - Ofrezco entrenamiento personalizado en línea para ayudarte a alcanzar tus objetivos de salud y fitness, independientemente de tu ubicación en Colombia - Pasto.",
    "Consultoría en marketing digital - Ofrezco servicios de consultoría en marketing digital para empresas y emprendedores en toda Colombia, con el objetivo de mejorar su presencia en línea y aumentar su alcance - Disponible para todo el territorio colombiano, con posibilidad de reuniones presenciales en ciudades como Bogotá, Medellín, Cali y Barranquilla.",
    "Servicio de reparación de equipos electrónicos - Ofrezco servicio de reparación de equipos electrónicos, desde teléfonos móviles hasta laptops y consolas de videojuegos, en la ciudad de Pereira - Pereira, Colombia.",
    "Clases de español para extranjeros - Ofrezco clases de español para extranjeros en la ciudad de Bucaramanga, con el objetivo de mejorar su fluidez en el idioma y su comprensión de la cultura colombiana - Bucaramanga, Colombia.",
    "Servicio de catering para eventos - Ofrecemos servicios de catering para eventos en la ciudad de Cartagena, con una amplia variedad de opciones de menú para satisfacer las necesidades y preferencias de cada cliente - Cartagena, Colombia.",
    "Servicio de traducción - Ofrecemos servicios de traducción en línea y presenciales en la ciudad de Cúcuta, para una variedad de idiomas, incluyendo inglés, francés, portugués, italiano y alemán - Cúcuta, Colombia.",
    "Diseño de logotipos personalizados - Ofrezco servicios de diseño de logotipos personalizados para empresas y emprendedores, creando identidades visuales únicas y memorables - Online",
    "Clases de yoga al aire libre - Imparto clases de yoga al aire libre, brindando una experiencia de bienestar y conexión con la naturaleza - Parques de Bogotá",
    "Servicio de fotografía de bodas - Capturo los momentos más especiales de tu boda con un enfoque artístico y emotivo - Medellín",
    "Talleres de cocina saludable - Ofrezco talleres de cocina saludable, enseñando recetas y técnicas culinarias para promover un estilo de vida saludable - Cali",
    "Servicio de limpieza y organización del hogar - Proporciono servicios de limpieza y organización del hogar, ayudando a mantener espacios ordenados y libres de estrés - Barranquilla",
    "Servicio de reparación de automóviles - Realizo reparaciones y mantenimiento de automóviles, brindando un servicio confiable y de calidad - Bogotá",
    "Clases de música para niños - Imparto clases de música interactivas y divertidas para niños, fomentando su desarrollo artístico y creativo - Medellín",
    "Servicio de diseño de interiores - Ofrezco servicios de diseño de interiores para crear espacios funcionales, estéticos y personalizados - Cartagena",
    "Asesoramiento financiero personalizado - Brindo asesoramiento financiero personalizado, ayudando a alcanzar metas económicas y planificar el futuro financiero - Bogotá",
    "Clases de artes marciales - Imparto clases de artes marciales para personas de todas las edades, promoviendo la disciplina y el bienestar físico - Cali",
    "Servicio de jardinería y paisajismo - Realizo trabajos de jardinería y diseño de paisajes, creando espacios verdes hermosos y armoniosos - Medellín",
    "Servicio de desarrollo web - Ofrezco servicios de desarrollo web personalizados, creando sitios web modernos y funcionales para empresas y profesionales - Online",
    "Clases de pintura para adultos - Imparto clases de pintura para adultos de todos los niveles, estimulando la creatividad y el arte - Barranquilla"
]

status = ['REVIEWING', 'PUBLISHED', 'DENIED']

def createUser(index, info):
    number = "3"
    month = random.randint(1,5)
    day = random.randint(1,28)
    review = random.randint(0,5)
    price = random.randint(0, 500)*100
    currently = random.choice(status)
    for i in range(9): number+=str(random.randint(0,9))
    favor = favores[index].split(" - ");
    data = {"user": {
        "name": info["first_name"]+" "+info["last_name"],
        "email": info["email"],
        "password": info["password"],
        "phone": number,
        "age": 2023-int(info["date_of_birth"].split("-")[0]),
    }, "favor":{
        "title": favor[0].strip(),
        "description": favor[1].strip(),
        "location": favor[2].strip(),
        "date_published": f'2023-0{month}-{day}',
        "favor_state": currently,
        "reviews": {
            "review_num": day,
            "review_sum": review*day,
        }
    }}
    return data


for i in range(len(favores)):
    # A GET request to the API
    response = requests.get(users)
    # Print the response
    response_json = response.json()
    # Call createUser
    user = createUser(i, response_json)
    #print(user)
    # Register
    post_response = requests.post(register, json=user)