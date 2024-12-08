

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const usernameInput = document.getElementById('username');
    const saveUsernameButton = document.getElementById('save-username');
    const userSelect = document.getElementById('user-select');
    const greeting = document.getElementById('greeting');
    const errorContainer = document.getElementById('error-container');

    const users = JSON.parse(localStorage.getItem('users')) || {};

    const updateUserSelect = () => {
        userSelect.innerHTML = '<option value="" disabled selected>Selecciona un usuario</option>';
        Object.keys(users).forEach((username) => {
            const option = document.createElement('option');
            option.value = username;
            option.textContent = username;
            userSelect.appendChild(option);
        });
    };

    updateUserSelect();

    const applyTheme = (theme) => {
        document.body.className = theme || 'light-mode';
    };

    const showError = (message) => {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
        setTimeout(() => (errorContainer.style.display = 'none'), 3000);
    };

    saveUsernameButton.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        username
            ? (users[username] = users[username] || { theme: 'light-mode' },
                localStorage.setItem('users', JSON.stringify(users)),
                greeting.textContent = `¡Bienvenido, ${username}!`,
                updateUserSelect(),
                (usernameInput.value = ''))
            : showError('Por favor, ingresa un nombre válido.');
    });

    userSelect.addEventListener('change', () => {
        const selectedUser = userSelect.value;
        if (selectedUser) {
            const { theme } = users[selectedUser];
            greeting.textContent = `¡Bienvenido, ${selectedUser}!`;
            applyTheme(theme);
        }
    });

    themeToggle.addEventListener('click', () => {
        const selectedUser = userSelect.value;
        selectedUser
            ? (() => {
                const currentTheme = users[selectedUser].theme;
                const newTheme = currentTheme === 'dark-mode' ? 'light-mode' : 'dark-mode';
                users[selectedUser].theme = newTheme;
                localStorage.setItem('users', JSON.stringify(users));
                applyTheme(newTheme);
            })()
            : showError('Selecciona un usuario para cambiar el tema.');
    });
});




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

const maxItems = 20; 
const ivaPercentage = 0.21; 


let productos = [
    new Producto(1, "Compu 1", 10.00, "https://via.placeholder.com/150"),
    new Producto(2, "Producto 2", 15.00, "https://via.placeholder.com/150"),
    new Producto(3, "Producto 3", 20.00, "https://via.placeholder.com/150"),
    new Producto(4, "Producto 4", 30.00, "https://via.placeholder.com/150"),
    new Producto(5, "Producto 5", 30.00, "https://via.placeholder.com/150"),
    new Producto(6, "Producto 6", 30.00, "https://via.placeholder.com/150")
];


function generateProductCards(filteredProducts = productos) {
    productList.innerHTML = ''; 

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


function addToCart(id, name, price) {
    if (cartItems.children.length >= maxItems) {
        showNotification();
        return; 
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


function confirmAndDeleteItem(item) {
    const confirmed = confirm("¿Estás seguro de que deseas eliminar este producto del carrito?");
    if (confirmed) {
        cartItems.removeChild(item);
        updateTotal();
        updateCartCounter();
        hideNotificationIfNeeded();
    }
}

function clearCart() {
    const confirmed = confirm("¿Estás seguro de que deseas vaciar el carrito?");
    if (confirmed) {
        cartItems.innerHTML = "";
        updateTotal();
        updateCartCounter();
        hideNotification();
    }
}


function showNotification() {
    notification.classList.add("show");
}


function hideNotification() {
    notification.classList.remove("show");
}


function hideNotificationIfNeeded() {
    if (cartItems.children.length < maxItems) {
        hideNotification();
    }
}


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


function updateCartCounter() {
    const cartCounter = document.getElementById("cart-counter");
    cartCounter.textContent = cartItems.children.length;
}


function searchProducts() {
    const query = document.getElementById("search-input").value.toLowerCase();
    const filteredProducts = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(query)
    );

    generateProductCards(filteredProducts);
}


generateProductCards();
