import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-green-400 mb-8">
          Privacy Policy
        </h1>
        <p className="text-gray-300 mb-6 text-center">
          Last Updated: December 2024
        </p>

        {/* Introduction Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-green-300 mb-4">
            Welcome to the AI Agent Marketplace and Launchpad
          </h2>
          <p className="text-gray-300 leading-relaxed">
            At our platform, your privacy is our priority. This Privacy Policy
            explains how we collect, use, and protect your data when you use
            our decentralized crypto-based marketplace and launchpad. By
            connecting your wallet and accessing our services, you agree to the
            practices outlined in this policy.
          </p>
        </section>

        {/* Data Collection Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-green-300 mb-4">
            Information We Collect
          </h2>
          <ul className="space-y-4">
            <li>
              <p>
                <strong>Wallet Address:</strong> We collect your wallet address
                when you connect your wallet to sign in. No personal data like
                name or email is required unless explicitly provided.
              </p>
            </li>
            <li>
              <p>
                <strong>Platform Activity:</strong> Transaction history,
                interactions with AI agents, and project submissions are logged
                to enhance your experience.
              </p>
            </li>
            <li>
              <p>
                <strong>Analytics Data:</strong> Non-identifiable data such as
                browser type, device information, and general usage statistics
                are collected to improve our platform.
              </p>
            </li>
          </ul>
        </section>

        {/* How We Use Your Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-green-300 mb-4">
            How We Use Your Information
          </h2>
          <ul className="space-y-4">
            <li>
              <p>
                <strong>Wallet-Based Authentication:</strong> To provide
                seamless and secure access without traditional account
                credentials.
              </p>
            </li>
            <li>
              <p>
                <strong>Transaction Processing:</strong> To facilitate
                purchases, staking, or other platform services.
              </p>
            </li>
            <li>
              <p>
                <strong>Platform Improvement:</strong> Analyze trends and user
                behavior to optimize performance and usability.
              </p>
            </li>
          </ul>
        </section>

        {/* Data Sharing Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-green-300 mb-4">
            Data Sharing and Security
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Your data is treated with the utmost care. We do not sell or share
            your wallet address or activity data with third parties, except in
            the following cases:
          </p>
          <ul className="space-y-4">
            <li>
              <p>
                <strong>Regulatory Compliance:</strong> When required by law or
                regulatory authorities.
              </p>
            </li>
            <li>
              <p>
                <strong>Trusted Partners:</strong> To trusted service providers
                who assist us in operating the platform, under strict
                confidentiality agreements.
              </p>
            </li>
          </ul>
        </section>

        {/* Security Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-green-300 mb-4">
            Security Measures
          </h2>
          <p className="text-gray-300 leading-relaxed">
            We prioritize your security by implementing industry-standard
            encryption and blockchain principles. However, you are responsible
            for maintaining the security of your wallet and private keys. Never
            share your private keys or seed phrases with anyone.
          </p>
        </section>

        {/* User Rights Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-green-300 mb-4">
            Your Rights
          </h2>
          <ul className="space-y-4">
            <li>
              <p>
                <strong>Transparency:</strong> You can request details on the
                data we collect and how it is used.
              </p>
            </li>
            <li>
              <p>
                <strong>Data Removal:</strong> You may request the deletion of
                your data. Note that blockchain data cannot be modified or
                deleted due to its immutable nature.
              </p>
            </li>
            <li>
              <p>
                <strong>Opt-Out:</strong> You may disconnect your wallet at any
                time and stop using the platform.
              </p>
            </li>
          </ul>
        </section>

        {/* Updates Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-green-300 mb-4">
            Updates to This Privacy Policy
          </h2>
          <p className="text-gray-300 leading-relaxed">
            We may update this Privacy Policy from time to time to reflect
            changes in our practices or regulations. We encourage you to review
            this page periodically for updates. Continued use of the platform
            constitutes acceptance of the updated policy.
          </p>
        </section>

        {/* Contact Section */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-green-300 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-300">
            If you have any questions or concerns about this Privacy Policy,
            please contact us at{" "}
            <a
              href="mailto:support@aigekko.fun"
              className="text-green-400 underline hover:text-green-300"
            >
              support@aigekko.fun
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
