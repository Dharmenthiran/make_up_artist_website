import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import ParticlesBackground from "@/components/ParticlesBackground";

const Gallery = () => {
  // Placeholder for gallery images - in production, these would be actual images
  const galleryItems = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    category: ["Bridal", "Reception", "Engagement", "Hairstyle"][i % 4],
  }));

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
            <span className="text-sm font-medium">Our Work</span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
            <span className="gradient-text text-shadow-glow">Gallery</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our portfolio of beautiful transformations and memorable moments
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="group relative aspect-square rounded-2xl overflow-hidden glass shadow-glass hover:shadow-glow transition-all cursor-pointer"
            >
              {/* Placeholder gradient backgrounds */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${
                  index % 4 === 0 ? "from-rose-gold-light to-primary" :
                  index % 4 === 1 ? "from-primary to-gold" :
                  index % 4 === 2 ? "from-gold to-rose-gold" :
                  "from-secondary to-accent"
                } opacity-60`}
              />
              
              {/* Overlay with category */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    className="space-y-2"
                  >
                    <p className="text-white font-semibold text-lg">{item.category}</p>
                    <div className="h-px w-20 bg-white/60 mx-auto" />
                  </motion.div>
                </div>
              </div>

              {/* Coming soon badge for placeholder */}
              <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full text-xs">
                Portfolio #{item.id}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Note about gallery */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-8 mt-16 text-center"
        >
          <p className="text-muted-foreground">
            📸 Gallery images coming soon! Follow us on Instagram{" "}
            <a 
              href="https://instagram.com/sharmi_artbynila" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              @sharmi_artbynila
            </a>
            {" "}to see our latest work
          </p>
        </motion.div>
      </div>
    </main>
  );
};

export default Gallery;
