class Producto {
    constructor(id, nombre, precio, imagenUrl) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.imagenUrl = imagenUrl;
    }
}

const productos = [
    new Producto(1, "tester", 10.0, "asset/productos/Tester.jpg"),
    new Producto(2, "tester2", 15.0, "asset/productos/tester2.jpg"),
    new Producto(3, "Producto 3", 20.0, "https://via.placeholder.com/150"),
    new Producto(4, "Producto 4", 30.0, "https://via.placeholder.com/150"),
    new Producto(5, "Producto 5", 30.0, "https://via.placeholder.com/150"),
    new Producto(6, "Producto 6", 30.0, "https://via.placeholder.com/150"),
    new Producto(7, "Producto 7", 300.0, "https://via.placeholder.com/150"),
];

const cartItems = document.getElementById("cart-items");
const notification = document.getElementById("notification");
const totalsDisplay = document.getElementById("totals");
const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search-input");
const maxItems = 20; 
const IVA_RATE = 1.21; 

// Genera las tarjetas de productos filtrados o todos si no hay filtro
const generateProductCards = (filteredProducts = productos) => {
    productList.innerHTML = ""; 
    filteredProducts.forEach((producto) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
            <img src="${producto.imagenUrl}" alt="${producto.nombre}">
            <h2>${producto.nombre}</h2>
            <p>$${producto.precio.toFixed(2)}</p>
            <button onclick="addToCart(${producto.id})">Añadir al carrito</button>
        `;
        productList.appendChild(productCard);
    });
};

// Filtra los productos según el nombre
const filterProducts = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredProducts = productos.filter((producto) => 
        producto.nombre.toLowerCase().includes(searchTerm)
    );
    generateProductCards(filteredProducts); // Genera las tarjetas de productos filtrados
};

// Agregar un producto al carrito
const addToCart = (id) => {
    if (cartItems.children.length >= maxItems) {
        showNotification("Has alcanzado el límite de productos en el carrito.", "error");
        return;
    }

    const productoEncontrado = productos.find((producto) => producto.id === id);
    if (!productoEncontrado) {
        console.warn(`Producto con ID ${id} no encontrado.`);
        return;
    }

    const itemExiste = Array.from(cartItems.children).some(
        (item) => parseInt(item.getAttribute("data-id")) === id
    );

    if (itemExiste) {
        showNotification("Este producto ya está en el carrito.", "warning");
    }

    const item = document.createElement("li");
    item.classList.add("cart-item");
    item.setAttribute("data-id", productoEncontrado.id);
    item.setAttribute("data-price", productoEncontrado.precio);

    const itemContent = document.createElement("span");
    itemContent.textContent = `${productoEncontrado.nombre} - $${productoEncontrado.precio}`;
    item.appendChild(itemContent);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteButton.onclick = () => {
        cartItems.removeChild(item);
        updateTotal();
    };

    item.appendChild(deleteButton);
    cartItems.appendChild(item);
    updateTotal();
};

// Vaciar el carrito
const clearCart = () => {
    cartItems.innerHTML = "";
    updateTotal();
    hideNotification();
};

// Mostrar notificación
const showNotification = (mensaje, tipo = "success") => {
    notification.textContent = mensaje;
    notification.className = `notification ${tipo} show`;
    setTimeout(hideNotification, 3000);
};

// Ocultar notificación
const hideNotification = () => {
    notification.classList.remove("show");
};

// Actualizar total del carrito
const updateTotal = () => {
    const totalSinIva = Array.from(cartItems.children)
        .map((item) => parseFloat(item.getAttribute("data-price")))
        .reduce((acum, precio) => acum + precio, 0);

    const iva = totalSinIva * (IVA_RATE - 1);
    const totalConIva = totalSinIva * IVA_RATE;

    totalsDisplay.innerHTML = `
        <p>Total sin IVA: $${totalSinIva.toFixed(2)}</p>
        <p>IVA (21%): $${iva.toFixed(2)}</p>
        <p>Total con IVA: $${totalConIva.toFixed(2)}</p>
    `;
};

// Inicializar productos
generateProductCards();

// Escuchar eventos del campo de búsqueda
search
