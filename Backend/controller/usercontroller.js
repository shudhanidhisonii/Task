import User from "../model/usermodel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// ✅ Signup Controller with strong password validation
export const signup = async (req, res) => {
  try {
    const { fullname, email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Strong password regex
    const passwordRegex =
      /^(?=[A-Za-z])(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must start with a letter, be at least 8 characters, and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create user
    const createdUser = new User({
      fullname,
      email,
      password: hashPassword,
    });
    await createdUser.save();

    // JWT with _id
    const token = jwt.sign(
      { _id: createdUser._id, email: createdUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    // Set cookie
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   sameSite: "lax",
    //   secure: false, // false for localhost
    //   maxAge: 10 * 60 * 60 * 1000, // 10 hours
    // });
res.cookie("token", token, {
  httpOnly: true,
  secure: true,        // ✅ only send over HTTPS
  sameSite: "none",    // ✅ required for cross-site (Netlify ↔ Render)
  maxAge: 10 * 60 * 60 * 1000,
});

    console.log("Signup Token:", token);

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: createdUser._id,
        fullname: createdUser.fullname,
        email: createdUser.email,
      },
    });
  } catch (e) {
    console.log("Error: " + e.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // JWT with _id
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    //  Set cookie
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   sameSite: "lax",
    //   secure: false, // false for localhost
    //   maxAge: 10 * 60 * 60 * 1000,
    // });
res.cookie("token", token, {
  httpOnly: true,
  secure: true,        // ✅ only send over HTTPS
  sameSite: "none",    // ✅ required for cross-site (Netlify ↔ Render)
  maxAge: 10 * 60 * 60 * 1000,
});


    console.log("Login Token:", token);

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (e) {
    console.log("Error: " + e.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  Verify Token
export const verifyToken = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "No token, unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ valid: false, message: "Invalid token" });
  }
};
