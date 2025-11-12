import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ParticlesBackground from "@/components/ParticlesBackground";

const services = [
  {
    title: "Wedding Makeup",
    emoji: "💍",
    description: "Bridal makeup designed for elegance and tradition. Includes full glam look and matching accessories.",
    animation: "zoom",
    color: "from-rose-gold-light to-rose-gold",
  },
  {
    title: "Reception Makeup",
    emoji: "💫",
    description: "Evening-ready reception makeup with shimmer tones and styling.",
    animation: "slide",
    color: "from-rose-gold to-gold",
  },
  {
    title: "Baby Shower Makeup",
    emoji: "👶",
    description: "Gentle, radiant glow makeup for special family moments.",
    animation: "fade",
    color: "from-secondary to-rose-gold-light",
  },
  {
    title: "Engagement Makeup",
    emoji: "💖",
    description: "Classic look with touch of luxury and elegance.",
    animation: "zoom",
    color: "from-primary to-rose-gold",
  },
  {
    title: "Guest Makeup",
    emoji: "💃",
    description: "Light and beautiful makeup for any guest attending ceremonies.",
    animation: "slide",
    color: "from-rose-gold-light to-gold-light",
  },
  {
    title: "Saree Draping",
    emoji: "👗",
    description: "Perfect traditional saree draping with neat pleats.",
    animation: "fade",
    color: "from-gold to-primary",
  },
  {
    title: "Saree Pre-Pleating",
    emoji: "🪡",
    description: "Custom pre-pleated saree style for easy wear.",
    animation: "zoom",
    color: "from-secondary to-primary",
  },
  {
    title: "Hairstyle",
    emoji: "💇",
    description: "Professional hair styling — buns, curls, braids & wedding looks.",
    animation: "slide",
    color: "from-rose-gold to-accent",
  },
];

const Services = () => {
  return (
    <main className="relative min-h-screen pt-20">
      <ParticlesBackground />
      
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Our Services</span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
            <span className="gradient-text text-shadow-glow">Elevate Your Beauty</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            From traditional bridal elegance to modern styling, we offer comprehensive 
            makeup and styling services for every special occasion
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                rotateZ: service.animation === "zoom" ? 2 : 0 
              }}
              className="glass rounded-2xl overflow-hidden shadow-glass hover:shadow-glow transition-all group cursor-pointer"
            >
              <div className={`h-2 bg-gradient-to-r ${service.color}`} />
              
              <div className="p-6">
                <motion.div 
                  className="text-6xl mb-4"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {service.emoji}
                </motion.div>
                
                <h3 className="text-2xl font-serif font-semibold mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-12 text-center shadow-glass"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Ready to Book Your Session?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let's create magic together. Contact us to discuss your requirements 
            and book your personalized makeup session.
          </p>
          <Link to="/contact">
            <Button size="lg" className="shadow-glow animate-glow-pulse">
              Book Now
            </Button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
};

export default Services;
