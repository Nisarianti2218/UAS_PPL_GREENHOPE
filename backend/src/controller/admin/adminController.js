import { User, Token } from "../../models/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validateEnv from "../../utils/validateEnv.js";
import { Types } from "mongoose";

const env = validateEnv();
const JWT_SECRET = env.JWT_SECRET;

export const Auth = {
  me: async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await User.findById(userId).select(
        "name username email role profilePath"
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        res.status(400).json({ message: "Email dan Password wajib diisi" });
        return;
      }
      const user = await User.findOne({ email });
      if (!user || user.role !== "admin") {
        res.status(404).json({ message: "Pengguna tidak ditemukan" });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(406).json({ message: "Kombinasi email dan password salah" });
        return;
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: "2h" }
      );

      const now = new Date();
      const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now

      const createToken = new Token({
        userId: user._id,
        token,
        expiresAt,
      });
      await createToken.save();

      // Set token in response header
      req.session.userId = user._id;

      return res.status(200).json({
        message: "Login berhasil",
        user: {
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
          profilePath: user.profilePath,
          api_token: token,
        },
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  },

  logout: async (req, res, next) => {
    const userId = req.session.userId;

    try {
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Pengguna tidak ditemukan" });
      }

      // Hapus token dari database
      await Token.deleteMany({ userId: userId });
      req.session.destroy((err) => {
        if (err) return res.status(400).json({ message: "Tidak dapat logout" });
        res.status(200).json({ message: "Logout berhasil" });
      });
    } catch (error) {
      console.error("Error during logout:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  },

  forgotPassword: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "User tidak ditemukan" });

      // generate token
      const token = crypto.randomBytes(20).toString("hex");
      const expiry = Date.now() + 1000 * 60 * 15; // 15 menit

      user.resetToken = token;
      user.resetTokenExpiry = expiry;
      await user.save();

      // kirim token ke email (sementara tampilkan di response)
      res.json({
        message: "Token reset berhasil dibuat",
        resetToken: token,
      });
    } catch (err) {
      console.error("Error during forgot password:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },
  resetPassword: async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
      const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() },
      });
      if (!user) {
        return res
          .status(400)
          .json({ message: "Token tidak valid atau sudah kedaluwarsa" });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiry = null;
      await user.save();

      res.status(200).json({ message: "Password berhasil direset" });
    } catch (err) {
      console.error("Error during reset password:", err);
      res
        .status(500)
        .json({ message: "Terjadi kesalahan pada server", error: err.message });
    }
  },
};
