class Producto {
    constructor(id = 0, nombre = "", precio = 0, imagenUrl = "") {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.imagenUrl = imagenUrl;
    }
}

const cartItems = document.getElementById("cart-items");
const notification = document.getElementById("notification");
const totalPriceDisplay = document.getElementById("total-price");
const productList = document.getElementById("product-list");

const maxItems = 20; // Límite de productos en el carrito
const ivaPercentage = 0.21; // 21% de IVA

// Array de productos usando la clase Producto
let productos = [
    new Producto(1, "Compu 1", 10.00, "https://via.placeholder.com/150"),
    new Producto(2, "Producto 2", 15.00, "https://via.placeholder.com/150"),
    new Producto(3, "Producto 3", 20.00, "https://via.placeholder.com/150"),
    new Producto(4, "Producto 4", 30.00, "https://via.placeholder.com/150"),
    new Producto(5, "Producto 5", 30.00, "https://via.placeholder.com/150"),
    new Producto(6, "Producto 6", 30.00, "https://via.placeholder.com/150")
];

// Función para generar las tarjetas de productos dinámicamente
function generateProductCards(filteredProducts = productos) {
    productList.innerHTML = ''; // Limpiar productos anteriores

    filteredProducts.forEach(producto => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        productCard.innerHTML = `
            <img src="${producto.imagenUrl}" alt="${producto.nombre}">
            <h2>${producto.nombre}</h2>
            <p>$${producto.precio.toFixed(2)}</p>
            <button onclick="addToCart(${producto.id}, '${producto.nombre}', ${producto.precio})">Añadir al carrito</button>
        `;

        productList.appendChild(productCard);
    });
}

// Función para agregar productos al carrito
function addToCart(id, name, price) {
    if (cartItems.children.length >= maxItems) {
        showNotification();
        return; // Sale de la función si el límite está alcanzado
    }

    const item = document.createElement("li");
    item.classList.add("cart-item");
    item.setAttribute("data-id", id);
    item.setAttribute("data-price", price);

    const itemContent = document.createElement("span");
    itemContent.textContent = `${name} - $${price}`;
    item.appendChild(itemContent);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteButton.onclick = function () {
        confirmAndDeleteItem(item);
    };

    item.appendChild(deleteButton);
    cartItems.appendChild(item);

    updateTotal();
    updateCartCounter();
    hideNotificationIfNeeded();
}

// Nueva función para confirmar y eliminar un producto del carrito
function confirmAndDeleteItem(item) {
    const confirmed = confirm("¿Estás seguro de que deseas eliminar este producto del carrito?");
    if (confirmed) {
        cartItems.removeChild(item);
        updateTotal();
        updateCartCounter();
        hideNotificationIfNeeded();
    }
}

// Función para vaciar el carrito
function clearCart() {
    const confirmed = confirm("¿Estás seguro de que deseas vaciar el carrito?");
    if (confirmed) {
        cartItems.innerHTML = "";
        updateTotal();
        updateCartCounter();
        hideNotification();
    }
}

// Función para mostrar la notificación
function showNotification() {
    notification.classList.add("show");
}

// Función para ocultar la notificación
function hideNotification() {
    notification.classList.remove("show");
}

// Función para ocultar la notificación si el número de productos es menor que el máximo
function hideNotificationIfNeeded() {
    if (cartItems.children.length < maxItems) {
        hideNotification();
    }
}

// Función para actualizar el total
function updateTotal() {
    let total = 0;

    Array.from(cartItems.children).forEach(item => {
        const price = parseFloat(item.getAttribute("data-price"));
        total += price;
    });

    const iva = total * ivaPercentage;
    const totalConIva = total + iva;

    totalPriceDisplay.innerHTML = `
        IVA: $${iva.toFixed(2)}<br>
        Total sin IVA: $${total.toFixed(2)}<br>
        Total con IVA (21%): $${totalConIva.toFixed(2)}
    `;
}

// Función para actualizar el contador del carrito
function updateCartCounter() {
    const cartCounter = document.getElementById("cart-counter");
    cartCounter.textContent = cartItems.children.length;
}

// Función para filtrar productos según la búsqueda
function searchProducts() {
    const query = document.getElementById("search-input").value.toLowerCase();
    const filteredProducts = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(query)
    );

    generateProductCards(filteredProducts);
}

// Generar las tarjetas al cargar la página
generateProductCards();
