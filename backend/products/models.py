from django.db import models

class ProductType(models.Model):
    """Тип продукта (радиофармпрепарат, оборудование и т.д.)"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name
    class Meta:
        verbose_name = "Тип продукта"
        verbose_name_plural = "Типы продуктов"

class ProductCategory(models.Model):
    """Категория продукта"""
    name = models.CharField(max_length=100)
    product_type = models.ForeignKey(ProductType, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.product_type.name} - {self.name}"

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории продуктов"

class Product(models.Model):
    """Основная модель продукта"""
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=0)
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Динамические характеристики для разных типов продуктов
    specifications = models.JSONField()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Продукт"
        verbose_name_plural = "Продукты"

class ProductImage(models.Model):
    """Изображения продуктов"""
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/')
    is_main = models.BooleanField(default=False)

    def __str__(self):
        return f"Фотография для {self.product.name}"

    class Meta:
        verbose_name = "Фото Продукта"
        verbose_name_plural = "Фотографии продукта"