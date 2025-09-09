import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-image.jpg';
import GradientText from '@/components/ui/GradientText';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/motion';

const Hero = () => {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-background to-muted/30">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div className="text-center lg:text-left" variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true, amount: .2 }}>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              E-Waste <GradientText>Wise</GradientText> India
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Classify devices, learn impact, and find certified recycling centers.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button size="lg" className="bg-gradient-to-r from-brand-500 to-emerald-400 shadow-soft rounded-2xl"
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Try the Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-2xl" onClick={() => (window.location.href = '/education')}>
                Explore Education
              </Button>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div className="relative" variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true, amount: .2 }}>
            <div className="relative rounded-2xl overflow-hidden shadow-soft-lg">
              <img 
                src={heroImage}
                alt="Electronic devices including smartphones, laptops, and circuit boards arranged for e-waste recycling"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
            
            {/* Floating stats */}
            <div className="absolute -bottom-6 -left-6 bg-card rounded-xl p-4 shadow-soft-md border border-border">
              <div className="text-center">
                <div className="font-heading font-bold text-2xl text-primary">1000+</div>
                <div className="font-body text-sm text-muted-foreground">Images Trained</div>
              </div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-card rounded-xl p-4 shadow-soft-md border border-border">
              <div className="text-center">
                <div className="font-heading font-bold text-2xl text-primary">95%</div>
                <div className="font-body text-sm text-muted-foreground">Accuracy</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
