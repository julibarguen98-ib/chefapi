# ChefAPI 🍳

ChefAPI es una aplicación web para gestionar recetas y categorías de cocina.

El proyecto cuenta con un backend desarrollado con **FastAPI** y **SQLAlchemy**, y un frontend en **HTML, CSS y JavaScript**.

## 🚀 Tecnologías

- Python
- FastAPI
- SQLAlchemy
- SQLite
- HTML5
- CSS3
- JavaScript
- Axios

## 📁 Estructura del proyecto

```text
ChefAPI/
│
├── backend/
│   ├── api/
│   │   └── v1/
│   │       └── endpoints/
│   │           ├── categories.py
│   │           └── recipes.py
│   │
│   ├── crud/
│   ├── models/
│   ├── schemas/
│   ├── database.py
│   └── main.py
│
├── frontend/
│   ├── src/
│   │   ├── css/
│   │   └── js/
│   └── index.html
│
├── chefapi.db
└── README.md
```

##⚙️ Funcionalidades

Crear, consultar, actualizar y eliminar categorías.
Crear, consultar, actualizar y eliminar recetas.
Asociar recetas con categorías.
Añadir imágenes mediante URL.
Mostrar información de las recetas.
Filtrar recetas por categoría.
Interfaz responsive para diferentes tamaños de pantalla.
Documentación interactiva de la API mediante FastAPI.


##🔌 API

La API está organizada bajo:

/api/v1/

Principales endpoints:

GET    /api/v1/categories/
GET    /api/v1/categories/{id}
POST   /api/v1/categories/
PUT    /api/v1/categories/{id}
DELETE /api/v1/categories/{id}

GET    /api/v1/recipes/
GET    /api/v1/recipes/{id}
POST   /api/v1/recipes/
PUT    /api/v1/recipes/{id}
DELETE /api/v1/recipes/{id}

FastAPI proporciona además documentación automática:

/docs


##🛠️ Instalación

Clona el repositorio:

git clone https://github.com/tu-usuario/ChefAPI.git
cd ChefAPI


Crea un entorno virtual:

python -m venv .venv


Actívalo:

Windows
.venv\Scripts\activate

Linux / macOS
source .venv/bin/activate


Instala las dependencias:

pip install -r requirements.txt
▶️ Ejecutar el backend

Desde la carpeta del proyecto:

uvicorn backend.main:app --reload


La API estará disponible en:

http://127.0.0.1:8000

Y la documentación interactiva en:

http://127.0.0.1:8000/docs
🗄️ Base de datos


El proyecto utiliza SQLite.

La base de datos se crea automáticamente al iniciar el backend si no existe.

chefapi.db


#🎨 Frontend

El frontend utiliza HTML, CSS y JavaScript.

Para utilizarlo, abre:

frontend/index.html

El frontend se comunica con la API mediante Axios.


##📌 Estado del proyecto

Proyecto desarrollado como aplicación de gestión de recetas y categorías, con una arquitectura separada entre frontend y backend.