import "./registration.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axiosUser from "../../utils/axios";

export default function Registration() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    /* ================= Toast ================= */
    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: "", type: "success" });
        }, 2500);
    };

    /* ================= Handle Input ================= */
    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    /* ================= OTP TIMER ================= */
    useEffect(() => {
        if (!otpSent || otpVerified || timeLeft === 0) return;

        const timer = setTimeout(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [otpSent, otpVerified, timeLeft]);

    /* ================= SEND OTP ================= */
    const sendOtp = async () => {
        if (!formData.email)
            return showToast("Please enter your email first", "error");

        try {
            setLoading(true);

            const res = await axiosUser.post(
                `/otp/send?email=${formData.email}`
            );

            if (res.data === "USER_EXISTS") {
                showToast("User already exists. Please login.", "error");
                return;
            }

            if (res.data === "OTP_SENT") {
                setOtpSent(true);
                setTimeLeft(60);
                showToast("OTP sent successfully");
            }
        } catch (err) {
            showToast("Failed to send OTP", "error");
        } finally {
            setLoading(false);
        }
    };

    /* ================= VERIFY OTP ================= */
    const verifyOtp = async () => {
        if (!otp) return showToast("Enter OTP", "error");

        try {
            setLoading(true);

            const res = await axiosUser.post(
                `/otp/verify?email=${formData.email}&otp=${otp}`
            );

            switch (res.data) {
                case "OTP_VERIFIED":
                    setOtpVerified(true);
                    showToast("OTP verified successfully");
                    break;

                case "INVALID_OTP":
                    showToast("Invalid OTP", "error");
                    break;

                case "OTP_EXPIRED":
                    showToast("OTP expired", "error");
                    break;

                case "USER_EXISTS":
                    showToast("User already exists. Login instead.", "error");
                    break;

                default:
                    showToast("Verification failed", "error");
            }
        } catch (err) {
            showToast("OTP verification failed", "error");
        } finally {
            setLoading(false);
        }
    };

    /* ================= REGISTER ================= */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!otpVerified)
            return showToast("Please verify OTP first", "error");

        try {
            setLoading(true);

            const res = await axiosUser.post("/new_users", formData);

            if (res.data === "USER_EXISTS") {
                showToast("User already exists", "error");
                return;
            }

            showToast("Registration successful");

            setFormData({ username: "", email: "", password: "" });
            setOtp("");
            setOtpSent(false);
            setOtpVerified(false);

            setTimeout(() => navigate("/login"), 1200);
        } catch (err) {
            showToast("Registration failed", "error");
        } finally {
            setLoading(false);
        }
    };

    /* ================= UI ================= */
    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2>Register</h2>

                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            value={formData.username}
                            onChange={(e) =>
                                updateField("username", e.target.value)
                            }
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mt-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                                updateField("email", e.target.value)
                            }
                            required
                        />
                    </Form.Group>

                    {!otpSent && (
                        <Button
                            type="button"
                            onClick={sendOtp}
                            disabled={loading}
                            className="mt-3"
                        >
                            Send OTP
                        </Button>
                    )}

                    {otpSent && !otpVerified && (
                        <div className="otp-section">
                            <Form.Group className="mt-3">
                                <Form.Label>Enter OTP</Form.Label>
                                <Form.Control
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </Form.Group>

                            <Button
                                type="button"
                                onClick={verifyOtp}
                                className="mt-2"
                            >
                                Verify OTP
                            </Button>

                            {timeLeft > 0 ? (
                                <p className="otp-timer">
                                    Resend in {timeLeft}s
                                </p>
                            ) : (
                                <button
                                    type="button"
                                    className="resend-btn"
                                    onClick={sendOtp}
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>
                    )}

                    <Form.Group className="mt-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={formData.password}
                            onChange={(e) =>
                                updateField("password", e.target.value)
                            }
                            required
                        />
                    </Form.Group>

                    <Button
                        type="submit"
                        className="mt-3"
                        disabled={!otpVerified}
                    >
                        Register
                    </Button>

                    <div className="login-link">
                        Already have an account?
                        <button
                            type="button"
                            className="login-btn-link"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>
                    </div>
                </Form>
            </div>

            {toast.show && (
                <div className={`toast-popup ${toast.type}`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
}
