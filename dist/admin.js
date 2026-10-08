"use strict";
const API_URL = 'https://api.escuelajs.co/api/v1';
const categoryForm = document.getElementById('category-form');
const categoryName = document.getElementById('cat-name');
const categoryImage = document.getElementById('cat-image');
const categoriesList = document.getElementById('categories-list');
const productForm = document.getElementById('product-form');
const productTitle = document.getElementById('prod-title');
const productPrice = document.getElementById('prod-price');
const productDescription = document.getElementById('prod-desc');
const productCategory = document.getElementById('prod-category');
const productImage = document.getElementById('prod-image');
const productsList = document.getElementById('products-list');
// ==========================
// КАТЕГОРИИ
// ==========================
async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) {
            throw new Error('Не удалось загрузить категории');
        }
        const categories = await response.json();
        renderCategories(categories);
        fillCategorySelect(categories);
    }
    catch (error) {
        console.error(error);
        categoriesList.innerHTML = `
            <li>Не удалось загрузить категории</li>
        `;
    }
}
function renderCategories(categories) {
    categoriesList.innerHTML = '';
    categories.forEach((category) => {
        const li = document.createElement('li');
        li.textContent = category.name;
        categoriesList.appendChild(li);
    });
}
function fillCategorySelect(categories) {
    productCategory.innerHTML = `
        <option value="">-- Выберите категорию --</option>
    `;
    categories.forEach((category) => {
        const option = document.createElement('option');
        option.value = String(category.id);
        option.textContent = category.name;
        productCategory.appendChild(option);
    });
}
// ==========================
// СОЗДАНИЕ КАТЕГОРИИ
// ==========================
categoryForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = categoryName.value.trim();
    const image = categoryImage.value.trim() || 'https://picsum.photos/200';
    if (!name) {
        return;
    }
    try {
        const response = await fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                image
            })
        });
        if (!response.ok) {
            throw new Error('Не удалось создать категорию');
        }
        alert('Категория создана!');
        categoryForm.reset();
        await loadCategories();
    }
    catch (error) {
        console.error(error);
        alert('Ошибка при создании категории');
    }
});
// ==========================
// ТОВАРЫ
// ==========================
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
            throw new Error('Не удалось загрузить товары');
        }
        const products = await response.json();
        renderProducts(products);
    }
    catch (error) {
        console.error(error);
        productsList.innerHTML = `
            <tr>
                <td colspan="4">
                    Не удалось загрузить товары


</td>
            </tr>
        `;
    }
}
function renderProducts(products) {
    productsList.innerHTML = '';
    products.forEach((product) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.title}</td>
            <td>${product.price} ₽</td>
            <td>
                <button
                    class="btn-delete"
                    data-id="${product.id}"
                >
                    Удалить
                </button>
            </td>
        `;
        productsList.appendChild(row);
    });
    addDeleteHandlers();
}
// ==========================
// УДАЛЕНИЕ ТОВАРА
// ==========================
function addDeleteHandlers() {
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            const id = button.dataset.id;
            if (!id) {
                return;
            }
            try {
                const response = await fetch(`${API_URL}/products/${id}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    throw new Error('Не удалось удалить товар');
                }
                alert('Товар удалён');
                await loadProducts();
            }
            catch (error) {
                console.error(error);
                alert('Ошибка при удалении товара');
            }
        });
    });
}
// ==========================
// ДОБАВЛЕНИЕ ТОВАРА
// ==========================
productForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = productTitle.value.trim();
    const price = Number(productPrice.value);
    const description = productDescription.value.trim();
    const categoryId = Number(productCategory.value);
    const image = productImage.value.trim()
        || 'https://placehold.co/600x400';
    if (!title) {
        alert('Введите название товара');
        return;
    }
    if (!title.startsWith('MY_')) {
        alert('Название товара должно начинаться с MY_');
        return;
    }
    if (!categoryId) {
        alert('Выберите категорию');
        return;
    }
    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                price,
                description,
                categoryId,
                images: [image]
            })
        });
        if (!response.ok) {
            throw new Error('Не удалось создать товар');
        }
        alert('Товар добавлен!');
        productForm.reset();
        await loadProducts();
    }
    catch (error) {
        console.error(error);
        alert('Ошибка при добавлении товара');
    }
});
// ==========================
// ЗАПУСК
// ==========================
loadCategories();
loadProducts();
