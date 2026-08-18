/**
 * products.js -- fetches and renders the product listing (index.html) and
 * the product detail page (product.html).
 */

const CATEGORIES = ['Electronics', 'Clothing', 'Home', 'Books', 'Sports', 'Toys'];

function truncate(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

function formatPrice(price) {
  return Number(price).toLocaleString('en-IN');
}

function renderStars(rating) {
  const rounded = Math.round(rating || 0);
  const full = '\u2605'.repeat(rounded);
  const empty = '\u2606'.repeat(5 - rounded);
  return full + empty;
}

function productCardTemplate(product) {
  return `
    <a class="product-card" href="product.html?id=${encodeURIComponent(product._id)}">
      <img class="product-card-image" src="${escapeAttr(product.imageUrl)}" alt="${escapeAttr(product.name)}" loading="lazy" />
      <div class="product-card-body">
        <span class="product-card-category">${escapeHtml(product.category)}</span>
        <h3 class="product-card-name">${escapeHtml(product.name)}</h3>
        <p class="product-card-desc">${escapeHtml(truncate(product.description, 90))}</p>
        <div class="product-card-footer">
          <span class="product-price">${formatPrice(product.price)}</span>
          <span class="rating-badge">${escapeHtml(String(product.rating || 0))} \u2605</span>
        </div>
      </div>
    </a>
  `;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

function escapeAttr(str) {
  return escapeHtml(str);
}

/** Populates the category <select> dropdown once, if present on the page. */
function populateCategoryFilter(selectEl) {
  if (!selectEl) return;
  CATEGORIES.forEach((cat) => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    selectEl.appendChild(opt);
  });
}

/** Fetches products from the API given search/category params and renders them. */
async function loadProducts(params = {}) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  grid.innerHTML = '<div class="loading-state">Loading products...</div>';

  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.category) query.set('category', params.category);

  try {
    const data = await api.get(`/products${query.toString() ? '?' + query.toString() : ''}`);
    const products = data.products || [];

    if (products.length === 0) {
      grid.innerHTML = '<div class="empty-state">No products found. Try a different search or category.</div>';
      return;
    }

    grid.innerHTML = products.map(productCardTemplate).join('');
  } catch (err) {
    grid.innerHTML = `<div class="error-state">${escapeHtml(err.message || 'Failed to load products.')}</div>`;
  }
}

/** Wires up the search box, category filter, and form on index.html. */
function initProductListing() {
  const grid = document.getElementById('product-grid');
  if (!grid) return; // Not on the listing page.

  const searchInput = document.getElementById('search-input');
  const categorySelect = document.getElementById('category-select');
  const filterForm = document.getElementById('filter-form');
  const clearBtn = document.getElementById('clear-filters-btn');

  populateCategoryFilter(categorySelect);

  // Read initial state from the URL so links/bookmarks with query params work.
  const urlParams = new URLSearchParams(window.location.search);
  const initialSearch = urlParams.get('search') || '';
  const initialCategory = urlParams.get('category') || '';

  if (searchInput) searchInput.value = initialSearch;
  if (categorySelect) categorySelect.value = initialCategory;

  loadProducts({ search: initialSearch, category: initialCategory });

  if (filterForm) {
    filterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const search = searchInput ? searchInput.value.trim() : '';
      const category = categorySelect ? categorySelect.value : '';
      loadProducts({ search, category });
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (categorySelect) categorySelect.value = '';
      loadProducts({});
    });
  }
}

/** Renders the full product detail view on product.html. */
async function loadProductDetail() {
  const container = document.getElementById('product-detail-container');
  if (!container) return; // Not on the detail page.

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  if (!id) {
    container.innerHTML = '<div class="error-state">No product ID was provided.</div>';
    return;
  }

  container.innerHTML = '<div class="loading-state">Loading product...</div>';

  try {
    const data = await api.get(`/products/${encodeURIComponent(id)}`);
    const product = data.product;
    const inStock = product.stock > 0;

    document.title = `${product.name} | Bazaario`;

    container.innerHTML = `
      <div class="product-detail">
        <img class="product-detail-image" src="${escapeAttr(product.imageUrl)}" alt="${escapeAttr(product.name)}" />
        <div class="product-detail-info">
          <span class="product-detail-category">${escapeHtml(product.category)}</span>
          <h1 class="product-detail-name">${escapeHtml(product.name)}</h1>
          <div class="product-detail-price-row">
            <span class="product-detail-price">${formatPrice(product.price)}</span>
            <span class="stars" title="${escapeAttr(String(product.rating || 0))} out of 5">${renderStars(product.rating)}</span>
            <span>(${escapeHtml(String(product.rating || 0))} / 5)</span>
          </div>
          <p class="product-detail-desc">${escapeHtml(product.description)}</p>
          <div class="detail-meta">
            <div class="detail-meta-item">
              <div class="label">Seller</div>
              <div class="value">${escapeHtml(product.seller || 'Bazaario Marketplace')}</div>
            </div>
            <div class="detail-meta-item">
              <div class="label">Availability</div>
              <div class="value ${inStock ? 'stock-in' : 'stock-out'}">${inStock ? `In Stock (${product.stock} left)` : 'Out of Stock'}</div>
            </div>
            <div class="detail-meta-item">
              <div class="label">Category</div>
              <div class="value">${escapeHtml(product.category)}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="error-state">${escapeHtml(err.message || 'Failed to load product.')}</div>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initProductListing();
  loadProductDetail();
});
