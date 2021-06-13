/* eslint-disable no-use-before-define */
import { getProduct } from "../api";
import { getCartItems, setCartItems } from "../localStorage";
import { parseRequestUrl, reRender } from "../utils";

const addToCart = (item, forceUpdate = false) => {
  console.log(item, forceUpdate);
  let cartItems = getCartItems();
  const existItem = cartItems.find((x) => x.product === item.product);
  if (existItem) {
    if (forceUpdate) {
      cartItems = cartItems.map((x) =>
        x.product === existItem.product ? item : x
      );
    }
  } else {
    cartItems = [...cartItems, item];
  }
  setCartItems(cartItems);
  if (forceUpdate) {
    reRender(CartScreen);
  }
};

const removeFromCart = (id) => {
  setCartItems(getCartItems().filter((el) => el.product !== id));
  if (id === parseRequestUrl().id) {
    document.location.hash = "/cart";
  } else {
    reRender(CartScreen);
  }
};
const CartScreen = {
  after_render: () => {
    const qtySelects = document.querySelectorAll(".qty-select");
    Array.from(qtySelects).forEach((qtySelect) => {
      qtySelect.addEventListener("change", (e) => {
        const item = getCartItems().find((x) => x.product === qtySelect.id);
        addToCart({ ...item, qty: Number(e.target.value) }, true);
      });
    });
    const deleteButtons = document.querySelectorAll(".delete-button");
    Array.from(deleteButtons).forEach((deleteButton) => {
      deleteButton.addEventListener("click", () => {
        removeFromCart(deleteButton.id);
      });
    });
    document.querySelector("#checkout-button").addEventListener("click", () => {
      document.location.hash = "/signin";
    });
  },
  render: async () => {
    const request = parseRequestUrl();
    if (request.id) {
      const product = await getProduct(request.id);
      addToCart({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty: 1,
      });
    }
    const cartItems = getCartItems();
    return `
    <div class=" content cart">
      <div class="cart-list">
        <ul class="cart-list-container">
          <li>
            <h3>Shopping Cart</h3>
            <div>Price</div>
          </li>
            ${
              cartItems.length === 0
                ? '<div>Cart is empty. <a href="/#/">Go Shopping</a></div>'
                : cartItems
                    .map(
                      (item) => `
              <li>
                <div class="cart-image"> 
                  <img src="${item.image}" alt="${item.name}"/> 
                </div>
                <div class="cart-name">
                  <div>
                    <a href="/#/product/${item.product}">${item.name}</a>
                  </div>
                  <div>
                    Qty: 
                      <select class="qty-select" id="${item.product}">
                        ${[...Array(item.countInStock).keys()].map((el) =>
                          item.qty === el + 1
                            ? `<option selected value="${el + 1}">${
                                el + 1
                              }</option>`
                            : `<option value="${el + 1}">${el + 1}</option>`
                        )}
                      </select>
                      <button type="button" class="delete-button" id="${
                        item.product
                      }">
                        Delete
                      </button>
                  </div>
                </div>
                <div class="cart-price">
                  $${item.price}
                </div>
              </li>
              `
                    )
                    .join("\n")
            }
        </ul>
      </div>
      <div class="cart-action"> 
            <h3>
              Subtotal (${cartItems.reduce((a, c) => a + c.qty, 0)} items)
              :
              $${cartItems.reduce((a, c) => a + c.price * c.qty, 0)}
            </h3>
            <button id="checkout-button" class="primary fw">
              Proceed to Checkout
            </button>
      </div>
    </div>
    `;
  },
};

export default CartScreen;
