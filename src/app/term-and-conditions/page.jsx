import React from "react";
import { Shield } from "lucide-react";

function TermCondition() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm mt-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center">
          <Shield className="h-8 w-8 text-black mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">
            Terms and Conditions for Mentorle
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">
                Welcome to Mentorle. By accessing and using our website, you
                agree to comply with and be bound by the following terms and
                conditions:
              </p>

              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Use of Website
              </h2>
              <p className="text-gray-600 mb-6">
                The content on this website is for general information and use
                only. It is subject to change without notice.
              </p>
              <p className="text-gray-600 mb-6">
                Neither we nor any third parties provide any warranty or
                guarantee as to the accuracy, timeliness, performance,
                completeness or suitability of the information and materials
                found or offered on this website for any particular purpose. You
                acknowledge that such information and materials may contain
                inaccuracies or errors, and we expressly exclude liability for
                any such inaccuracies or errors to the fullest extent permitted
                by law.
              </p>
              <p className="text-gray-600 mb-6">
                Your use of any information or materials on this website is
                entirely at your own risk, for which we shall not be liable. It
                shall be your own responsibility to ensure that any products,
                services or information available through this website meet your
                specific requirements.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Intellectual Property
              </h2>
              <p className="text-gray-600 mb-6">
                This website contains material which is owned by or licensed to
                us. This material includes, but is not limited to, the design,
                layout, look, appearance and graphics. Reproduction is
                prohibited other than in accordance with the copyright notice,
                which forms part of these terms and conditions.
              </p>
              <p className="text-gray-600 mb-6">
                All trademarks reproduced in this website, which are not the
                property of, or licensed to the operator, are acknowledged on
                the website.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mb-4">
                User Content
              </h2>
              <p className="text-gray-600 mb-6">
                You may post, upload, or submit content to our website. By doing
                so, you grant us a non-exclusive, worldwide, perpetual,
                irrevocable, royalty-free, sublicensable right to use,
                reproduce, modify, adapt, publish, translate, create derivative
                works from, distribute, and display such content.
              </p>
              <p className="text-gray-600 mb-6">
                You agree not to submit any content that is unlawful,
                defamatory, abusive, harassing, harmful, threatening, obscene,
                or otherwise objectionable.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Disclaimer and Limitation of Liability
              </h2>
              <p className="text-gray-600 mb-6">
                Your use of this website and any dispute arising out of such use
                is subject to the laws of India.
              </p>
              <p className="text-gray-600 mb-6">
                We shall not be liable for any direct, indirect, incidental,
                consequential or punitive damages arising out of your access to,
                or use of, this website.
              </p>
              <p className="text-gray-600 mb-6">
                The information provided on this website does not constitute
                professional advice. We recommend seeking appropriate
                professional advice for specific queries.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mb-4">Privacy</h2>
              <p className="text-gray-600 mb-6">
                We are committed to protecting your privacy. We only use the
                information we collect about you to process orders and to
                provide a better service to you.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Governing Law and Jurisdiction
              </h2>
              <p className="text-gray-600 mb-6">
                These terms and conditions shall be governed by and construed in
                accordance with the Indian Laws. Any dispute arising under these
                terms and conditions shall be subject to the exclusive
                jurisdiction of the courts of India.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Changes to Terms
              </h2>
              <p className="text-gray-600 mb-6">
                We reserve the right to modify these terms at any time. You
                should check this page regularly to take notice of any changes
                we have made.
              </p>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  By using our website, you signify your acceptance of these
                  terms and conditions. If you do not agree to these terms,
                  please do not use our website.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TermCondition;
