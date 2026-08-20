/**
 * products.js -- product listing and detail page logic.
 */

const CATEGORIES = ['Electronics', 'Clothing', 'Home', 'Books', 'Sports', 'Toys'];
const SORT_OPTIONS = ['relevance', 'price-asc', 'price-desc', 'rating-desc'];

const PRODUCT_IMAGE_FALLBACKS = {
  'Wireless Bluetooth Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
  'Cotton Crew Neck T-Shirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
  'Non-Stick Fry Pan 26cm': 'https://images.unsplash.com/photo-1584990347449-ae614bec7045?auto=format&fit=crop&w=1200&q=80',
  'The Silent Orchard: A Novel': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
  'Yoga Mat with Carry Strap': 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=1200&q=80',
  'Building Blocks Set (250 Pieces)': 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&q=80',
  'Smartwatch with Heart Rate Monitor': 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80',
  'Denim Slim Fit Jeans': 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=80',
  'Memory Foam Pillow (Set of 2)': 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=80',
  'Atomic Habits for Beginners': 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=1200&q=80',
  'Adjustable Dumbbell Set (5-25kg)': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
  'Remote Control Racing Car': 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=1200&q=80',
  '4K Ultra HD Action Camera': 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80',
  'Woolen Winter Sweater': 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80',
  'Stainless Steel Cookware Set (5 Pieces)': 'https://images.unsplash.com/photo-1583778176476-4a8b02a64c21?auto=format&fit=crop&w=1200&q=80',
  "Children's Illustrated Fairy Tales": 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1200&q=80',
  'Football Size 5 Match Ball': 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=1200&q=80',
  'Wooden Puzzle Set for Toddlers': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80',
  'Portable Bluetooth Speaker': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80',
  'Leather Wallet for Men': 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=80',
  'LED Desk Lamp with USB Charging': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80',
  'The Art of Mindful Living': 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&w=1200&q=80',
  'Cycling Helmet with Visor': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
  'Plush Teddy Bear (18 inch)': 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&w=1200&q=80',
  'Noise Cancelling Earbuds': 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1200&q=80',
  'Formal Cotton Shirt': 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=1200&q=80',
  'Ceramic Dinner Set (16 Pieces)': 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=80',
  'Cookbook: 100 Weeknight Dinners': 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
  'Resistance Bands Set (5 Levels)': 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=1200&q=80',
  'Building Robot Toy Kit': 'https://images.unsplash.com/photo-1561144257-e32e8efc6c4f?auto=format&fit=crop&w=1200&q=80'
};

const CATEGORY_IMAGE_FALLBACKS = {
  Electronics: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80',
  Clothing: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80',
  Home: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80',
  Books: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=1200&q=80',
  Sports: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
  Toys: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1200&q=80'
};

let listingRequestId = 0;

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

function escapeAttr(str) {
  return escapeHtml(str);
}

function truncate(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

function formatPrice(price) {
  return Number(price || 0).toLocaleString('en-IN');
}

function renderStars(rating) {
  const rounded = Math.max(0, Math.min(5, Math.round(rating || 0)));
  const full = '\u2605'.repeat(rounded);
  const empty = '\u2606'.repeat(5 - rounded);
  return full + empty;
}

function getProductImageUrl(product) {
  const current = (product && product.imageUrl ? String(product.imageUrl) : '').trim();
  const isLegacyPlaceholder = !current || /picsum\.photos/i.test(current);

  if (!isLegacyPlaceholder) return current;
  if (product && PRODUCT_IMAGE_FALLBACKS[product.name]) return PRODUCT_IMAGE_FALLBACKS[product.name];
  if (product && CATEGORY_IMAGE_FALLBACKS[product.category]) return CATEGORY_IMAGE_FALLBACKS[product.category];
  return 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80';
}

function sortProducts(products, sortBy) {
  const list = [...products];
  if (sortBy === 'price-asc') return list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
  if (sortBy === 'price-desc') return list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
  if (sortBy === 'rating-desc') return list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
  return list;
}

function productCardTemplate(product) {
  return `
    <a class="product-card" href="product.html?id=${encodeURIComponent(product._id)}">
      <img class="product-card-image" src="${escapeAttr(getProductImageUrl(product))}" alt="${escapeAttr(product.name)}" loading="lazy" />
      <div class="product-card-body">
        <span class="product-card-category">${escapeHtml(product.category || 'General')}</span>
        <h3 class="product-card-name">${escapeHtml(product.name || 'Unnamed Product')}</h3>
        <p class="product-card-desc">${escapeHtml(truncate(product.description || 'No description available.', 96))}</p>
        <div class="product-card-footer">
          <span class="product-price">${formatPrice(product.price)}</span>
          <span class="rating-badge">${escapeHtml(String(product.rating || 0))} \u2605</span>
        </div>
      </div>
    </a>
  `;
}

function populateCategoryFilter(selectEl) {
  if (!selectEl) return;
  CATEGORIES.forEach((cat) => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    selectEl.appendChild(opt);
  });
}

function readFiltersFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const sort = SORT_OPTIONS.includes(urlParams.get('sort')) ? urlParams.get('sort') : 'relevance';
  return {
    search: (urlParams.get('search') || '').trim(),
    category: (urlParams.get('category') || '').trim(),
    sort
  };
}

function syncFiltersToUrl({ search, category, sort }) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (category) params.set('category', category);
  if (sort && sort !== 'relevance') params.set('sort', sort);
  const next = params.toString();
  const path = `${window.location.pathname}${next ? `?${next}` : ''}`;
  window.history.replaceState({}, '', path);
}

function renderResultsMeta(productsCount, filters) {
  const countEl = document.getElementById('results-count');
  const filterSummary = document.getElementById('active-filter-summary');
  if (countEl) {
    countEl.textContent = `${productsCount} result${productsCount === 1 ? '' : 's'} found`;
  }

  if (!filterSummary) return;
  const chips = [];
  if (filters.search) chips.push(`Search: ${filters.search}`);
  if (filters.category) chips.push(`Category: ${filters.category}`);
  if (filters.sort && filters.sort !== 'relevance') chips.push(`Sort: ${filters.sort.replace('-', ' ')}`);

  if (chips.length === 0) {
    filterSummary.innerHTML = '<span class="filter-pill">Showing all products</span>';
    return;
  }

  filterSummary.innerHTML = chips.map((item) => `<span class="filter-pill">${escapeHtml(item)}</span>`).join('');
}

async function loadProducts(filters = {}) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  const requestId = ++listingRequestId;
  const applied = {
    search: (filters.search || '').trim(),
    category: (filters.category || '').trim(),
    sort: SORT_OPTIONS.includes(filters.sort) ? filters.sort : 'relevance'
  };

  grid.innerHTML = '<div class="loading-state">Loading products...</div>';

  const query = new URLSearchParams();
  if (applied.search) query.set('search', applied.search);
  if (applied.category) query.set('category', applied.category);

  try {
    const data = await api.get(`/products${query.toString() ? `?${query.toString()}` : ''}`);
    if (requestId !== listingRequestId) return;

    const products = sortProducts(data.products || [], applied.sort);
    renderResultsMeta(products.length, applied);

    if (products.length === 0) {
      grid.innerHTML = '<div class="empty-state">No products found. Try a different search or category.</div>';
      return;
    }

    grid.innerHTML = products.map(productCardTemplate).join('');
    grid.querySelectorAll('.product-card').forEach((card, i) => {
      card.style.setProperty('--delay', `${i * 45}ms`);
    });
    syncFiltersToUrl(applied);
  } catch (err) {
    if (requestId !== listingRequestId) return;
    grid.innerHTML = `<div class="error-state">${escapeHtml(err.message || 'Failed to load products.')}</div>`;
  }
}

function initProductListing() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  const searchInput = document.getElementById('search-input');
  const categorySelect = document.getElementById('category-select');
  const sortSelect = document.getElementById('sort-select');
  const filterForm = document.getElementById('filter-form');
  const clearBtn = document.getElementById('clear-filters-btn');

  populateCategoryFilter(categorySelect);

  const initial = readFiltersFromUrl();
  if (searchInput) searchInput.value = initial.search;
  if (categorySelect) categorySelect.value = initial.category;
  if (sortSelect) sortSelect.value = initial.sort;

  loadProducts(initial);

  if (filterForm) {
    filterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      loadProducts({
        search: searchInput ? searchInput.value.trim() : '',
        category: categorySelect ? categorySelect.value : '',
        sort: sortSelect ? sortSelect.value : 'relevance'
      });
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      loadProducts({
        search: searchInput ? searchInput.value.trim() : '',
        category: categorySelect ? categorySelect.value : '',
        sort: sortSelect.value
      });
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (categorySelect) categorySelect.value = '';
      if (sortSelect) sortSelect.value = 'relevance';
      loadProducts({ search: '', category: '', sort: 'relevance' });
    });
  }
}

async function loadProductDetail() {
  const container = document.getElementById('product-detail-container');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  if (!id) {
    container.innerHTML = '<div class="error-state">No product ID was provided.</div>';
    return;
  }

  container.innerHTML = '<div class="loading-state">Loading product...</div>';

  try {
    const data = await api.get(`/products/${encodeURIComponent(id)}`);
    const product = data.product || {};
    const inStock = Number(product.stock || 0) > 0;

    document.title = `${product.name || 'Product'} | Bazaario`;

    container.innerHTML = `
      <div class="product-detail">
        <img class="product-detail-image" src="${escapeAttr(getProductImageUrl(product))}" alt="${escapeAttr(product.name || 'Product image')}" loading="eager" />
        <div class="product-detail-info">
          <span class="product-detail-category">${escapeHtml(product.category || 'General')}</span>
          <h1 class="product-detail-name">${escapeHtml(product.name || 'Unnamed Product')}</h1>
          <div class="product-detail-price-row">
            <span class="product-detail-price">${formatPrice(product.price)}</span>
            <span class="stars" title="${escapeAttr(String(product.rating || 0))} out of 5">${renderStars(product.rating)}</span>
            <span>(${escapeHtml(String(product.rating || 0))} / 5)</span>
          </div>
          <p class="product-detail-desc">${escapeHtml(product.description || 'No description available for this product.')}</p>
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
              <div class="value">${escapeHtml(product.category || 'General')}</div>
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
