import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flag, MapPin, Phone, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FlagCorrectForm from './FlagCorrectForm';
import recyclingCenters from '@/data/recycling_centers_in.json';

const RecyclingCenterFormSection = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <motion.section 
      className="py-16 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* All Recycling Centers */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground mb-6 text-center">
            All Recycling Centers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recyclingCenters.map((center, index) => (
              <motion.div
                key={center.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="glass-card h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                          {center.name}
                        </h3>
                        {center.verified && (
                          <Badge className="bg-green-100 text-green-800 mb-2">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-start text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-foreground">{center.city}, {center.state}</div>
                          <div>{center.address}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span>{center.phone}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-sm font-medium text-foreground mb-2">Accepts:</div>
                      <div className="flex flex-wrap gap-1">
                        {center.types.map(type => (
                          <Badge key={type} variant="secondary" className="text-xs">
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full glass-button"
                      onClick={() => window.open(center.maps, '_blank', 'noopener,noreferrer')}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on Map
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Add/Update Form Section */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground mb-4">
            Know a Better Center?
          </h2>
          <p className="font-body text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Help us expand our database of recycling centers. Submit information about centers not listed here or report outdated details.
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
              Add/Update Center
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
              title="Add/Update Recycling Center"
            />
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default RecyclingCenterFormSection;