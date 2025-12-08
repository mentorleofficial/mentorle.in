import React from "react";
import { Shield } from "lucide-react";

function PrivatePolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm mt-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center">
          <Shield className="h-8 w-8 text-black mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">
            Privacy Policy for Mentorle
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">
                At Mentorle, we are committed to protecting your privacy and
                ensuring the security of your personal data. This Privacy Policy
                outlines how we collect, use, disclose, and safeguard your
                information in accordance with the Digital Personal Data
                Protection Act, 2023 (DPDPA) and the Digital Personal Data
                Protection Rules, 2025.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Information We Collect
              </h2>
              <p className="text-gray-600 mb-2">
                We collect the following types of personal data:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li>Contact information (name, email address, phone number)</li>
                <li>Professional details (occupation, skills, experience)</li>
                <li>Account credentials</li>
                <li>Usage data and analytics</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mb-4">
                How We Use Your Information
              </h2>
              <p className="text-gray-600 mb-2">
                We use your personal data for the following purposes:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li>Providing and improving our mentorship services</li>
                <li>Communicating with you about our services</li>
                <li>Personalizing your experience on our platform</li>
                <li>Analyzing usage patterns to enhance our offerings</li>
                <li>Complying with legal obligations</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Data Security
              </h2>
              <p className="text-gray-600 mb-2">
                We implement robust security measures to protect your personal
                data, including:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li>Encryption of data in transit and at rest</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Employee training on data protection practices</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Your Rights
              </h2>
              <p className="text-gray-600 mb-2">
                As a data principal, you have the following rights:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li>Access your personal data</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Erase your data (right to be forgotten)</li>
                <li>Withdraw consent for data processing</li>
                <li>File complaints regarding data processing</li>
              </ul>
              <p className="text-gray-600 mb-6">
                To exercise these rights, please contact our Mentorle Support at{" "}
                <a
                  href="mailto:support@mentorle.in"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  support@mentorle.in
                </a>
              </p>

              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Data Retention
              </h2>
              <p className="text-gray-600 mb-6">
                We retain your personal data only for as long as necessary to
                fulfill the purposes outlined in this policy or as required by
                law.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Data Sharing and Transfers
              </h2>
              <p className="text-gray-600 mb-2">We may share your data with:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-600">
                <li>Service providers who assist in our operations</li>
                <li>Legal authorities when required by law</li>
              </ul>
              <p className="text-gray-600 mb-6">
                Any cross-border data transfers will comply with the regulations
                set forth in the DPDPA and associated rules.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Changes to This Policy
              </h2>
              <p className="text-gray-600 mb-6">
                We may update this policy periodically. We will notify you of
                any significant changes via email or through our platform.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-600">
                If you have any questions or concerns about this Privacy Policy,
                please contact us at:
              </p>
              <div className="mt-4 text-gray-600">
                <strong>Mentorle Support</strong>
                <br />
                Email:{" "}
                <a
                  href="mailto:support@mentorle.in"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  support@mentorle.in
                </a>
                <br />
                Address: Ludhiana, Punjab
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  By using our services, you acknowledge that you have read and
                  understood this Privacy Policy.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Last Updated: February 20, 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PrivatePolicy;
