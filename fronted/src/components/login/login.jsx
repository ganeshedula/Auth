import './login.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosUser from '../../utils/axios';

export default function Login() {

    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });

    const updateField = (field, value) => {
        setCredentials(prev => ({ ...prev, [field]: value }));
    };

    const showToastMessage = (message, type = "success") => {
        setToast({ show: true, message, type });

        setTimeout(() => {
            setToast({ show: false, message: "", type: "" });
        }, 2500);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await axiosUser.post('/auth/login', credentials);

            if (res.data === "LOGIN_SUCCESS") {
                showToastMessage("Login successful");
                setTimeout(() => navigate("/"), 2000);
            }

        } catch (err) {
            const errorMsg = err.response?.data;

            if (errorMsg === "USER_NOT_FOUND") {
                showToastMessage("User not found", "error");
            } else if (errorMsg === "INVALID_PASSWORD") {
                showToastMessage("Invalid email or password", "error");
            } else {
                showToastMessage("Server error. Please try again.", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {toast.show && (
                <div className={`toast-popup ${toast.type}`}>
                    {toast.message}
                </div>
            )}

            <div className="login-container">
                <div className="login-form-wrapper">
                    <h2>Login</h2>

                    <Form onSubmit={handleLogin}>

                        {/* Email */}
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={credentials.email}
                                onChange={e => updateField("email", e.target.value)}
                                required
                            />
                        </Form.Group>

                        {/* Password with eye toggle */}
                        <Form.Group className="mt-3 password-group">
                            <Form.Label>Password</Form.Label>

                            <div className="password-wrapper">
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    value={credentials.password}
                                    onChange={e => updateField("password", e.target.value)}
                                    required
                                />

                                <span
                                    className="toggle-password"
                                    onClick={() => setShowPassword(prev => !prev)}
                                >
                                    {showPassword ? "🙈" : "👁"}
                                </span>
                            </div>
                        </Form.Group>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="mt-3 w-100"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </Button>

                        <div className="register-link mt-3">
                            <p>
                                Don’t have an account?
                                <button
                                    type="button"
                                    className="register-btn-link"
                                    onClick={() => navigate("/register")}
                                >
                                    Register
                                </button>
                            </p>
                        </div>

                    </Form>
                </div>
            </div>
        </>
    );
}