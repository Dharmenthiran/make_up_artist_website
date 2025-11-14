import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ParticlesBackground from "@/components/ParticlesBackground";

type GalleryItem = {
  id: string;
  header: string;
  image_url: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
};

const Gallery = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("service");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchGalleryItems = async () => {
    setLoading(true);
    
    try {
      let data: any = null;
      let error: any = null;

      if (filter) {
        // @ts-ignore - Supabase query builder creates deep type nesting
        const result = await supabase
          .from("gallery_items")
          .select("*")
          .eq("header", filter)
          .order("created_at", { ascending: false });
        data = result.data;
        error = result.error;
      } else {
        // @ts-ignore - Supabase query builder creates deep type nesting
        const result = await supabase
          .from("gallery_items")
          .select("*")
          .order("created_at", { ascending: false });
        data = result.data;
        error = result.error;
      }

      if (!error && data) {
        setGalleryItems(data);
      }
    } catch (error) {
      console.error("Error fetching gallery items:", error);
    } finally {
      setLoading(false);
    }
  };

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
            <span className="gradient-text text-shadow-glow">
              {filter ? `${filter} Gallery` : "Gallery"}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {filter 
              ? `Explore our ${filter} portfolio`
              : "Explore our portfolio of beautiful transformations and memorable moments"}
          </p>
        </motion.div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : galleryItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleryItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="glass rounded-2xl overflow-hidden shadow-glass hover:shadow-glow transition-all"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-primary to-accent p-4">
                    <h3 className="text-lg font-semibold text-white text-center">
                      {item.header}
                    </h3>
                  </div>

                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      src={item.image_url}
                      alt={item.header}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Description */}
                  {item.description && (
                    <div className="p-4">
                      <p className="text-muted-foreground text-sm text-center leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-8 mt-16 text-center shadow-glass"
            >
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
                Love What You See?
              </h2>
              <p className="text-muted-foreground mb-6">
                Let's create your perfect look together!
              </p>
              <a 
                href="https://wa.me/916382489272" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full font-semibold shadow-glow hover:shadow-xl transition-all"
                >
                  WhatsApp Me
                </motion.button>
              </a>
            </motion.div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              {filter 
                ? `No ${filter} gallery items yet. Check back soon!`
                : "No gallery items yet. Check back soon!"}
            </p>
          </div>
        )}

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
