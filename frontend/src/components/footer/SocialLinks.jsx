import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa6";

const linkStyles = `focus rounded-full bg-gray-50 p-4 text-gray-400 hover:bg-red hover:text-white transition-colors duration-300`;

function SocialLinks() {
  return (
    <ul className="flex gap-2">
      {/* Facebook */}
      <a
        href="https://www.facebook.com/share/1SiyGixMRB/?mibextid=wwXIfr"
        target="_blank"
        rel="noopener noreferrer"
        className={linkStyles}
      >
        <FaFacebookF />
      </a>

      {/* Instagram */}
      <a
        href="https://www.instagram.com/shazly_gym?igsh=MXZhZXllOTdsaHkz&utm_source=qr"
        target="_blank"
        rel="noopener noreferrer"
        className={linkStyles}
      >
        <FaInstagram />
      </a>

      {/* TikTok */}
      <a
        href="https://www.tiktok.com/@shazly.gym?_t=ZS-90onHCZMJSp&_r=1"
        target="_blank"
        rel="noopener noreferrer"
        className={linkStyles}
      >
        <FaTiktok />
      </a>

      {/* WhatsApp */}
      <a
      href="https://wa.me/201124045247"
        target="_blank"
        rel="noopener noreferrer"
        className={linkStyles}
      >
        <FaWhatsapp />
      </a>
    </ul>
  );
}

export default SocialLinks;
