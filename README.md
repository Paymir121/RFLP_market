Магазин радиофармпрепаратов и медицнских изделей.
## Описание
### Технологии
- **Django**
- **React**
- **Docker**
- **Nginx**

### Авторы
Nikki Nikonor

## Установка
Как развернуть проект на локальной машине;

### Клонирование репозитория:
Просите разрешение у владельца репозитория( можно со слезами на глазах)
Клонируете репозиторий:

```bash
        git clone  git@github.com:Paymir121/RLPG_market.git
```

### Cоздать и активировать виртуальное окружение:
```
python -m venv venv
* Если у вас Linux/macOS
    ```
    source venv/bin/activate
    ```

* Если у вас windows
    ```
    source venv/scripts/activate
    ```
```
### Установить зависимости из файла requirements.txt:
```
        cd backend
        python -m pip install --upgrade pip
        pip install -r requirements.txt
```


### Выполнить миграции:
```
        cd backend
        python manage.py makemigrations
        python manage.py migrate
```

### Запустить проект:
```
        cd backend
        python manage.py runserver
```

### Создать суперпользователя:
```
        cd backend
        python manage.py createsuperuser
```
### Наполнить базу данных:
```
        cd backend
        python manage.py importcsv
```

## Запуск докер контейнеров на локальной машине:

### Билдим проект и запускаем:
```
        docker compose up --build
```

### Выполнить миграции:
```
        docker compose exec backend python manage.py migrate
```

### Выполнить создание суперпользователя:
```
        docker compose exec backend python manage.py createsuperuser
```

### Выполнить Собрать статику Django:
```
        docker compose exec backend python manage.py collectstatic
        docker compose exec backend cp -r /app/collected_static/. /backend_static/static/
```

### Выполнить добавление ингредиентов из csv-файла:
```
        docker compose exec backend python manage.py importcsv
```

## Запуск докер контейнеров на удаленной машине:

### Выполнить обновление apt:
```
        sudo apt update
```

### Билдим проект и запускаем:
```
        sudo docker compose -f docker-compose.production.yml up --build
```

### Выполнить миграции:
```
        docker compose -f docker-compose.production.yml exec backend python manage.py migrate
```

### Выполнить миграции:
```
        docker compose -f docker-compose.production.yml exec backend python manage.py createsuperuser
```

### Выполнить добавление ингредиентов из csv-файла:
```
        docker compose -f docker-compose.production.yml exec backend python manage.py importcsv
```


### Настройки nginx:
```
        sudo nano /etc/nginx/sites-enabled/default
```

#### Используя Rest API
Посмотреть\отправить запросы можно используя плагин для Visual Studia Code Rest API все примеры лежат в папке backend/request
