import Fuse from "fuse.js";
import products from "../data/products.js";
const options = {
  keys: ["name", "description", "brand", "category"],
  threshold: 0.4,
  includeScore: true,
};
const fuse = new Fuse(products, options);
export default fuse;
