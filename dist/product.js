const API_URL = 'https://api.escuelajs.co/api/v1';
const productImage = document.getElementById('product-img');
const productTitle = document.getElementById('product-title');
const productPrice = document.getElementById('product-price');
const productCategory = document.getElementById('product-category');
const productDescription = document.getElementById('product-description');
const productContainer = document.getElementById('product-container');
const errorMessage = document.getElementById('error-message');
const backButton = document.getElementById('back-button');
// Получаем ID товара из URL
const params = new URLSearchParams(window.location.search);
const id = params.get('id');
async function loadProduct() {
    if (!id) {
        showError();
        return;
    }
    try {
        const response = await fetch(`${API_URL}/products/${id}`);
        if (!response.ok) {
            throw new Error('Товар не найден');
        }
        const product = await response.json();
        productImage.src = product.images[0] || 'https://placehold.co/600x400';
        productImage.alt = product.title;
        productTitle.textContent = product.title;
        productPrice.textContent = `${product.price} ₽`;
        productCategory.textContent = `Категория: ${product.category.name}`;
        productDescription.textContent = product.description;
    }
    catch (error) {
        console.error(error);
        showError();
    }
}
function showError() {
    productContainer.style.display = 'none';
    errorMessage.classList.remove('hidden');
}
backButton.addEventListener('click', () => {
    window.location.href = 'index.html';
});
loadProduct();
export {};
