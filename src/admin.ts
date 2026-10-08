interface Category {
    id: number;
    name: string;
    image: string;
}

interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    images: string[];
    category: Category;
}

const API_URL = 'https://api.escuelajs.co/api/v1';

const categoryForm = document.getElementById('category-form') as HTMLFormElement;
const categoryName = document.getElementById('cat-name') as HTMLInputElement;
const categoryImage = document.getElementById('cat-image') as HTMLInputElement;
const categoriesList = document.getElementById('categories-list') as HTMLUListElement;

const productForm = document.getElementById('product-form') as HTMLFormElement;
const productTitle = document.getElementById('prod-title') as HTMLInputElement;
const productPrice = document.getElementById('prod-price') as HTMLInputElement;
const productDescription = document.getElementById('prod-desc') as HTMLTextAreaElement;
const productCategory = document.getElementById('prod-category') as HTMLSelectElement;
const productImage = document.getElementById('prod-image') as HTMLInputElement;

const productsList = document.getElementById('products-list') as HTMLTableSectionElement;

async function loadCategories(): Promise<void> {
    categoriesList.innerHTML = '<li>Загрузка категорий...</li>';

    try {
        const response = await fetch(`${API_URL}/categories`);

        if (!response.ok) {
            throw new Error(`Ошибка загрузки категорий: ${response.status}`);
        }

        const categories: Category[] = await response.json();

        renderCategories(categories);
        fillCategorySelect(categories);

    } catch (error) {
        console.error(error);

        categoriesList.innerHTML = `
            <li>Не удалось загрузить категории. Попробуйте обновить страницу.</li>
        `;
    }
}

function renderCategories(categories: Category[]): void {
    categoriesList.innerHTML = '';

    categories.forEach((category) => {
        const li = document.createElement('li');
        li.textContent = category.name;
        categoriesList.appendChild(li);
    });
}

function fillCategorySelect(categories: Category[]): void {
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

categoryForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = categoryName.value.trim();
    const image = categoryImage.value.trim() || 'https://picsum.photos/200';

    if (!name) {
        alert('Введите название категории');
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
            throw new Error(`Ошибка создания категории: ${response.status}`);
        }

        alert('Категория создана!');

        categoryForm.reset();

        await loadCategories();

    } catch (error) {
        console.error(error);
        alert('Ошибка при создании категории');
    }
});

async function loadProducts(): Promise<void> {
    productsList.innerHTML = `
        <tr>
            <td colspan="4">Загрузка товаров...</td>
        </tr>
    `;

    try {
        const response = await fetch(`${API_URL}/products`);

        if (!response.ok) {
            throw new Error(`Ошибка загрузки товаров: ${response.status}`);
        }

        const products: Product[] = await response.json();

        renderProducts(products);

    } catch (error) {
        console.error(error);

        productsList.innerHTML = `
            <tr>


<td colspan="4">
                    Не удалось загрузить товары. Попробуйте обновить страницу.
                </td>
            </tr>
        `;
    }
}

function renderProducts(products: Product[]): void {
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

function addDeleteHandlers(): void {
    const deleteButtons = document.querySelectorAll<HTMLButtonElement>(
        '.btn-delete'
    );

    deleteButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            const id = button.dataset.id;

            if (!id) {
                return;
            }

            try {
                const response = await fetch(
                    `${API_URL}/products/${id}`,
                    {
                        method: 'DELETE'
                    }
                );

                if (!response.ok) {
                    throw new Error(`Ошибка удаления: ${response.status}`);
                }

                alert('Товар удалён');

                await loadProducts();

            } catch (error) {
                console.error(error);
                alert('Ошибка при удалении товара');
            }
        });
    });
}

productForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = productTitle.value.trim();
    const price = Number(productPrice.value);
    const description = productDescription.value.trim();
    const categoryId = Number(productCategory.value);
    const image = productImage.value.trim() || 'https://placehold.co/600x400';

    if (!title) {
        alert('Введите название товара');
        return;
    }

    if (!title.startsWith('MY_')) {
        alert('Название товара должно начинаться с MY_');
        return;
    }

    if (!price || price < 0) {
        alert('Введите корректную цену');
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
            throw new Error(`Ошибка создания товара: ${response.status}`);
        }

        alert('Товар добавлен!');

        productForm.reset();

        await loadProducts();

    } catch (error) {
        console.error(error);
        alert('Ошибка при добавлении товара');
    }
});

loadCategories();
loadProducts();