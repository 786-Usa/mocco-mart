import Router from 'express';
import { favouriteProduct, getWishlist, removeFromWishlist, updateWishlist } from '../controllers/wishlistController.js';
const wishlistRouter = Router();
wishlistRouter.get('/:userId', getWishlist);
wishlistRouter.post('/', favouriteProduct);
wishlistRouter.put('/:id', updateWishlist);
wishlistRouter.delete('/:id', removeFromWishlist);
export default wishlistRouter;