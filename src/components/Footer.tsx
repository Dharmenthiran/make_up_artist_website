import { Link } from "react-router-dom";
import { Instagram, Phone, Mail, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/logo.jpg";

const Footer = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <footer className="relative overflow-hidden bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3">
              <img src={logo} alt="SHARMI MAKEOVERS" className="h-12 w-12 object-contain rounded-full" />
              <h3 className="text-2xl font-serif font-bold gradient-text">
                SHARMI MAKEOVERS
              </h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Enhancing Your Beauty, Defining Your Moment
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1, rotate: 5 }}
                href="https://instagram.com/sharmi_artbynila"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, rotate: 5 }}
                href="https://wa.me/916382489272"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, rotate: 5 }}
                href="tel:+916382489272"
                className="text-primary hover:text-primary/80 transition-colors"
                aria-label="Phone"
              >
                <Phone className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, rotate: 5 }}
                href="mailto:sharmila2905.2005@gmail.com"
                className="text-primary hover:text-primary/80 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold">Contact</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>📞 +91 63824 89272</p>
              <p>✉️ sharmila2905.2005@gmail.com</p>
              <p>📸 @sharmi_artbynila</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 pt-8 border-t border-border"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2025 Art by Nila. All Rights Reserved.
            </p>
            <div className="h-px w-32 bg-gradient-primary" />
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
