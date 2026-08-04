const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function adminLoginController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

if (!email || !password) {
  return res.status(400).json({
    message: "Email and password are required",
  });
}  
  if (!user) {
    return res.status(401).json({
      message: "Email or password is invalid",
    });
  }

  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) {
    return res.status(401).json({
      message: "Email or password is invalid",
    });

  }
if (user.status !== "ACTIVE") {
  return res.status(403).json({
    message: "Your account has been disabled.",
  });
}
  if (
    user.role !== "ADMIN" &&
    user.role !== "SUPER_ADMIN" &&
    user.role !== "CASHIER"
  ) {
    return res.status(403).json({
      message: "Access denied",
    });
  }

  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    }
  );

  res.cookie("token", token);

return res.status(200).json({
  success: true,
  message: "Login successful",
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  },
  token,
});
}

async function adminMeController(req, res) {
  return res.status(200).json({
    user: req.user,
  });
}

async function adminLogoutController(req, res) {
  try {

    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // production me true
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Admin logged out successfully",
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error during logout",
    });

  }
}

module.exports = {
  adminLoginController,
  adminMeController,
  adminLogoutController
};