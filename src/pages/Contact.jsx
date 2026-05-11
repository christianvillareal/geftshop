// src/pages/Contact.jsx
import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const Contact = () => {
    const [formData, setFormData] = useState({
        user_name: '',
        user_email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch('http://localhost:5000/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                setStatus({ type: 'success', message: 'Message sent successfully! We\'ll get back to you soon.' });
                setFormData({ user_name: '', user_email: '', subject: '', message: '' });
            } else {
                setStatus({ type: 'error', message: data.message || 'Failed to send message.' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Network error. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Get In Touch</h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Have a question or feedback? We'd love to hear from you.
                    </p>
                    <div className="w-20 h-1 bg-lime-600 mx-auto mt-4 rounded-full"></div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left: Contact Info */}
                    <div className="lg:w-1/2 space-y-8">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-lime-100 p-3 rounded-full">
                                        <FaEnvelope className="text-lime-600 w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-700">Email Us</h3>
                                        <p className="text-gray-500">sdcamillejoyce@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-lime-100 p-3 rounded-full">
                                        <FaPhone className="text-lime-600 w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-700">Call Us</h3>
                                        <p className="text-gray-500">+63 905 505 9622</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-lime-100 p-3 rounded-full">
                                        <FaMapMarkerAlt className="text-lime-600 w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-700">Visit Us</h3>
                                        <p className="text-gray-500">Talisay City, Cebu Philippines</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-lime-100 p-3 rounded-full">
                                        <FaClock className="text-lime-600 w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-700">Business Hours</h3>
                                        <p className="text-gray-500">Mon - Fri: 9:00 AM - 6:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Contact Form */}
                    <div className="lg:w-1/2">
                        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                            
                            {status.message && (
                                <div className={`mb-6 p-4 rounded-lg ${
                                    status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    {status.message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        name="user_name"
                                        value={formData.user_name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Email Address *</label>
                                    <input
                                        type="email"
                                        name="user_email"
                                        value={formData.user_email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Subject *</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                                        placeholder="What is this regarding?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Message *</label>
                                    <textarea
                                        name="message"
                                        rows="5"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                                        placeholder="Tell us more..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full bg-lime-600 hover:bg-lime-700 text-white font-medium py-3 rounded-lg transition duration-200 ${
                                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;