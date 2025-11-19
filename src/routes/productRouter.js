import { Router } from "express";
import { createProduct, deleteProduct, getProducts, singleProduct, updateProduct } from "../controllers/productController.js";

const productRouter = Router();




productRouter.get("/", getProducts);
productRouter.post("/", createProduct);
productRouter.put("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);
productRouter.get("/:id", singleProduct);
export default productRouter;