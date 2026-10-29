const products = [
    { name: 'Red Apples', price: 3.50, unit: '1 kg bag' },
    { name: 'Fresh Bread', price: 2.00, unit: '1 loaf' },
    { name: 'Whole Milk', price: 2.50, unit: '1 liter' },
    { name: 'Farm Eggs', price: 3.00, unit: '6 pieces' },
    { name: 'Bananas', price: 1.50, unit: '1 kg' },
    { name: 'Mineral Water', price: 1.00, unit: '1.5 liters' }
];

const productList = document.querySelector('.product-list');

function renderProducts() {
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const card = document.createElement('article');
        card.className = 'product-card';
        card.innerHTML = `
            <h3>${product.name}</h3>
            <p class="unit">${product.unit}</p>
            <div class="product-bottom">
                <strong>$${product.price.toFixed(2)}</strong>
                <button class="add-button">+ Add</button>
            </div>`;

        card.querySelector('.add-button').addEventListener('click', function () {
            addProduct(i);
        });

        productList.appendChild(card);
    }
}

renderProducts();

let order = [];
let orderNumber = 1;

const orderItems = document.querySelector('.order-items');
const payButton = document.querySelector('.pay-button');
const clearButton = document.querySelector('.clear-button');
const receiptDialog = document.querySelector('#receipt-dialog');
const receipt = document.querySelector('#receipt-details');

function renderOrder() {
    orderItems.innerHTML = '';
    let itemCount = 0;
    let total = 0;

    for (let i = 0; i < order.length; i++) {
        const item = order[i];
        itemCount += item.quantity;
        total += item.price * item.quantity;

        const row = document.createElement('article');
        row.className = 'order-item';
        row.innerHTML = `
            <div class="item-heading">
                <div><h3>${item.name}</h3><p>$${item.price.toFixed(2)} each</p></div>
                <button class="remove-button">Remove</button>
            </div>
            <div class="item-bottom">
                <div class="quantity">
                    <button class="decrease">−</button>
                    <span>${item.quantity}</span>
                    <button class="increase">+</button>
                </div>
                <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
            </div>`;

        row.querySelector('.decrease').addEventListener('click', function () {
            changeQuantity(i, -1);
        });
        row.querySelector('.increase').addEventListener('click', function () {
            changeQuantity(i, 1);
        });
        row.querySelector('.remove-button').addEventListener('click', function () {
            order.splice(i, 1);
            renderOrder();
        });

        orderItems.appendChild(row);
    }

    if (order.length === 0) {
        orderItems.innerHTML = '<p class="empty-order">No items</p>';
    }

    document.querySelector('#item-count').textContent = itemCount;
    document.querySelector('#subtotal').textContent = '$' + total.toFixed(2);
    document.querySelector('#total').textContent = '$' + total.toFixed(2);
    document.querySelector('.order-heading .count').textContent = '#' + orderNumber;
    payButton.disabled = order.length === 0;
    clearButton.disabled = order.length === 0;
}

function addProduct(index) {
    const product = products[index];

    for (let i = 0; i < order.length; i++) {
        if (order[i].name === product.name) {
            order[i].quantity++;
            renderOrder();
            return;
        }
    }

    order.push({ name: product.name, price: product.price, quantity: 1 });
    renderOrder();
}

function changeQuantity(index, amount) {
    order[index].quantity += amount;

    if (order[index].quantity === 0) {
        order.splice(index, 1);
    }

    renderOrder();
}

function completeSale() {
    if (order.length === 0) return;

    receipt.innerHTML = '<p>Order #' + orderNumber + '</p>';
    let total = 0;

    for (let i = 0; i < order.length; i++) {
        const item = order[i];
        total += item.price * item.quantity;
        receipt.innerHTML += `<p class="summary-row">${item.name} × ${item.quantity} — $${(item.price * item.quantity).toFixed(2)}</p>`;
    }

    receipt.innerHTML += '<p class="total-row">Total: $' + total.toFixed(2) + '</p>';
    receiptDialog.showModal();
    order = [];
    orderNumber++;
    renderOrder();
}

clearButton.addEventListener('click', function () {
    order = [];
    renderOrder();
});

payButton.addEventListener('click', completeSale);

renderOrder();
