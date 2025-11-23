import React, { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

function Login({ onToggle }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Đăng nhập bằng: ${email}`);
  };

  return (
    <div className="form-container">
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email</label>
          <FiMail className="input-icon" />
          <input
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Mật khẩu</label>
          <FiLock className="input-icon" />
          <input
            type={showPass ? "text" : "password"}
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {showPass ? (
            <FiEyeOff
              className="eye-icon"
              onClick={() => setShowPass(false)}
            />
          ) : (
            <FiEye className="eye-icon" onClick={() => setShowPass(true)} />
          )}
        </div>

        <button type="submit">Đăng nhập</button>
      </form>

      <div className="toggle-text">
        <button type="button" onClick={onToggle}>
          Chưa có tài khoản? Đăng ký
        </button>
      </div>
    </div>
  );
}

export default Login;