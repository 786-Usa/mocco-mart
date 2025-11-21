import { Router } from "express";
import { addToCart, getCartItems, removeFromCart, updateCartItem } from "../controllers/cartController.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const cartRouter = Router();

cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.get("/", authMiddleware, getCartItems);
cartRouter.put("/update/:productId", authMiddleware, updateCartItem);
cartRouter.delete("/remove/:productId", authMiddleware, removeFromCart);


export default cartRouter;