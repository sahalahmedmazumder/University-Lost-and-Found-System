import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import type { LoginRequest } from "../types/User";

import "../styles/Auth.css";

export default function Login() {
    const navigate = useNavigate();

    const { login } = useAuth();

    const [formData, setFormData] =
        useState<LoginRequest>({
            email: "",
            password: "",
        });

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setError("");
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            // AuthContext handles the API request,
            // token storage and user state.
            await login(formData);

            // Login successful
            navigate("/");
        } catch (err: unknown) {
            console.error(err);

            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Login failed.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <h1>Login</h1>

                <p className="auth-subtitle">
                    Welcome Back
                </p>

                <form onSubmit={handleSubmit}>

                    {/* Email */}
                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* Password */}
                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* Error */}
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}


                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="auth-button"
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>


                {/* Register */}
                <div className="auth-footer">

                    <span>
                        Don't have an account?
                    </span>

                    <Link to="/register">
                        Register
                    </Link>

                </div>

            </div>

        </div>
    );
}