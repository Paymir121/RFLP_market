import json
import os
import django
from django.utils import timezone


# Импорт моделей ПОСЛЕ настройки окружения
from products.models import ProductType, ProductCategory, Product, ProductImage


def load_data_from_json():
    """Загрузка данных из JSON файла в базу данных"""
    with open("products/product_types.json", 'r', encoding='utf-8') as file:
        product_types_data = json.load(file)

    print(f"Найдено {len(product_types_data.get('product_types', []))} product_types")

    # Сначала создаем все типы продуктов
    product_types = {}
    for type_data in product_types_data.get("product_types", []):
        product_type, created = ProductType.objects.get_or_create(
            name=type_data["name"],
            defaults={'description': type_data["description"]}
        )
        product_types[type_data["name"]] = product_type
        if created:
            print(f"Создан новый тип продукта: {product_type.name}")

    print("product_types=", product_types)
    with open("products/product_categories.json", 'r', encoding='utf-8') as file:
        categories_data = json.load(file)

    print(f"Найдено {len(categories_data.get('product_categories', []))} product_categories")

    categories = {}
    for category_data in categories_data.get("product_categories", []):
        print("name=", category_data["name"])
        print(f"product_type=", product_types[category_data["product_type"]])
        category, created = ProductCategory.objects.get_or_create(
            name=category_data["name"],
            product_type=product_types[category_data["product_type"]]
        )
        categories[category_data["name"]] = category
        if created:
            print(f"Создана новая категория: {category.name}")
    print("categories=", categories)
    with open("products/products.json", 'r', encoding='utf-8') as file:
        products_data = json.load(file)

    print(f"Найдено {len(products_data.get('products', []))} продуктов для загрузки")

    # Теперь создаем продукты
    for product_data in products_data.get("products", []):
        print("product_data=",product_data)
        print("category=", categories[product_data["category"]])
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