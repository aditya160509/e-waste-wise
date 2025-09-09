import { useState, useEffect } from 'react';
import { BookOpen, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle,
  DrawerClose,
  DrawerDescription 
} from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import factsData from '@/data/facts.json';
import * as LucideIcons from 'lucide-react';

interface EducationalDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const EducationalDrawer = ({ isOpen, onOpenChange }: EducationalDrawerProps) => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  const currentFact = factsData[currentFactIndex];

  // Auto-rotate facts every 5 seconds
  useEffect(() => {
    if (!isAutoRotating || !isOpen) return;

    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % factsData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoRotating, isOpen]);

  // Get the Lucide icon component
  const IconComponent = currentFact?.icon 
    ? (LucideIcons as any)[currentFact.icon] || LucideIcons.Info
    : LucideIcons.Info;

  const handleNext = () => {
    setIsAutoRotating(false);
    setCurrentFactIndex((prev) => (prev + 1) % factsData.length);
  };

  const handlePrevious = () => {
    setIsAutoRotating(false);
    setCurrentFactIndex((prev) => (prev - 1 + factsData.length) % factsData.length);
  };

  return (
    <>
      {/* Toggle Button - positioned at bottom right of demo section */}
      <Button
        onClick={() => onOpenChange(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-soft-lg animate-pulse"
        size="lg"
        aria-label="Open educational facts"
      >
        <BookOpen className="mr-2 h-5 w-5" />
        Did you know?
      </Button>

      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent 
          className="h-[400px]"
          aria-modal="true"
          role="dialog"
          aria-labelledby="educational-drawer-title"
        >
          <DrawerHeader className="text-center pb-2">
            <DrawerTitle id="educational-drawer-title" className="font-heading text-xl text-foreground">
              E-Waste Education
            </DrawerTitle>
            <DrawerDescription className="text-muted-foreground">
              Learn about electronic waste and its environmental impact
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 p-6 flex flex-col items-center justify-center space-y-6">
            {/* Fact Card */}
            <div className="bg-muted/30 rounded-lg p-6 max-w-2xl mx-auto text-center space-y-4 animate-fade-in">
              <div className="flex justify-center">
                <div className="bg-primary/10 rounded-full p-3">
                  <IconComponent className="h-8 w-8 text-primary" />
                </div>
              </div>
              
              <p className="font-body text-foreground leading-relaxed text-lg">
                {currentFact?.fact}
              </p>
              
              <Badge variant="secondary" className="font-medium">
                Fact {currentFactIndex + 1} of {factsData.length}
              </Badge>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                aria-label="Previous fact"
              >
                Previous
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className={isAutoRotating ? 'bg-primary/10' : ''}
              >
                {isAutoRotating ? 'Pause' : 'Auto-play'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                aria-label="Next fact"
              >
                Next
              </Button>
            </div>

            {/* Progress dots */}
            <div className="flex space-x-2">
              {factsData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentFactIndex(index);
                    setIsAutoRotating(false);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentFactIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                  aria-label={`Go to fact ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <DrawerClose asChild>
            <Button 
              variant="outline" 
              className="mx-6 mb-6"
              aria-label="Close educational facts"
            >
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
          </DrawerClose>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default EducationalDrawer;