import { Router } from "express";
import { addToCart } from "../controllers/cartController";

const cartRouter = Router();

cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.get("/", authMiddleware, getCartItems);
cartRouter.put("/update/:productId", authMiddleware, updateCartItem);
cartRouter.delete("/remove/:productId", authMiddleware, removeFromCart);


export default cartRouter;