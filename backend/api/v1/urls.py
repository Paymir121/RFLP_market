from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, TagViewSet, ProductTagViewSet, TypeOfProductViewSet, ProductTypeViewSet, \
    ProductFeaturesViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'tags', TagViewSet)
router.register(r'product-tags', ProductTagViewSet)
router.register(r'types', TypeOfProductViewSet)
router.register(r'product-types', ProductTypeViewSet)
router.register(r'features', ProductFeaturesViewSet)

urlpatterns = [
    path('', include(router.urls)),
]