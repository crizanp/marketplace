import React from "react";
import {
  FaTelegram,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaGithub,
  FaReddit,
  FaGlobe,
  FaLinkedin,
  FaYoutube,
  FaDiscord,
  FaMedium,
  FaPinterest,
  FaSnapchat,
} from "react-icons/fa";

const Social = ({ links }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Social Info</h2>
      <div className="flex gap-4 flex-wrap">
        {/* Website */}
        {links.website && (
          <a
            href={links.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-green-400"
          >
            <FaGlobe size={24} />
          </a>
        )}
        {/* Telegram */}
        {links.telegram && (
          <a
            href={links.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-green-400"
          >
            <FaTelegram size={24} />
          </a>
        )}
        {/* Twitter */}
        {links.twitter && (
          <a
            href={links.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-green-400"
          >
            <FaTwitter size={24} />
          </a>
        )}
        {/* Instagram */}
        {links.instagram && (
          <a
            href={links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-green-400"
          >
            <FaInstagram size={24} />
          </a>
        )}
        {/* Facebook */}
        {links.facebook && (
          <a
            href={links.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-green-400"
          >
            <FaFacebook size={24} />
          </a>
        )}
        {/* GitHub */}
        {links.github && (
          <a
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-green-400"
          >
            <FaGithub size={24} />
          </a>
        )}
        {/* Reddit */}
        {links.reddit && (
          <a
            href={links.reddit}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-green-400"
          >
            <FaReddit size={24} />
          </a>
        )}
        {/* LinkedIn */}
        {links.linkedin && (
          <a
            href={links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-green-400"
          >
            <FaLinkedin size={24} />
          </a>
        )}
        {/* YouTube */}
        {links.youtube && (
          <a
            href={links.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-green-400"
          >
            <FaYoutube size={24} />
          </a>
        )}
        {/* Discord */}
        {links.discord && (
          <a
            href={links.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-green-400"
          >
            <FaDiscord size={24} />
          </a>
        )}
        {/* Medium */}
        {links.medium && (
          <a
            href={links.medium}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-green-400"
          >
            <FaMedium size={24} />
          </a>
        )}
        {/* Pinterest */}
        {links.pinterest && (
          <a
            href={links.pinterest}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-green-400"
          >
            <FaPinterest size={24} />
          </a>
        )}
        {/* Snapchat */}
        {links.snapchat && (
          <a
            href={links.snapchat}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-green-400"
          >
            <FaSnapchat size={24} />
          </a>
        )}
      </div>
    </div>
  );
};

export default Social;
