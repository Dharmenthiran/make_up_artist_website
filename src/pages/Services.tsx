import { motion } from "framer-motion";
import { Sparkles, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ParticlesBackground from "@/components/ParticlesBackground";

const services = [
  {
    title: "Wedding Makeup",
    emoji: "💍",
    price: "₹10,000",
    description: "Bridal makeup designed for elegance and tradition. Complete package for your special day.",
    animation: "zoom",
    color: "from-rose-gold-light to-rose-gold",
    includes: [
      "Hairstyle with Extension",
      "Makeup - 1 Look",
      "Saree Drapping - 2",
      "Saree Prepleating & Box Folding - 2",
    ],
  },
  {
    title: "Reception Makeup",
    emoji: "💫",
    price: "₹10,000",
    description: "Evening-ready reception makeup with shimmer tones and styling.",
    animation: "slide",
    color: "from-rose-gold to-gold",
    includes: [
      "Hairstyle with Extension",
      "Makeup - 1 Look",
      "Saree Drapping - 1",
      "Saree Prepleating & Box Folding - 1",
      "Hair Accessories - 1",
    ],
  },
  {
    title: "Baby Shower Makeup",
    emoji: "👶",
    price: "₹8,000",
    description: "Gentle, radiant glow makeup for special family moments.",
    animation: "fade",
    color: "from-secondary to-rose-gold-light",
    includes: [
      "Hairstyle with Extension",
      "Makeup - 1 Look",
      "Saree Drapping - 1",
      "Saree Prepleating & Box Folding - 1",
    ],
  },
  {
    title: "Engagement Makeup",
    emoji: "💖",
    price: "₹5,000",
    description: "Classic look with touch of luxury and elegance.",
    animation: "zoom",
    color: "from-primary to-rose-gold",
    includes: [
      "Hairstyle with Extension",
      "Makeup - 1",
      "Saree Drapping - 1",
    ],
  },
  {
    title: "Guest Makeup",
    emoji: "💃",
    price: "₹3,500",
    description: "Light and beautiful makeup for any guest attending ceremonies.",
    animation: "slide",
    color: "from-rose-gold-light to-gold-light",
    includes: [
      "Hairstyle without Extension",
      "Makeup - 1 Look (Subtle Makeup)",
      "Saree Drapping - 1",
    ],
  },
  {
    title: "Saree Draping",
    emoji: "👗",
    price: "Custom Pricing",
    description: "Perfect traditional saree draping with neat pleats.",
    animation: "fade",
    color: "from-gold to-primary",
    includes: [
      "Professional Draping Service",
      "Neat Pleats Styling",
      "Traditional & Modern Styles",
    ],
  },
  {
    title: "Saree Pre-Pleating",
    emoji: "🪡",
    price: "Custom Pricing",
    description: "Custom pre-pleated saree style for easy wear.",
    animation: "zoom",
    color: "from-secondary to-primary",
    includes: [
      "Pre-Pleating Service",
      "Box Folding",
      "Easy-to-Wear Design",
    ],
  },
  {
    title: "Hairstyle",
    emoji: "💇",
    price: "Custom Pricing",
    description: "Professional hair styling — buns, curls, braids & wedding looks.",
    animation: "slide",
    color: "from-rose-gold to-accent",
    includes: [
      "Professional Styling",
      "Buns, Curls & Braids",
      "Wedding Looks",
    ],
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
                scale: 1.02, 
                y: -5,
              }}
              className="group cursor-pointer"
            >
              <Card className="h-full glass border-border/50 hover:shadow-glow transition-all overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${service.color}`} />
                
                <CardHeader>
                  <motion.div 
                    className="text-5xl mb-4"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {service.emoji}
                  </motion.div>
                  
                  <CardTitle className="font-serif group-hover:text-primary transition-colors">
                    {service.title}
                  </CardTitle>
                  
                  <div className="text-3xl font-bold text-primary mt-2">
                    {service.price}
                  </div>
                  
                  <CardDescription className="leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="text-sm font-semibold text-foreground mb-2">Package Includes:</div>
                  <ul className="space-y-2">
                    {service.includes.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * i }}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-8 mb-16 border border-border/50"
        >
          <h3 className="text-2xl font-serif font-bold mb-4 text-center">Important Notes</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-muted-foreground">
            <div className="text-center">
              <div className="text-2xl mb-2">📅</div>
              <p>To block date, pay ₹1000 as advance (non-refundable)</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🚗</div>
              <p>Travel charges will be applicable</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">➕</div>
              <p>Additional services other than package will be chargeable</p>
            </div>
          </div>
        </motion.div>

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
            Let's create magic together. Message me to discuss your requirements 
            and book your personalized makeup session.
          </p>
          <a 
            href="https://instagram.com/direct/t/sharmi_artbynila" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button size="lg" className="shadow-glow animate-glow-pulse">
              Message Me
            </Button>
          </a>
        </motion.div>
      </div>
    </main>
  );
};

export default Services;
