import { motion } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ParticlesBackground from "@/components/ParticlesBackground";
import ImageLightbox from "@/components/ImageLightbox";
import { Button } from "@/components/ui/button";

type GalleryImage = {
  id: string;
  gallery_item_id: string;
  image_url: string;
  display_order: number;
};

type GalleryItem = {
  id: string;
  header: string;
  image_url: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
  gallery_images?: GalleryImage[];
};

const Gallery = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [currentImageIndexes, setCurrentImageIndexes] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchGalleryItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchGalleryItems = async () => {
    setLoading(true);
    
    try {
      let itemsQuery = supabase
        .from("gallery_items")
        .select(`
          *,
          gallery_images(*)
        `)
        .order("created_at", { ascending: false });

      if (filter) {
        itemsQuery = itemsQuery.eq("header", filter);
      }

      const { data, error } = await itemsQuery;

      if (!error && data) {
        // Sort gallery_images by display_order
        const itemsWithSortedImages = data.map((item: any) => ({
          ...item,
          gallery_images: item.gallery_images?.sort(
            (a: GalleryImage, b: GalleryImage) => a.display_order - b.display_order
          ) || []
        }));
        setGalleryItems(itemsWithSortedImages);
      }
    } catch (error) {
      console.error("Error fetching gallery items:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAllImages = (item: GalleryItem): string[] => {
    const images = [item.image_url];
    if (item.gallery_images && item.gallery_images.length > 0) {
      images.push(...item.gallery_images.map(img => img.image_url));
    }
    return images;
  };

  const openLightbox = (item: GalleryItem, imageIndex: number) => {
    const images = getAllImages(item);
    setLightboxImages(images);
    setLightboxIndex(imageIndex);
    setLightboxOpen(true);
  };

  const handleNextImage = (itemId: string, totalImages: number) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [itemId]: ((prev[itemId] || 0) + 1) % totalImages
    }));
  };

  const handlePreviousImage = (itemId: string, totalImages: number) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [itemId]: ((prev[itemId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  const getCurrentImageIndex = (itemId: string) => {
    return currentImageIndexes[itemId] || 0;
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
              {galleryItems.map((item, index) => {
                const allImages = getAllImages(item);
                const currentIndex = getCurrentImageIndex(item.id);
                const currentImage = allImages[currentIndex];

                return (
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

                    {/* Image with Navigation */}
                    <div className="relative aspect-square overflow-hidden group">
                      <motion.img
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        src={currentImage}
                        alt={item.header}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => openLightbox(item, currentIndex)}
                      />
                      
                      {/* Navigation Arrows - Show only if multiple images */}
                      {allImages.length > 1 && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreviousImage(item.id, allImages.length);
                            }}
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNextImage(item.id, allImages.length);
                            }}
                          >
                            <ChevronRight className="w-5 h-5" />
                          </Button>
                          
                          {/* Image Counter */}
                          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            {currentIndex + 1} / {allImages.length}
                          </div>
                        </>
                      )}
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
                );
              })}
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

      {/* Image Lightbox */}
      <ImageLightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </main>
  );
};

export default Gallery;
