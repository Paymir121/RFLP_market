from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, ProductTypeViewSet, ProductCategoryViewSet

router = DefaultRouter()
router.register(r'product-types', ProductTypeViewSet)
router.register(r'product-categories', ProductCategoryViewSet)
router.register(r'products', ProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
]