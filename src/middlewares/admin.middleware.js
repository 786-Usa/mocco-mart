const adminMiddleware = (req, res, next) => {

const user = req.user.role;
console.log("Admin Middleware - User Role:", user); // Debugging line
if (user && user === "admin") {
  next();
} else {
  return res.status(403).json({ message: "Admin access required" });
}

};

export default adminMiddleware;