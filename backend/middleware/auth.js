const jwt = require("jsonwebtoken");

/**
 * Verifies the JWT sent in the Authorization header (Bearer token).
 * Attaches the decoded payload ({ id, name, role }) to req.user.
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, name, role }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

/**
 * Restricts a route to one or more roles.
 * Usage: requireRole("admin") or requireRole("admin", "doctor")
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Access denied for this role" });
    }
    next();
  };
}

module.exports = { verifyToken, requireRole };
