import express from "express";
import cors from "cors";
const app = express();
import userRouter from "./routes/userRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import subCategoryRouter from "./routes/subCategoryRouter.js";
import productRouter from "./routes/productRouter.js";
import wishlistRouter from "./routes/wishlistRouter.js";
import cartRouter from "./routes/cartRouter.js";
import cookieParser from "cookie-parser";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/sub-categories", subCategoryRouter);
app.use("/api/products", productRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/cart", cartRouter);

export default app;
