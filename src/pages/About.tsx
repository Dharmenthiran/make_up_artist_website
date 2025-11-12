import { motion } from "framer-motion";
import { Sparkles, Heart, Award, Users } from "lucide-react";
import ParticlesBackground from "@/components/ParticlesBackground";

const About = () => {
  const stats = [
    { icon: Heart, label: "Happy Clients", value: "500+" },
    { icon: Award, label: "Years Experience", value: "5+" },
    { icon: Users, label: "Weddings Done", value: "100+" },
  ];

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
            <span className="text-sm font-medium">About Me</span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
            <span className="gradient-text text-shadow-glow">Meet Sharmila</span>
          </h1>
        </motion.div>

        {/* About Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Image/Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[3/4] rounded-3xl glass overflow-hidden shadow-glass">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-gold-light via-primary to-gold opacity-70 flex items-center justify-center">
                <div className="text-center text-white">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="text-8xl mb-4"
                  >
                    💄
                  </motion.div>
                  <p className="text-2xl font-serif font-semibold">Art by Nila</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/30 rounded-full blur-2xl" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/30 rounded-full blur-2xl" />
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-8 shadow-glass">
              <h2 className="text-3xl font-serif font-bold mb-4">
                Hi, I'm <span className="gradient-text">Sharmila</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  A professional makeup artist based in Coimbatore, passionate about 
                  redefining beauty through elegance and creativity.
                </p>
                <p>
                  My artistry captures your natural glow for every occasion — from 
                  weddings to baby showers. I believe that makeup is not just about 
                  transformation, but about enhancing your inherent beauty and confidence.
                </p>
                <p>
                  With years of experience and a deep understanding of different skin 
                  tones and facial features, I create personalized looks that make you 
                  feel like the best version of yourself.
                </p>
                <p className="font-semibold text-foreground">
                  Let's create magic together and make your special moments unforgettable.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="glass rounded-2xl p-8 text-center shadow-glass hover:shadow-glow transition-all"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4"
              >
                <stat.icon className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-4xl font-bold gradient-text mb-2">{stat.value}</h3>
              <p className="text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-12 text-center shadow-glass"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            My <span className="gradient-text">Philosophy</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            "Every face tells a story, and every occasion is a chapter worth celebrating. 
            My mission is to bring out the radiance that lies within you, creating looks 
            that not only complement your features but also resonate with your personality 
            and the essence of your special moment."
          </p>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-8 text-5xl"
          >
            ✨
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
};

export default About;
