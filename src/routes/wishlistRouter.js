import Router from "express";
import {
  favouriteProduct,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const wishlistRouter = Router();
wishlistRouter.get("/",authMiddleware, getWishlist);
wishlistRouter.post("/:productId",authMiddleware, favouriteProduct);
wishlistRouter.delete("/:productId",authMiddleware, removeFromWishlist);
export default wishlistRouter;
