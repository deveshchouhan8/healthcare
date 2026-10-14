
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies?.patientToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please login first.",
    });
  }

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.patient = decoded;
    next();
  } 
  catch(error){
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
};

module.exports = authMiddleware;
