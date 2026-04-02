const btn = document.getElementById("loadBtn");
const list = document.getElementById("productList");
const message = document.getElementById("message");

function loadProducts() {
  btn.disabled = true;
  btn.textContent = "Đang tải...";
  message.innerHTML = "Đang lấy dữ liệu...";
  list.innerHTML = "";

  fetch("https://dummyjson.com/products")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Gọi API thất bại");
      }
      return response.json();
    })
    .then((data) => {
      message.innerHTML = "";

      list.innerHTML = data.products.map(product => `
        <div class="card">
          <img src="${product.images[0]}" alt="${product.title}">
          <h3>${product.title}</h3>
          <p class="price">Giá: $${product.price}</p>
        </div>
      `).join("");
    })
    .catch((error) => {
      message.innerHTML = `<p class="error">Lỗi: ${error.message}</p>`;
    })
    .finally(() => {
      btn.disabled = false;
      btn.textContent = "Tải sản phẩm";
    });
}

btn.addEventListener("click", loadProducts);