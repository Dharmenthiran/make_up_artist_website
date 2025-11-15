import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit, LogOut, Upload, X, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import ImageLightbox from "@/components/ImageLightbox";

const serviceHeaders = [
  "Wedding Makeup",
  "Reception Makeup",
  "Baby Shower Makeup",
  "Engagement Makeup",
  "Guest Makeup",
  "Saree Draping",
  "Saree Pre-Pleating",
  "Hairstyle",
  "Certificates",
];

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

type ImagePreview = {
  file: File;
  preview: string;
  isMain: boolean;
};

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  
  // Form state
  const [selectedHeader, setSelectedHeader] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [currentImageIndexes, setCurrentImageIndexes] = useState<Record<string, number>>({});

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchGalleryItems();
    }
  }, [isAdmin]);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/admin/login");
        return;
      }

      setUser(session.user);

      // Check if user is admin
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .single();

      if (!roleData) {
        toast.error("Access denied. Admin only.");
        navigate("/");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error("Auth error:", error);
      navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchGalleryItems = async () => {
    const { data, error } = await supabase
      .from("gallery_items")
      .select(`
        *,
        gallery_images(*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch gallery items");
      return;
    }

    const itemsWithSortedImages = (data || []).map((item: any) => ({
      ...item,
      gallery_images: item.gallery_images?.sort(
        (a: GalleryImage, b: GalleryImage) => a.display_order - b.display_order
      ) || []
    }));

    setGalleryItems(itemsWithSortedImages);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPreviews: ImagePreview[] = Array.from(files).map((file, index) => ({
        file,
        preview: URL.createObjectURL(file),
        isMain: imagePreviews.length === 0 && index === 0 // First image is main by default
      }));
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index].preview);
    newPreviews.splice(index, 1);
    
    // If removed image was main, set first image as main
    if (newPreviews.length > 0 && !newPreviews.some(p => p.isMain)) {
      newPreviews[0].isMain = true;
    }
    
    setImagePreviews(newPreviews);
  };

  const setMainImage = (index: number) => {
    const newPreviews = imagePreviews.map((preview, i) => ({
      ...preview,
      isMain: i === index
    }));
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedHeader || !description) {
      toast.error("Please fill all fields");
      return;
    }

    if (!editingItem && imagePreviews.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    setLoading(true);

    try {
      // Find main image or use first one
      const mainImagePreview = imagePreviews.find(p => p.isMain) || imagePreviews[0];
      let mainImageUrl = editingItem?.image_url || "";

      if (editingItem) {
        // Update existing item
        // If there are new images, upload the main one
        if (imagePreviews.length > 0 && mainImagePreview) {
          const fileExt = mainImagePreview.file.name.split(".").pop();
          const fileName = `${Math.random()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from("gallery")
            .upload(fileName, mainImagePreview.file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from("gallery")
            .getPublicUrl(fileName);

          mainImageUrl = publicUrl;
        }

        const { error } = await supabase
          .from("gallery_items")
          .update({
            header: selectedHeader,
            description,
            image_url: mainImageUrl,
          })
          .eq("id", editingItem.id);

        if (error) throw error;

        // Delete old additional images
        await supabase
          .from("gallery_images")
          .delete()
          .eq("gallery_item_id", editingItem.id);

        // Upload additional images
        const additionalImages = imagePreviews.filter(p => !p.isMain);
        for (let i = 0; i < additionalImages.length; i++) {
          const preview = additionalImages[i];
          const fileExt = preview.file.name.split(".").pop();
          const fileName = `${Math.random()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("gallery")
            .upload(fileName, preview.file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from("gallery")
            .getPublicUrl(fileName);

          await supabase
            .from("gallery_images")
            .insert({
              gallery_item_id: editingItem.id,
              image_url: publicUrl,
              display_order: i + 1
            });
        }

        toast.success("Gallery item updated!");
      } else {
        // Create new item - upload main image
        if (!mainImagePreview) throw new Error("No main image selected");

        const fileExt = mainImagePreview.file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("gallery")
          .upload(fileName, mainImagePreview.file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("gallery")
          .getPublicUrl(fileName);

        mainImageUrl = publicUrl;

        // Insert gallery item
        const { data: newItem, error } = await supabase
          .from("gallery_items")
          .insert({
            header: selectedHeader,
            description,
            image_url: mainImageUrl,
          })
          .select()
          .single();

        if (error) throw error;

        // Upload additional images
        const additionalImages = imagePreviews.filter(p => !p.isMain);
        for (let i = 0; i < additionalImages.length; i++) {
          const preview = additionalImages[i];
          const fileExt = preview.file.name.split(".").pop();
          const fileName = `${Math.random()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("gallery")
            .upload(fileName, preview.file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from("gallery")
            .getPublicUrl(fileName);

          await supabase
            .from("gallery_images")
            .insert({
              gallery_item_id: newItem.id,
              image_url: publicUrl,
              display_order: i + 1
            });
        }

        toast.success("Gallery item added!");
      }

      // Reset form
      setShowForm(false);
      setEditingItem(null);
      setSelectedHeader("");
      setDescription("");
      imagePreviews.forEach(p => URL.revokeObjectURL(p.preview));
      setImagePreviews([]);
      fetchGalleryItems();
    } catch (error: any) {
      toast.error(error.message || "Failed to save item");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setSelectedHeader(item.header);
    setDescription(item.description || "");
    setImagePreviews([]); // Clear previews for edit mode
    setShowForm(true);
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    const { error } = await supabase
      .from("gallery_items")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete item");
      return;
    }

    toast.success("Item deleted!");
    fetchGalleryItems();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* New Upload Button */}
        {!showForm && (
          <Button
            onClick={() => {
              setShowForm(true);
              setEditingItem(null);
              setSelectedHeader("");
              setDescription("");
              setImagePreviews([]);
            }}
            className="mb-8"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Upload
          </Button>
        )}

        {/* Upload Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 mb-8"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-serif font-bold">
                {editingItem ? "Edit Item" : "Upload New Item"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Service Header</label>
                <Select value={selectedHeader} onValueChange={setSelectedHeader}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceHeaders.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Images</label>
                <label className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 w-fit">
                    <Upload className="w-4 h-4" />
                    {imagePreviews.length === 0 ? "Choose Images" : "Add More Images"}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {/* Image Previews Grid */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        
                        {/* Main Image Badge */}
                        {preview.isMain && (
                          <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            Main
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {!preview.isMain && (
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              onClick={() => setMainImage(index)}
                            >
                              <Star className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => removeImage(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Click the star to set a main image. Main image appears first in the gallery.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description..."
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingItem ? "Update" : "Upload"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingItem(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Gallery Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => {
            const allImages = getAllImages(item);
            const currentIndex = getCurrentImageIndex(item.id);
            const currentImage = allImages[currentIndex];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="overflow-hidden">
                  <div className="relative aspect-square group">
                    <img
                      src={currentImage}
                      alt={item.header}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => openLightbox(item, currentIndex)}
                    />
                    
                    {/* Navigation Arrows */}
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
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          {currentIndex + 1} / {allImages.length}
                        </div>
                      </>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.header}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {item.description}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {galleryItems.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            No gallery items yet. Click "New Upload" to add one!
          </div>
        )}
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};

export default Admin;
