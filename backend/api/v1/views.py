from rest_framework import viewsets
from products.models import Product, Tag, ProductTag, TypeOfProduct, ProductType, ProductFeatures
from .serializers import ProductSerializer, TagSerializer, ProductTagSerializer, TypeOfProductSerializer, \
    ProductTypeSerializer, ProductFeaturesSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class ProductTagViewSet(viewsets.ModelViewSet):
    queryset = ProductTag.objects.all()
    serializer_class = ProductTagSerializer


class TypeOfProductViewSet(viewsets.ModelViewSet):
    queryset = TypeOfProduct.objects.all()
    serializer_class = TypeOfProductSerializer


class ProductTypeViewSet(viewsets.ModelViewSet):
    queryset = ProductType.objects.all()
    serializer_class = ProductTypeSerializer


class ProductFeaturesViewSet(viewsets.ModelViewSet):
    queryset = ProductFeatures.objects.all()
    serializer_class = ProductFeaturesSerializer