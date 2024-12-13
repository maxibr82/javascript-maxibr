document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const usernameInput = document.getElementById('username');
    const saveUsernameButton = document.getElementById('save-username');
    const userSelect = document.getElementById('user-select');
    const greeting = document.getElementById('greeting');
    const errorContainer = document.getElementById('error-container');
    const inputErrorContainer = document.createElement('div');

    inputErrorContainer.style.color = 'red';
    inputErrorContainer.style.fontSize = '0.9em';
    inputErrorContainer.style.display = 'none';
    usernameInput.parentNode.insertBefore(inputErrorContainer, usernameInput.nextSibling);

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

    const isValidUsername = (username) => /^[a-zA-Z]{1,13}$/.test(username); // Validación de 13 caracteres

    // Limitar el input a un máximo de 14 caracteres
    usernameInput.setAttribute('maxlength', '14');

    usernameInput.addEventListener('input', (event) => {
        const value = usernameInput.value;
        const sanitizedValue = value.replace(/[^a-zA-Z]/g, '');

        if (value !== sanitizedValue) {
            inputErrorContainer.textContent = 'Solo se permiten letras.';
            inputErrorContainer.style.display = 'block';
        } else if (sanitizedValue.length > 13) { // Limita a 13 caracteres
            usernameInput.value = sanitizedValue.slice(0, 14); // Limita a 14 caracteres
            inputErrorContainer.textContent = 'Máximo 13 caracteres.';
            inputErrorContainer.style.display = 'block';
        } else {
            inputErrorContainer.style.display = 'none';
        }

        usernameInput.value = sanitizedValue;
    });

    saveUsernameButton.addEventListener('click', () => {
        const username = usernameInput.value.trim();

        if (!isValidUsername(username)) {
            showError('El nombre de usuario debe contener solo letras y tener un máximo de 13 caracteres.');
            return;
        }

        if (users[username]) {
            showError('Este nombre de usuario ya está en uso. Elige otro.');
            return;
        }

        users[username] = users[username] || { theme: 'light-mode' };
        localStorage.setItem('users', JSON.stringify(users));
        greeting.textContent = `¡Bienvenido, ${username}!`;
        updateUserSelect();
        usernameInput.value = '';
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
        if (selectedUser) {
            const currentTheme = users[selectedUser].theme;
            const newTheme = currentTheme === 'dark-mode' ? 'light-mode' : 'dark-mode';
            users[selectedUser].theme = newTheme;
            localStorage.setItem('users', JSON.stringify(users));
            applyTheme(newTheme);
        } else {
            showError('Selecciona un usuario para cambiar el tema.');
        }
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
const totalPriceDisplay = document.getElementById("total-price");
const productList = document.getElementById("product-list");

const maxItems = 20;
const ivaPercentage = 0.21;

let productos = [];

async function fetchProductos() {
    try {
        const response = await fetch('productos.json');
        if (!response.ok) {
            throw new Error('Error al cargar los productos');
        }
        const data = await response.json();
        productos = data.map((producto) => new Producto(producto.id, producto.nombre, producto.precio, producto.imagenUrl));
        generateProductCards(); // Genera las tarjetas con los productos cargados
    } catch (error) {
        console.error(error);
        showNotification("No se pudieron cargar los productos.");
    }
}

// Genera las tarjetas de productos
function generateProductCards(filteredProducts = productos) {
    productList.innerHTML = '';

    filteredProducts.forEach((producto) => {
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

// Agrega productos al carrito
function addToCart(id, name, price) {
    if (cartItems.children.length >= maxItems) {
        showNotification("Has alcanzado el número máximo de artículos en el carrito.");
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

    Swal.fire({
        text: `Producto agregado: ${name} - $${price}`,
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        customClass: {
            popup: 'swal-popup'
        }
    });
}

// Confirma y elimina un producto del carrito
function confirmAndDeleteItem(item) {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Este producto será eliminado del carrito.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            cartItems.removeChild(item);
            updateTotal();
            updateCartCounter();
            Swal.fire("Eliminado", "El producto ha sido eliminado del carrito.", "success");
        }
    });
}

// Vacía el carrito
function clearCart() {
    if (cartItems.children.length === 0) {
        // Notificación para carrito vacío
        showNotification("El carrito ya está vacío.");
        return;
    }

    Swal.fire({
        title: "¿Estás seguro?",
        text: "Todo el contenido del carrito será eliminado.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, vaciar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            cartItems.innerHTML = "";
            updateTotal();
            updateCartCounter();
            Swal.fire("Carrito vacío", "El carrito ha sido vaciado con éxito.", "success");
        }
    });
}
// Actualiza el total del carrito
function updateTotal() {
    let total = 0;

    Array.from(cartItems.children).forEach((item) => {
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

// Actualiza el contador de productos en el carrito
function updateCartCounter() {
    const cartCounter = document.getElementById("cart-counter");
    cartCounter.textContent = cartItems.children.length;
}

// Busca productos por nombre
function searchProducts() {
    const query = document.getElementById("search-input").value.toLowerCase();
    const filteredProducts = productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(query)
    );

    if (filteredProducts.length === 0) {
        // Notificación de producto no encontrado
        showNotification("Productos no encontrados.");
    }

    generateProductCards(filteredProducts);
}


// Notificaciones
function showNotification(message) {
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#f44336"
    }).showToast();
}

// Llama a fetchProductos cuando la página esté lista
document.addEventListener('DOMContentLoaded', fetchProductos);



// Llamado en caso de límite de productos
function showCartLimitNotification() {
    showNotification("Has alcanzado el límite de 20 productos en el carrito.");
}
