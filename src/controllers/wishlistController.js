import Wishlist from "../models/wishlist.model.js";
const favouriteProduct = async (req, res) => {
  const userId = req.user._id;
  // Implementation for adding a product to wishlist
  const { productId } = req.params;
  try {
    if (!userId || !productId) {
      return res
        .status(400)
        .json({ message: "User ID and Product ID are required" });
    }
    // Assuming Wishlist is a model that has userId and productId fields
    const existingWishlistItem = await Wishlist.findOne({ user: userId });
    if (existingWishlistItem) {
      // Product already exists in wishlist
      if (existingWishlistItem.products.includes(productId)) {
        return res
          .status(400)
          .json({ message: "Product already exists in wishlist" });
      }
      existingWishlistItem.products.push(productId);
      await existingWishlistItem.save();
      return res.status(200).json({
        message: "Product added to wishlist",
        wishlistItem: existingWishlistItem,
      });
    }

    const newWishlistItem = new Wishlist({
      user: userId,
      products: [productId],
    });
    if (!newWishlistItem) {
      return res
        .status(400)
        .json({ message: "Could not create wishlist item" });
    }
    await newWishlistItem.save();
    res.status(201).json({
      message: "Product added to wishlist",
      wishlistItem: newWishlistItem,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
const removeFromWishlist = async (req, res) => {
  // Implementation for removing a product from wishlist
  const userId = req.user._id;
  const { productId } = req.params;
  try {
    if (!userId || !productId) {
      return res
        .status(400)
        .json({ message: " User ID and Product ID are required" });
    }
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }
    if (!wishlist.products.includes(productId)) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }
    wishlist.products.pull(productId);
    await wishlist.save();

    // If no products left → delete wishlist
    if (wishlist.products.length === 0) {
      await Wishlist.deleteOne({ user: userId });
      return res.status(200).json({
        message: "Product removed and empty wishlist deleted",
      });
    }
    res.status(200).json({
      message: "Product removed from wishlist",
      products: wishlist.products,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getWishlist = async (req, res) => {
  // Implementation for retrieving a user's wishlist
  const userId = req.user._id;
  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const wishlist = await Wishlist.find({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
    res
      .status(200)
      .json({ message: "Wishlist fetched successfully", wishlist });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { favouriteProduct, removeFromWishlist, getWishlist };
