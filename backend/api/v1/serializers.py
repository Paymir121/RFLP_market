from rest_framework import serializers
from products.models import Product, ProductType, ProductCategory, ProductImage


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_main']


class ProductTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductType
        fields = ['id', 'name', 'description']


class ProductCategorySerializer(serializers.ModelSerializer):
    product_type = ProductTypeSerializer()

    class Meta:
        model = ProductCategory
        fields = ['id', 'name', 'product_type']


class ProductSerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer()
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'quantity',
            'category', 'is_active', 'specifications', 'images',
            'created_at', 'updated_at'
        ]

    def to_representation(self, instance):
        """Добавляем динамические поля в зависимости от типа продукта"""
        data = super().to_representation(instance)

        # Добавляем специфичные поля для разных категорий
        category_name = instance.category.name.lower()

        if 'radiopharmaceutical' in category_name:
            data['half_life'] = instance.specifications.get('half_life', '')
            data['radiation_type'] = instance.specifications.get('radiation_type', '')

        elif 'equipment' in category_name:
            data['manufacturer'] = instance.specifications.get('manufacturer', '')
            data['warranty'] = instance.specifications.get('warranty', '')

        return data


class ProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'name', 'description', 'price', 'quantity',
            'category', 'specifications'
        ]