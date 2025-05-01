import React, { useState } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [recaptchaToken, setRecaptchaToken] = useState("");
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!recaptchaToken) {
            setErrorMessage("Proszę potwierdzić, że nie jesteś robotem.");
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/users/register/", {
                ...formData,
                recaptcha: recaptchaToken,
            });

            setMessage("Rejestracja przebiegła pomyślnie. Sprawdź swoją skrzynkę e-mail i kliknij w link aktywacyjny, aby zakończyć proces rejestracji.");
            setErrorMessage("");
        } catch (error) {
            setErrorMessage(error.response?.data?.error || "Rejestracja nie powiodła się.");
            setMessage("");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-2xl font-bold mb-4">Rejestracja</h2>
            {message ? (
                <p className="text-green-600">{message}</p>
            ) : (
                <form onSubmit={handleSubmit} className="bg-white p-5 rounded shadow-lg w-full max-w-md">
                    <input
                        type="text"
                        name="username"
                        placeholder="Nazwa użytkownika"
                        value={formData.username}
                        onChange={handleChange}
                        className="mb-3 p-2 border w-full"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        value={formData.email}
                        onChange={handleChange}
                        className="mb-3 p-2 border w-full"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Hasło"
                        value={formData.password}
                        onChange={handleChange}
                        className="mb-3 p-2 border w-full"
                        required
                    />
                    <ReCAPTCHA
                        sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                        onChange={(token) => setRecaptchaToken(token)}
                        className="mb-4"
                    />
                    {errorMessage && <p className="text-red-600 text-sm mb-3">{errorMessage}</p>}
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
                        Zarejestruj się
                    </button>
                </form>
            )}
        </div>
    );
};

export default Register;


