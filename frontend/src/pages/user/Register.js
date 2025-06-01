import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/user/Register.css";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();

        // Simpan user ke localStorage (dummy)
        const userData = { name, email, password, role: "user" };
        localStorage.setItem("user", JSON.stringify(userData));
        alert("Registrasi berhasil! Silakan login.");
        navigate("/login");
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <h2 className="register-title">Register</h2>
                <form className="register-form" onSubmit={handleRegister}>
                    <label>Full Name</label>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
