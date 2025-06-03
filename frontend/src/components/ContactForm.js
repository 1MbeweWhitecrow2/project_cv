import React, { useState } from "react";
import axios from "axios";

const ContactForm = () => {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Sending...");
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/contact/send/`, formData);
            setStatus("Email sent successfully!");
            setFormData({ name: "", email: "", message: "" });
        } catch (error) {
            setStatus("Error sending email. Try again later.");
        }
    };

    return (
        <div className="max-w-lg mx-auto p-5 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-3">Contact Me</h2>
            {status && <p className="text-green-600 mb-3">{status}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-3"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-3"
                    required
                />
                <textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-3"
                    rows="4"
                    required
                ></textarea>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
                    Send Message
                </button>
            </form>
        </div>
    );
};

export default ContactForm;
