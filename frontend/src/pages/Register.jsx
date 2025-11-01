import React, { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

function Register({ onToggle }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Mật khẩu không trùng khớp!");
      return;
    }
    alert(`Đăng ký thành công cho: ${email}`);
  };

  return (
    <div className="form-container">
      <h2>Đăng ký</h2>
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

        <div className="input-group">
          <label>Nhập lại mật khẩu</label>
          <FiLock className="input-icon" />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>

        <button type="submit">Đăng ký</button>
      </form>

      <div className="toggle-text">
        <button type="button" onClick={onToggle}>
          Đã có tài khoản? Đăng nhập
        </button>
      </div>
    </div>
  );
}

export default Register;