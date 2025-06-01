import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth/Login.css";
import { useDispatch, useSelector } from "react-redux";
import { LoginUser, reset } from "../../features/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (user || isSuccess) {
      navigate("/admin/dashboard");
    }
    dispatch(reset());
  }, [user, isSuccess, dispatch, navigate]);

  const Auth = (e) => {
    e.preventDefault();
    dispatch(LoginUser({ email, password }));
  };

  // const handleLogin = (e) => {
  //     e.preventDefault();

  //     // Dummy: contoh login simulasi role
  //     // Di project nyata, fetch dari API
  //     if (email === "admin@example.com" && password === "admin123") {
  //         localStorage.setItem("role", "admin");
  //         navigate("/admin/dashboard");
  //     } else if (email === "user@example.com" && password === "user123") {
  //         localStorage.setItem("role", "user");
  //         navigate("/");
  //     } else {
  //         alert("Email atau password salah");
  //     }
  // };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={Auth}>
          <label>Email address</label>
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

          <button type="submit">{isLoading ? "Loading..." : "Login"}</button>
          <a href="#" className="forgot-password">
            Forgot password?
          </a>
        </form>
      </div>
      <div className="logo">🌿 GreenHope</div>
    </div>
  );
};

export default Login;
