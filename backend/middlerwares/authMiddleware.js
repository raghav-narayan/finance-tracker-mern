// backend/middleware/authMiddleware.js
import admin from "./firebaseAdmins.js";


export default (async (req, res, next) => {
    try {
        // Your token verification logic
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
});



