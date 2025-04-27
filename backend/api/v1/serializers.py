from rest_framework import serializers
from products.models import Product, ProductType, ProductCategory, ProductImage
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'is_active', 'is_staff', 'is_superuser', 'date_joined', 'last_login', 'first_name', 'last_name']
        read_only_fields = ['id', 'email', 'is_active', 'is_staff', 'is_superuser', 'date_joined', 'last_login']

class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'password', 'first_name', 'last_name', 'username')
        extra_kwargs = {
            'username': {'required': False, 'allow_null': True}
        }

    def create(self, validated_data):
        # If username is not provided, use email as username
        if 'username' not in validated_data or not validated_data['username']:
            validated_data['username'] = validated_data['email']
        return super().create(validated_data)

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
    images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )

    class Meta:
        model = Product
        fields = [
            'name', 'description', 'price', 'quantity',
            'category', 'specifications', 'images'
        ]

    def create(self, validated_data):
        # Get images from validated_data (they're now properly processed)
        images = validated_data.pop('images', [])

        # Create product
        product = Product.objects.create(**validated_data)

        # Create product images
        for image in images:
            ProductImage.objects.create(product=product, image=image)

        return product