import { auth } from "../configs/firebase.js";

export const authFirebase = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // return res.status(401).json({ message: "Need auth Token" });
    const err = new Error("Need auth Token");
    err.status = false;
    err.statusCode = 401;
    next(err)
  }

  const token = authHeader.split(" ")[1]; // Ambil token setelah "Bearer"const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    // return res.status(401).json({ message: "Authorization token required" });
    const err = new Error("No token provided");
    err.status = false;
    err.statusCode = 401;
    next(err)
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken; // Menyimpan data user ke req
    next();
  } catch (error) {
    // return res.status(401).json({ message: "Invalid or expired token" });
    const err = new Error("Invalid or expired token");
    err.status = false;
    err.statusCode = 401;
    err.errors = error;
    next(err)
  }
};
