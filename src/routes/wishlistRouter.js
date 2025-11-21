import Router from "express";
import {
  favouriteProduct,
  getWishlist,
  removeFromWishlist,
  updateWishlist,
} from "../controllers/wishlistController.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const wishlistRouter = Router();
wishlistRouter.get("/:userId",authMiddleware, getWishlist);
wishlistRouter.post("/",authMiddleware, favouriteProduct);
wishlistRouter.put("/:id",authMiddleware, updateWishlist);
wishlistRouter.delete("/:id",authMiddleware, removeFromWishlist);
export default wishlistRouter;
