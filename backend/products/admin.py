from django.contrib import admin
from django.urls import path
from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib import messages
from django.utils.html import format_html
from .models import Product, ProductType, ProductCategory, ProductImage
from .add_test_data import  load_data_from_json


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1  # Количество пустых полей для добавления новых изображений

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImageInline]
    list_display = ('name', 'price', 'quantity', 'is_active', 'created_at', 'updated_at')
    search_fields = ('name', 'description')
    list_filter = ('is_active', 'category')
    readonly_fields = ('process_button',)

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                'process-products/',
                self.admin_site.admin_view(self.process_products),
                name='process_products'
            ),
        ]
        return custom_urls + urls

    def process_button(self, obj):
        return format_html(
            '<a class="button" href="{}">Обработать препараты</a>',
            reverse('admin:process_products')
        )

    process_button.short_description = 'Действия'
    process_button.allow_tags = True

    def process_products(self, request):
        # Вызываем нашу функцию из отдельного файла
        success = load_data_from_json("products/test_data.json")

        if success:
            return HttpResponseRedirect(reverse('admin:products_product_changelist'))
        else:
            return HttpResponseRedirect(reverse('admin:index'))

@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'product_type')

@admin.register(ProductType)
class ProductTypeAdmin(admin.ModelAdmin):
    list_display = ('name',)

