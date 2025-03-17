import { FaTelegram, FaInstagram, FaWhatsapp, FaEnvelope, FaPhone } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-8 mt-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Section 1: About Us */}
        <div>
          <h3 className="text-lg font-bold text-red-400 mb-3">Finest Traders</h3>
          <p className="text-sm leading-relaxed">
            Empowering traders with tools, education, and strategies to succeed in the global markets. Your success is our priority.
          </p>
        </div>

        {/* Section 2: Contact Info */}
        <div>
          <h3 className="text-lg font-bold text-green-400 mb-3">Contact Us</h3>
          <ul className="space-y-2">
            <li className="flex justify-center md:justify-start items-center gap-2">
              <FaEnvelope /> <span>finesttraders1@gmail.com</span>
            </li>
            <li className="flex justify-center md:justify-start items-center gap-2">
              <FaPhone /> <span>+254 753 668073</span>
            </li>
          </ul>
        </div>

        {/* Section 3: Social Media */}
        <div>
          <h3 className="text-lg font-bold text-blue-400 mb-3">Follow Us</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            <a
              href="https://t.me/FinestTraders"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-200 transition"
            >
              <FaTelegram size={24} />
            </a>
            <a
              href="https://www.instagram.com/finestburu?igsh=dXVwdzY1dDdhdGdm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-200 transition"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://wa.me/254753668073"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-200 transition"
            >
              <FaWhatsapp size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm">
        © {new Date().getFullYear()} Finest Traders. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
