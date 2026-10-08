const API_URL = 'https://api.escuelajs.co/api/v1';
const productsContainer = document.getElementById('products-container');
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');
const LIMIT = 5;
let currentPage = 1;
let myProducts = [];
async function loadProducts() {
    try {
        const offset = (currentPage - 1) * LIMIT;
        const response = await fetch(`${API_URL}/products?offset=${offset}&limit=${LIMIT}`);
        if (!response.ok) {
            throw new Error('Не удалось загрузить товары');
        }
        const products = await response.json();
        myProducts = products.filter((product) => product.title.startsWith('MY_'));
        renderProducts();
        updatePagination();
    }
    catch (error) {
        console.error(error);
        productsContainer.innerHTML = `
            <div class="error-message">
                <p>Не удалось загрузить товары.</p>
            </div>
        `;
    }
}
function renderProducts() {
    productsContainer.innerHTML = '';
    if (myProducts.length === 0) {
        productsContainer.innerHTML = `
            <div class="error-message">
                <p>На этой странице нет моих товаров.</p>
            </div>
        `;
        return;
    }
    myProducts.forEach((product) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        const image = product.images[0] || 'https://placehold.co/300x200';
        card.innerHTML = `
            <img 
                src="${image}"
                alt="${product.title}"
                loading="lazy"
            >

            <h3>${product.title}</h3>

            <p class="price">${product.price} ₽</p>

            <a
                href="product.html?id=${product.id}"
                class="btn-details"
            >
                Подробнее
            </a>
        `;
        productsContainer.appendChild(card);
    });
}
function updatePagination() {
    pageInfo.textContent = `Страница ${currentPage}`;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = myProducts.length < LIMIT;
}
prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        loadProducts();
    }
});
nextButton.addEventListener('click', () => {
    if (myProducts.length === LIMIT) {
        currentPage++;
        loadProducts();
    }
});
loadProducts();
export {};
