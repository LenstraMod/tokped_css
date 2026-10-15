async function loadProduct() {
    const list = document.querySelector(".list-card");
    list.innerHTML = "<p>Loading.....</p>"

    try {
        const response = await fetch("https://dummyjson.com/products");
        if(!response.ok){
            throw new Error("Server error: " + response.status);
        }

        
        const data = await response.json();

        list.innerHTML = "";

        data.products.forEach(function (product){
            const card = document.createElement("div");
            card.className = "item-card";
            card.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.title}">
                <div class="item-desc">
                    <p class="item-name">${product.title}</p>
                    <p class="item-price">$${product.price}</p>
                    <div class="item-desc-detail">
                        <div class="rating">
                            <span class="star-symbol material-symbols-outlined">star</span>
                            <span class="item-rating">${product.rating}</span>
                        </div>
                        <span class="item-sold">${product.stock} terjual</span>
                    </div>
                    <p class="shop-name">${product.brand}</p>
                </div>
            `;

            list.appendChild(card);
        });
    } catch (error) {
        alert(error)
        console.error(error);
    }
}

loadProduct();