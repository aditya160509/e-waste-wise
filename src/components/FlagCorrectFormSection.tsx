import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FlagCorrectForm from './FlagCorrectForm';

const FlagCorrectFormSection = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <motion.section 
      className="py-16 bg-background"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 1.0 }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.1 }}
        >
          <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground mb-4">
            Help Us Improve
          </h2>
          <p className="font-body text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Found incorrect information or have suggestions? Your feedback helps us provide better e-waste education and classification.
          </p>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={() => setIsFormOpen(true)}
              variant="outline"
              size="lg"
              className="glass-button border-primary/20 hover:border-primary/40"
            >
              <Flag className="mr-2 h-5 w-5" />
              Submit Feedback
            </Button>
          </motion.div>
        </motion.div>

        {/* Flag & Correct Form */}
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="mt-8"
          >
            <FlagCorrectForm 
              isOpen={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              title="Submit Feedback & Corrections"
            />
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default FlagCorrectFormSection;