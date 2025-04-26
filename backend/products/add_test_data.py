import json
import os
import django
from django.utils import timezone


# Импорт моделей ПОСЛЕ настройки окружения
from products.models import ProductType, ProductCategory, Product, ProductImage


def load_data_from_json(file_path):
    """Загрузка данных из JSON файла в базу данных"""
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)

    print(f"Найдено {len(data.get('products', []))} продуктов для загрузки")

    # Сначала создаем все типы продуктов
    product_types = {}
    for type_data in data.get("product_types", []):
        product_type, created = ProductType.objects.get_or_create(
            name=type_data["name"],
            defaults={'description': type_data["description"]}
        )
        product_types[type_data["name"]] = product_type
        if created:
            print(f"Создан новый тип продукта: {product_type.name}")

    # Затем создаем все категории продуктов
    categories = {}
    for category_data in data.get("product_categories", []):
        category, created = ProductCategory.objects.get_or_create(
            name=category_data["name"],
            product_type=product_types[category_data["product_type"]]
        )
        categories[category_data["name"]] = category
        if created:
            print(f"Создана новая категория: {category.name}")

    # Теперь создаем продукты
    for product_data in data.get("products", []):
        try:
            product = Product.objects.create(
                name=product_data["name"],
                description=product_data["description"],
                price=product_data["price"],
                quantity=product_data["quantity"],
                category=categories[product_data["category"]],
                is_active=product_data["is_active"],
                specifications=product_data.get("specifications", {})
            )
            print(f"Добавлен продукт: {product.name}")

        except Exception as e:
            print(f"Ошибка при добавлении продукта {product_data.get('name')}: {e}")
            continue

    # Добавляем изображения продуктов
    for image_data in data.get("product_images", []):
        try:
            product = Product.objects.get(name=image_data["product"])
            ProductImage.objects.create(
                product=product,
                image=image_data["image"],
                is_main=image_data["is_main"]
            )
            print(f"Добавлено изображение для продукта {product.name}")
        except Exception as e:
            print(f"Ошибка при добавлении изображения: {e}")
            continue


if __name__ == "__main__":
    # Укажите правильный путь к вашему JSON файлу
    # Настройка окружения Django ДО импорта моделей
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')  # Убедитесь в правильности пути
    django.setup()
    json_file_path = os.path.join(os.path.dirname(__file__), "test_data.json")

    if os.path.exists(json_file_path):
        load_data_from_json(json_file_path)
        print("Загрузка данных завершена!")
    else:
        print(f"Файл {json_file_path} не найден!")