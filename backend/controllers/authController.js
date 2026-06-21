const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");

function signToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

/**
 * POST /api/auth/register
 * body: { name, email, password, role, phone?, age?, gender?, blood_group?, address?, specialization?, department?, experience? }
 */
async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "name, email, password and role are required" });
    }

    if (!["patient", "doctor", "admin", "reception"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: user, error } = await supabase
      .from("users")
      .insert({ name, email, password: hashedPassword, role })
      .select()
      .single();

    if (error) throw error;

    // Create role-specific profile row
    if (role === "patient") {
      const { phone, age, gender, blood_group, address } = req.body;
      await supabase.from("patients").insert({
        user_id: user.id,
        phone: phone || null,
        age: age || null,
        gender: gender || null,
        blood_group: blood_group || null,
        address: address || null,
      });
    } else if (role === "doctor") {
      const { specialization, department, experience, phone } = req.body;
      await supabase.from("doctors").insert({
        user_id: user.id,
        specialization: specialization || null,
        department: department || null,
        experience: experience || null,
        phone: phone || null,
      });
    }

    const token = signToken(user);

    res.status(201).json({
      success: true,
      message: "Registered successfully",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * body: { email, password }
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "email and password are required" });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) throw error;
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = signToken(user);

    res.json({
      success: true,
      message: "Logged in successfully",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me  (requires verifyToken)
 */
async function getMe(req, res, next) {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, role, created_at")
      .eq("id", req.user.id)
      .maybeSingle();

    if (error) throw error;
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, getMe };
