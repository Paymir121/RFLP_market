from django.db import models
from django.contrib.auth.models import User


class Product(models.Model):
    name = models.CharField(
        max_length=256,
        verbose_name="Название",
        help_text="Введите название продукта",
    )
    description = models.TextField(
        verbose_name="Описание",
        help_text="Введите описание продукта",
    )
    price = models.DecimalField(
        verbose_name="Цена",
        help_text="Введите цену продукта",
        max_digits=8,
        decimal_places=2,
    )
    image = models.ImageField(
        "Картинка",
        upload_to="posts/",
        null=True,
        blank=True,
    )
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name="Автор",
    )
    class Meta:
        verbose_name = "Продукт"
        verbose_name_plural = "Продукты"

# Create your models here.
class Tag(models.Model):
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    name = models.CharField(
        max_length=256,
        verbose_name="Тег",
        help_text="Введите название тега",
    )
    class Meta:
        verbose_name = "Таг"
        verbose_name_plural = "Таги"

    def __str__(self):
        return self.name


class ProductTag(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Таг в продукте"
        verbose_name_plural = "Таги в продуктах"

    def __str__(self):
        return f"{self.product} {self.tag}"



class TypeOfProduct(models.Model):
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    name = models.CharField(
        max_length=256,
        verbose_name="Тип продукта",
        help_text="Введите название типа",
    )
    class Meta:
        verbose_name = "Тип"
        verbose_name_plural = "Типы"

    def __str__(self):
        return self.name


class ProductType(models.Model):
    """Модель связи продуктов и типов"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    type = models.ForeignKey(TypeOfProduct, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Тип в продукте"
        verbose_name_plural = "Типы в продуктах"

    def __str__(self):
        return f"{self.product} {self.type}"

class ProductFeatures(models.Model):
    type = models.ForeignKey(TypeOfProduct, on_delete=models.CASCADE)
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    name = models.CharField(
        max_length=256,
        verbose_name="Характеристика продукта",
        help_text="Введите характеристику продукта",
    )
    measurement_unit = models.TextField(verbose_name="Единицы измерения")

    class Meta:
        verbose_name = "Характеристика"
        verbose_name_plural = "Характеристики"

    def __str__(self):
        return self.name