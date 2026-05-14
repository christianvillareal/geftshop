import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-lime-600">Home</Link> &gt;
          <span className="text-gray-800 font-medium">Terms & Conditions</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Terms & Conditions</h1>
          <p className="text-gray-500 text-sm mb-6">Last updated: May 2026</p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">1. General Information</h2>
              <p>
                Welcome to <strong>Geftshop</strong> – your source for curated ukay maxi dresses. 
                By accessing or using our website, you agree to be bound by these Terms & Conditions. 
                If you do not agree, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">2. Products & Pricing</h2>
              <p>
                All product descriptions, images, and prices are displayed as accurately as possible. 
                However, due to the nature of thrifted/ukay items, slight variations in color, pattern, 
                or minor imperfections may exist. These are not considered defects but part of the 
                unique character of each piece.
              </p>
              <p className="mt-2">
                We reserve the right to modify prices or discontinue any product without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">3. Orders & Payment</h2>
              <p>
                Once an order is placed, you will receive an order confirmation via email. 
                Payment methods accepted: Debit Card (Visa, Mastercard, Amex) and GCash. 
                Payment must be completed before the order is processed. 
                Shipping fees are calculated separately and will be sent to you after order confirmation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Shipping & Delivery</h2>
              <p>
                We ship nationwide via J&T Express. Delivery times vary depending on your location. 
                Once your order is shipped, you will receive a tracking number. 
                Geftshop is not liable for delays caused by the courier or unforeseen circumstances.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">5. Returns & Refunds</h2>
              <p className="font-medium text-red-600">Refunds are only available for damaged items.</p>
              <p>
                If you receive a product that is damaged upon arrival, please contact us within 
                <strong> 3 days of delivery</strong> with clear photos of the damage. 
                After verification, we will issue a refund (or store credit, at your choice). 
                We do not accept returns for change of mind, wrong size selection, or minor aesthetic 
                variations (as thrifted items are unique).
              </p>
              <p className="mt-2">
                To request a refund, email us at <strong>sdcamillejoyce@gmail.com</strong> with your 
                order number and damage proof.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">6. Intellectual Property</h2>
              <p>
                All content on this site (text, graphics, logos, images) is the property of Geftshop 
                and may not be used without written permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">7. Limitation of Liability</h2>
              <p>
                Geftshop shall not be liable for any indirect, incidental, or consequential damages 
                arising from the use of our products or website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">8. Changes to Terms</h2>
              <p>
                We may update these Terms from time to time. The latest version will always be posted here. 
                Your continued use of the site constitutes acceptance of any changes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">9. Contact Us</h2>
              <p>
                For any questions, please contact us at:<br />
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

export default Terms;