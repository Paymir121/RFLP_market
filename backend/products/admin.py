from django.contrib import admin
from .models import Product, Tag, ProductTag, TypeOfProduct, ProductType, ProductFeatures

class ProductTagInline(admin.TabularInline):
    model = ProductTag
    extra = 1

class ProductTypeInline(admin.TabularInline):
    model = ProductType
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'author')
    search_fields = ('name', 'description')
    list_filter = ('author',)
    inlines = [ProductTagInline, ProductTypeInline]

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}

@admin.register(TypeOfProduct)
class TypeOfProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}

@admin.register(ProductFeatures)
class ProductFeaturesAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'type')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}

@admin.register(ProductTag)
class ProductTagAdmin(admin.ModelAdmin):
    list_display = ('product', 'tag')

@admin.register(ProductType)
class ProductTypeAdmin(admin.ModelAdmin):
    list_display = ('product', 'type')