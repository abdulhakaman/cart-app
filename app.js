// ---------- 1. FUNCTIONS ----------
const formatPrice = (amount) => `$${amount.toFixed(2)}`;

function getCartTotal(cart) {
  let cost = 0;
  for (const item of cart) {
    cost += item.price * item.quantity;
  }
  return cost;
}

function getDiscount(total) {
  if (total >= 100) {
    return 15;
  } else if (total >= 50) {
    return 10;
  } else {
    return 0;
  }
}

function calculateTotal(price, discountPercent = 0, taxPercent = 0) {
  const discountedPrice = price - price * (discountPercent / 100);
  return discountedPrice + discountedPrice * (taxPercent / 100);
}

// ---------- 2. SAVING AND LOADING ----------
const STORAGE_KEY = "myCart";

function saveCart() {
  // localStorage only stores text, so turn the array into text first
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function loadCart() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === null) {
    // first visit: nothing saved yet, so use a starting cart
    return [
      { name: "Apple", price: 15.5, quantity: 3 },
      { name: "Banana", price: 2.0, quantity: 2 },
      { name: "Orange", price: 19.0, quantity: 5 },
    ];
  }
  return JSON.parse(saved);   // turn the saved text back into an array
}

// ---------- 3. DATA ----------
const cart = loadCart();

// ---------- 4. PAGE ELEMENTS ----------
const nameInput = document.getElementById("nameInput");
const priceInput = document.getElementById("priceInput");
const quantityInput = document.getElementById("quantityInput");
const addButton = document.getElementById("addButton");
const message = document.getElementById("message");
const cartList = document.getElementById("cartList");
const totalText = document.getElementById("totalText");
const discountText = document.getElementById("discountText");
const finalText = document.getElementById("finalText");

// ---------- 5. DRAW THE PAGE FROM THE DATA ----------
function render() {
  cartList.innerHTML = "";

  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];

    const li = document.createElement("li");
    li.textContent = `${item.name} x${item.quantity}: ${formatPrice(item.price * item.quantity)} `;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      cart.splice(i, 1);
      saveCart();    // save after the data changes
      render();
    });

    li.appendChild(removeButton);
    cartList.appendChild(li);
  }

  const cartTotal = getCartTotal(cart);
  const discountPercent = getDiscount(cartTotal);
  const finalPrice = calculateTotal(cartTotal, discountPercent, 8);

  totalText.textContent = `Cart total: ${formatPrice(cartTotal)}`;
  discountText.textContent = `Discount: ${discountPercent}%`;
  finalText.textContent = `Total cost (with 8% tax): ${formatPrice(finalPrice)}`;
}

// ---------- 6. ADD AN ITEM ----------
addButton.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const price = Number(priceInput.value);
  const quantity = Number(quantityInput.value);

  if (name === "" || price <= 0 || quantity <= 0) {
    message.textContent = "Please enter a name, a price and a quantity above 0.";
    return;
  }

  cart.push({ name: name, price: price, quantity: quantity });
  saveCart();        // save after the data changes
  message.textContent = "";
  nameInput.value = "";
  priceInput.value = "";
  quantityInput.value = "";

  render();
});

render();   // draw the cart when the page loads