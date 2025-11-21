import Wishlist from '../models/wishlist.model.js';
const favouriteProduct = async (req, res) => {
    // Implementation for adding a product to wishlist
    const { userId, productId } = req.body;
    try {
        if (!userId || !productId) {
            return res.status(400).json({ message: "User ID and Product ID are required" });
        }
        // Assuming Wishlist is a model that has userId and productId fields
        const newWishlistItem = new Wishlist({ userId, productId });
        if (!newWishlistItem) {
            return res.status(400).json({ message: "Could not create wishlist item" });
        }
        await newWishlistItem.save();
        res.status(201).json({ message: "Product added to wishlist", wishlistItem: newWishlistItem });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
const updateWishlist = async (req, res) => {
    // Implementation for updating a wishlist item
    const { id } = req.params;
    const { userId, productId } = req.body;
    try {
        if (!id) {
            return res.status(400).json({ message: "Wishlist item ID is required" });
        }
        if (!userId || !productId) {
            return res.status(400).json({ message: "User ID and Product ID are required" });
        }
        const updatedWishlistItem = await Wishlist.findByIdAndUpdate(
            id,
            { userId, productId },
            { new: true }
        );
        if (!updatedWishlistItem) {
            return res.status(404).json({ message: "Wishlist item not found" });
        }
        res.status(200).json({ message: "Wishlist item updated successfully", wishlistItem: updatedWishlistItem });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
const removeFromWishlist = async (req, res) => {
    // Implementation for removing a product from wishlist
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({ message: "Wishlist item ID is required" });
        }
        const deletedWishlistItem = await Wishlist.findByIdAndDelete(id);
        if (!deletedWishlistItem) {
            return res.status(404).json({ message: "Wishlist item not found" });
        }
        res.status(200).json({ message: "Wishlist item removed successfully", wishlistItem: deletedWishlistItem });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const getWishlist = async (req, res) => {
    // Implementation for retrieving a user's wishlist
    const { userId } = req.params;
    try {
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const wishlist = await Wishlist.find({ userId });
        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }
        res.status(200).json({ message: "Wishlist fetched successfully", wishlist });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export { favouriteProduct, updateWishlist, removeFromWishlist, getWishlist };