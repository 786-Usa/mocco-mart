import { Cart } from "../models/cart.model.js";

const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    if (!productId || !quantity) {
        return res.status(400).json({ message: "Product ID and quantity are required" });
    }

    try {
        const cartItem = await Cart.findOne({ userId, productId });

        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            await Cart.create({ userId, productId, quantity });
        }

        res.status(201).json({ message: "Product added to cart successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


const getCartItems = async (req, res) => {
    const userId = req.user._id;

    try {
        const cartItems = await Cart.find({ userId }).populate("productId");

        res.status(200).json({
            message: "Cart items fetched successfully",
            cartItems
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


const updateCartItem = async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
        return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    try {
        const cartItem = await Cart.findOne({ userId, productId });

        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.status(200).json({ message: "Cart updated successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


const removeFromCart = async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;

    try {
        const result = await Cart.findOneAndDelete({ userId, productId });

        if (!result) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        res.status(200).json({ message: "Product removed from cart successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


export { addToCart, getCartItems, updateCartItem, removeFromCart };
