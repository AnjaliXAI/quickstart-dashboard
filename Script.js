const apiURL = "https://fakestoreapi.com/products";
let allProducts = [];
let cartCount = 0;

// Fetch products
async function loadProducts() {
  try {
    document.getElementById("productGrid").innerHTML = "<p>Loading...</p>";
    const res = await fetch(apiURL);
    if (!res.ok) throw new Error("API fetch failed");
    allProducts = await res.json();
    renderProducts(allProducts);
    populateCategories();
  } catch (err) {
    document.getElementById("productGrid").innerHTML =
      "<p class='text-danger'>Could not load products. Please try again later.</p>";
  }
}

// Render products
function renderProducts(products) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";
  products.forEach(p => {
    const card = `
      <div class="col-md-3 mb-4">
        <div class="card h-100">
          <img src="${p.image}" class="card-img-top" alt="${p.title}">
          <div class="card-body">
            <h6 class="card-title">${p.title.substring(0,40)}...</h6>
            <p class="text-success">$${p.price}</p>
            <button class="btn btn-sm btn-info" onclick="showDetails(${p.id})">Details</button>
            <button class="btn btn-sm btn-warning" onclick="addToCart()">Add to Cart</button>
          </div>
        </div>
      </div>`;
    grid.innerHTML += card;
  });
}

// Populate category filter
function populateCategories() {
  const categories = [...new Set(allProducts.map(p => p.category))];
  const filter = document.getElementById("categoryFilter");
  categories.forEach(c => {
    filter.innerHTML += `<option value="${c}">${c}</option>`;
  });
}

// Reusable functions
function filterByCategory(category) {
  return category ? allProducts.filter(p => p.category === category) : allProducts;
}
function searchProducts(keyword) {
  return allProducts.filter(p => p.title.toLowerCase().includes(keyword.toLowerCase()));
}

// Event listeners
document.getElementById("searchBox").addEventListener("input", e => {
  renderProducts(searchProducts(e.target.value));
});
document.getElementById("categoryFilter").addEventListener("change", e => {
  renderProducts(filterByCategory(e.target.value));
});
document.getElementById("sortFilter").addEventListener("change", e => {
  const val = e.target.value;
  let sorted = [...allProducts];
  if (val === "asc") sorted.sort((a,b) => a.price - b.price);
  if (val === "desc") sorted.sort((a,b) => b.price - a.price);
  renderProducts(sorted);
});

// Product details
function showDetails(id) {
  const product = allProducts.find(p => p.id === id);
  document.getElementById("modalTitle").innerText = product.title;
  document.getElementById("modalBody").innerHTML = `
    <img src="${product.image}" class="img-fluid mb-2">
    <p>${product.description}</p>
    <p><strong>Price:</strong> $${product.price}</p>
    <p><strong>Rating:</strong> ${product.rating.rate} (${product.rating.count} reviews)</p>
  `;
  new bootstrap.Modal(document.getElementById("productModal")).show();
}

// Cart simulation
function addToCart() {
  cartCount++;
  document.getElementById("cartCount").innerText = `Cart: ${cartCount}`;
}

// Initialize
loadProducts();
