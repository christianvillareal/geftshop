import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-lime-600">Home</Link> &gt;
          <span className="text-gray-800 font-medium">Privacy Policy</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Privacy Policy</h1>
          <p className="text-gray-500 text-sm mb-6">Last updated: May 2026</p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Information We Collect</h2>
              <p>
                When you place an order or contact us, we may collect the following information:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Name, email address, phone number, and shipping address</li>
                <li>Payment details (processed securely by our payment gateway – we do not store full card details)</li>
                <li>Order history and product preferences</li>
                <li>Communications with us (emails, messages)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">2. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Process and fulfill your orders</li>
                <li>Communicate order updates and shipping notifications</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Improve our products and services</li>
                <li>Send promotional emails (only if you opt in – you can unsubscribe anytime)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">3. Data Sharing & Security</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. 
                We may share your data with trusted service providers (e.g., couriers, payment processors, 
                email service) solely to complete your orders and operate our store.
              </p>
              <p className="mt-2">
                All payment transactions are encrypted via SSL and handled by secure payment gateways. 
                While we strive to protect your data, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Cookies</h2>
              <p>
                Our website uses cookies to enhance your browsing experience (e.g., remember cart items). 
                You can disable cookies in your browser settings, but some features may not work properly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">5. Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal data. 
                To do so, please contact us at <strong>sdcamillejoyce@gmail.com</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">6. Third‑Party Links</h2>
              <p>
                Our site may contain links to external websites (e.g., payment gateways). 
                We are not responsible for the privacy practices of those sites.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">7. Children’s Privacy</h2>
              <p>
                Our services are not directed to individuals under 18. We do not knowingly collect 
                information from minors.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">8. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy occasionally. The revised version will be posted here 
                with an updated effective date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">9. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us:<br />
                📧 sdcamillejoyce@gmail.com<br />
                📞 +63 905 505 9622
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;