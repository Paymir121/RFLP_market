from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from products.models import Product, ProductType, ProductCategory
from .serializers import (
    ProductSerializer, ProductCreateSerializer,
    ProductTypeSerializer, ProductCategorySerializer
)
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from rest_framework.response import Response


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True).select_related('category__product_type').prefetch_related(
        'images')
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'category': ['exact'],
        'category__product_type': ['exact'],  # Фильтрация по типу продукта
        'is_active': ['exact'],
    }
    search_fields = ['name', 'description', 'category__name', 'category__product_type__name']
    ordering_fields = ['price', 'created_at', 'updated_at']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProductCreateSerializer
        return ProductSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        queryset = super().get_queryset()

        # Дополнительная фильтрация по типу продукта
        product_type_id = self.request.query_params.get('product_type', None)
        if product_type_id:
            queryset = queryset.filter(category__product_type_id=product_type_id)

        return queryset

    def perform_create(self, serializer):
        """Добавляем специфичные поля при создании продукта"""
        product = serializer.save()
        category = product.category
        specs = {}

        # Определяем спецификации в зависимости от типа продукта
        if category.product_type.name.lower() == 'радиофармпрепарат':
            specs = {
                'half_life': self.request.data.get('half_life', ''),
                'radiation_type': self.request.data.get('radiation_type', ''),
                'storage_conditions': self.request.data.get('storage_conditions', ''),
            }
        elif category.product_type.name.lower() == 'оборудование':
            specs = {
                'manufacturer': self.request.data.get('manufacturer', ''),
                'warranty': self.request.data.get('warranty', ''),
                'weight': self.request.data.get('weight', ''),
            }
        elif category.product_type.name.lower() == 'вспомогательные вещества':
            specs = {
                'composition': self.request.data.get('composition', ''),
                'packaging': self.request.data.get('packaging', ''),
            }

        product.specifications = specs
        product.save()


class ProductTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductType.objects.all()
    serializer_class = ProductTypeSerializer
    permission_classes = [AllowAny]
    pagination_class = None  # Отключаем пагинацию для типов продуктов


class ProductCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductCategory.objects.all().select_related('product_type')
    serializer_class = ProductCategorySerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['product_type']

    def get_queryset(self):
        queryset = super().get_queryset()

        # Фильтрация категорий по типу продукта
        product_type_id = self.request.query_params.get('product_type', None)
        if product_type_id:
            queryset = queryset.filter(product_type_id=product_type_id)

        return queryset