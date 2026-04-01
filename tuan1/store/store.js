    const btn = document.getElementById("loadBtn");
    const list = document.getElementById("productList");
    const message = document.getElementById("message");

    async function loadProducts() {
      try {
        btn.disabled = true;
        btn.textContent = "Đang tải...";
        message.innerHTML = "Đang lấy dữ liệu...";
        list.innerHTML = "";

        const response = await fetch("https://dummyjson.com/products");

        if (!response.ok) {
          throw new Error("Gọi API thất bại");
        }

        const data = await response.json();

        message.innerHTML = "";

        list.innerHTML = data.products.map(product => `
          <div class="card">
            <img src="${product.thumbnail}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p class="price">Giá: $${product.price}</p>
          </div>
        `).join("");
      } catch (error) {
        message.innerHTML = `<p class="error">Lỗi: ${error.message}</p>`;
      } finally {
        btn.disabled = false;
        btn.textContent = "Tải sản phẩm";
      }
    }

    btn.addEventListener("click", loadProducts);