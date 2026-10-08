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

const productImage = document.getElementById('product-img') as HTMLImageElement;
const productTitle = document.getElementById('product-title') as HTMLHeadingElement;
const productPrice = document.getElementById('product-price') as HTMLParagraphElement;
const productCategory = document.getElementById('product-category') as HTMLParagraphElement;
const productDescription = document.getElementById('product-description') as HTMLParagraphElement;

const productContainer = document.getElementById('product-container') as HTMLDivElement;
const errorMessage = document.getElementById('error-message') as HTMLDivElement;
const backButton = document.getElementById('back-button') as HTMLButtonElement;

// Получаем ID товара из URL
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

async function loadProduct(): Promise<void> {
    if (!id) {
        showError();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/products/${id}`);

        if (!response.ok) {
            throw new Error('Товар не найден');
        }

        const product: Product = await response.json();

        productImage.src = product.images[0] || 'https://placehold.co/600x400';
        productImage.alt = product.title;

        productTitle.textContent = product.title;
        productPrice.textContent = `${product.price} ₽`;
        productCategory.textContent = `Категория: ${product.category.name}`;
        productDescription.textContent = product.description;

    } catch (error) {
        console.error(error);
        showError();
    }
}

function showError(): void {
    productContainer.style.display = 'none';
    errorMessage.classList.remove('hidden');
}

backButton.addEventListener('click', () => {
    window.location.href = 'index.html';
});

loadProduct();
export{}

