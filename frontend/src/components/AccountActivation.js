import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const AccountActivation = () => {
    const { token } = useParams();
    const [message, setMessage] = useState("Activating your account...");

    useEffect(() => {
        const activateAccount = async () => {
            try {
                await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/activate/${token}/`);
                setMessage("Your account has been activated successfully. You can now log in.");
            } catch (error) {
                setMessage("Account activation failed. The activation link might be invalid or expired.");
            }
        };

        activateAccount();
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-2xl font-bold mb-4">Account Activation</h2>
            <p>{message}</p>
            <Link to="/login" className="mt-4 text-blue-600 underline">Go to login page</Link>
        </div>
    );
};

export default AccountActivation;


