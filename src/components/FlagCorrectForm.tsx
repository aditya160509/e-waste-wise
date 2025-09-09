import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, Upload, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import impactFactors from '@/data/impact_factors.json';

interface FlagCorrectFormProps {
  isOpen: boolean;
  onClose: () => void;
  originalClass?: string;
  originalConfidence?: number;
  title?: string;
}

// Derive categories from the list of impact objects. Each entry has a
// `label` property. We map to a capitalised string for display.
// Build an array of available device labels from the impact factors list.
const deviceCategories: string[] = (impactFactors as any[]).map((item: any) => item.label);

const FlagCorrectForm = ({ isOpen, onClose, originalClass, originalConfidence, title = "Flag & Correct Classification" }: FlagCorrectFormProps) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [reason, setReason] = useState('');
  const [correctedImage, setCorrectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf' || file.type.startsWith('text/'))) {
      setCorrectedImage(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please select an image, PDF, or text file.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    if (!selectedCategory || !reason.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Mock API submission - replace with actual webhook/API endpoint
    const submissionData = {
      originalClass: originalClass || 'unknown',
      originalConfidence: originalConfidence || 0,
      correctedClass: selectedCategory,
      reason: reason,
      timestamp: new Date().toISOString(),
      hasImage: !!correctedImage,
      fileName: correctedImage?.name
    };

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, send to Google Sheets/Airtable webhook:
      // const formData = new FormData();
      // formData.append('data', JSON.stringify(submissionData));
      // if (correctedImage) formData.append('file', correctedImage);
      // const response = await fetch('https://webhook-url/submit-correction', {
      //   method: 'POST',
      //   body: formData
      // });

      console.log('Submission data:', submissionData);
      
      toast({
        title: "Thanks! Your input helps us improve.",
        description: "Your feedback has been submitted successfully.",
      });

      // Analytics tracking placeholder
      if (window.gtag) {
        window.gtag('event', 'flag_submission', {
          original_class: originalClass || 'unknown',
          corrected_class: selectedCategory,
          confidence: originalConfidence || 0
        });
      }

      // Reset form
      setSelectedCategory('');
      setReason('');
      setCorrectedImage(null);
      onClose();
    } catch (error) {
      toast({
        title: "Something went wrong. Please try again.",
        description: "Unable to submit your feedback at this time.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="glass-card border-primary/20 bg-primary/5 dark:bg-primary/10">
            <CardHeader>
              <CardTitle className="font-heading font-medium text-foreground flex items-center justify-between">
                <div className="flex items-center">
                  <Flag className="mr-2 h-5 w-5 text-primary" />
                  {title}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="glass-button h-8 w-8"
                  aria-label="Close form"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Classification Info */}
              {originalClass && originalConfidence && (
                <motion.div 
                  className="glass-panel p-3 rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-sm text-muted-foreground">
                    Current classification: <span className="font-medium text-foreground">{originalClass}</span> 
                    ({Math.round(originalConfidence * 100)}% confidence)
                  </p>
                </motion.div>
              )}

              {/* Correct Category Dropdown */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <label className="text-sm font-medium text-foreground" htmlFor="category-select">
                  Device category *
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger 
                    className="glass-panel border-0 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    id="category-select"
                    aria-label="Select device category"
                  >
                    <SelectValue placeholder="Select the correct category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceCategories.map((category) => {
                      // Format the label for display by replacing underscores and capitalising words
                      const display = category
                        .split('_')
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(' ');
                      return (
                        <SelectItem key={category} value={category}>
                          {display}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </motion.div>

              {/* Reason Text Area */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.2 }}
              >
                <label className="text-sm font-medium text-foreground" htmlFor="reason-input">
                  Comments/Reason *
                </label>
                <Textarea
                  id="reason-input"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please describe the issue or provide additional context..."
                  className="glass-panel border-0 resize-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  rows={3}
                  aria-label="Comments or reason for correction"
                />
              </motion.div>

              {/* Optional File Upload */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.3 }}
              >
                <label className="text-sm font-medium text-foreground" htmlFor="file-upload">
                  Upload supporting file (optional)
                </label>
                <div className="glass-panel p-3 rounded-lg">
                  <Input
                    id="file-upload"
                    type="file"
                    accept="image/*,application/pdf,text/*"
                    onChange={handleFileChange}
                    className="border-0 bg-transparent focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Upload file (PDF, image, or text)"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Accepts: Images, PDFs, Text files
                  </p>
                  {correctedImage && (
                    <p className="text-xs text-primary mt-1">
                      ✓ {correctedImage.name} selected
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                className="flex gap-3 pt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.4 }}
              >
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || !selectedCategory || !reason.trim()}
                  className="bg-gradient-primary hover:opacity-90 text-primary-foreground flex-1 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Submit correction"
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit
                    </>
                  )}
                </Button>
                <Button 
                  onClick={onClose}
                  variant="outline"
                  className="glass-button focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Cancel"
                >
                  Cancel
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FlagCorrectForm;