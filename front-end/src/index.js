import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import Error404Screen from "./screens/Error404Screen";
import { hideLoading, parseRequestUrl, showLoading } from "./utils";
import CartScreen from "./screens/CartScreen";
import SigninScreen from "./screens/SigninScreen";
import Header from "../components/Header";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";

const routes = {
  "/": HomeScreen,
  "/product/:id": ProductScreen,
  "/cart": CartScreen,
  "/cart/:id": CartScreen,
  "/signin": SigninScreen,
  "/register": RegisterScreen,
  "/profile": ProfileScreen,
  "/shipping": ShippingScreen,
  "/payment": PaymentScreen,
  "/placeorder": PlaceOrderScreen,
};

const router = async () => {
  showLoading();
  const request = parseRequestUrl();
  const parseUrl =
    (request.resource ? `/${request.resource}` : "/") +
    (request.id ? "/:id" : "") +
    (request.verb ? `/${request.verb}` : "");
  const screen = routes[parseUrl] ? routes[parseUrl] : Error404Screen;
  const header = document.querySelector("#header-container");
  header.innerHTML = await Header.render();
  await Header.after_render();
  const main = document.querySelector("#main-container");
  main.innerHTML = await screen.render();
  if (screen.after_render) await screen.after_render();
  hideLoading();
};
window.addEventListener("load", router);
window.addEventListener("hashchange", router);
