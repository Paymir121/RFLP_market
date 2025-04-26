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


class ProductTypeViewSet(viewsets.ModelViewSet):
    queryset = ProductType.objects.all()
    serializer_class = ProductTypeSerializer
    permission_classes = [AllowAny]


class ProductCategoryViewSet(viewsets.ModelViewSet):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['product_type']


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True).select_related('category')
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'category__product_type']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProductCreateSerializer
        return ProductSerializer

    def perform_create(self, serializer):
        """Добавляем специфичные поля при создании продукта"""
        product = serializer.save()

        # Пример обработки спецификаций для разных категорий
        category_name = product.category.name.lower()
        specs = {}

        if 'radiopharmaceutical' in category_name:
            specs = {
                'half_life': self.request.data.get('half_life', ''),
                'radiation_type': self.request.data.get('radiation_type', ''),
                'storage_conditions': self.request.data.get('storage_conditions', '')
            }
        elif 'equipment' in category_name:
            specs = {
                'manufacturer': self.request.data.get('manufacturer', ''),
                'warranty': self.request.data.get('warranty', ''),
                'weight': self.request.data.get('weight', '')
            }

        product.specifications = specs
        product.save()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def order(self, request, pk=None):
        product = self.get_object()
        quantity = request.data.get('quantity', 1)

        # Здесь должна быть логика создания заказа
        return Response({'status': f'Ordered {quantity} of {product.name}'})