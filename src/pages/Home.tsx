import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ParticlesBackground from "@/components/ParticlesBackground";
import MakeupBrush3D from "@/components/MakeupBrush3D";
import heroImage from "@/assets/hero-makeup.jpg";

const Home = () => {
  return (
    <main className="relative min-h-screen">
      <ParticlesBackground />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        <div className="container mx-auto px-4 z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Professional Makeup Artist</span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight">
                <span className="gradient-text text-shadow-glow">
                  Enhancing Your Beauty,
                </span>
                <br />
                <span className="text-foreground">
                  Defining Your Moment
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Transform your special moments with professional makeup artistry. 
                From weddings to celebrations, let your natural beauty shine.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://wa.me/916382489272" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="group shadow-glow animate-glow-pulse">
                    WhatsApp Me
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
                <Link to="/services">
                  <Button size="lg" variant="outline" className="glass">
                    View Services
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* 3D Scene */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-[400px] md:h-[600px] rounded-3xl overflow-hidden"
              style={{ background: 'transparent' }}
            >
              <Canvas 
                camera={{ position: [0, 0, 5], fov: 50 }} 
                gl={{ alpha: true, antialias: true, premultipliedAlpha: false }}
                style={{ background: 'transparent' }}
              >
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                <MakeupBrush3D />
                <Environment preset="sunset" />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
              </Canvas>
            </motion.div>
          </div>
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </section>

      {/* Quick Services Preview */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              <span className="gradient-text">Featured Services</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our range of professional makeup and styling services
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Bridal Makeup", emoji: "💍", desc: "Elegant wedding day glam" },
              { title: "Saree Draping", emoji: "👗", desc: "Perfect traditional styling" },
              { title: "Hairstyling", emoji: "💇", desc: "Professional hair artistry" },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="glass p-8 rounded-2xl shadow-glass hover:shadow-glow transition-all cursor-pointer"
              >
                <div className="text-5xl mb-4">{service.emoji}</div>
                <h3 className="text-2xl font-serif font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground">{service.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <Link to="/services">
              <Button size="lg" variant="outline" className="glass group">
                View All Services
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Home;
