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

    const updateField = (field, value) => {
        setCredentials(prev => ({ ...prev, [field]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await axiosUser.post('/auth/login', credentials);

            if (res.data === "INVALID_CREDENTIALS") {
                alert("Invalid email or password");
                return;
            }

            // If backend returns JWT
            localStorage.setItem("token", res.data.token);

            alert("Login successful");

            navigate("/"); // Redirect after login

        } catch {
            alert("Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">

            <div className="login-form-wrapper">
                <h2>Login</h2>

                <Form onSubmit={handleLogin}>

                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={credentials.email}
                            onChange={e => updateField("email", e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mt-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={credentials.password}
                            onChange={e => updateField("password", e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button type="submit" disabled={loading} className="mt-3">
                        Login
                    </Button>

                    <div className="register-link">
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
    );
}
