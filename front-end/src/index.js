import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import Error404Screen from "./screens/Error404Screen";
import { parseRequestUrl } from "./utils";
import CartScreen from "./screens/CartScreen";

const routes = {
  "/": HomeScreen,
  "/product/:id": ProductScreen,
  "/cart": CartScreen,
  "/cart/:id": CartScreen,
};

const router = async () => {
  const request = parseRequestUrl();
  const parseUrl =
    (request.resource ? `/${request.resource}` : "/") +
    (request.id ? "/:id" : "") +
    (request.verb ? `/${request.verb}` : "");
  const screen = routes[parseUrl] ? routes[parseUrl] : Error404Screen;
  const main = document.querySelector("#main-container");
  main.innerHTML = await screen.render();
  await screen.after_render();
};
window.addEventListener("load", router);
window.addEventListener("hashchange", router);
