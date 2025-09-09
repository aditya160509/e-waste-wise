import { motion } from 'framer-motion';
import { Share2, MessageCircle, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface SharingButtonsProps {
  deviceClass: string;
  confidence: number;
  co2Saved?: number;
}

const SharingButtons = ({ deviceClass, confidence, co2Saved }: SharingButtonsProps) => {
  const shareText = `I just classified my ${deviceClass} using AI-powered E-Waste Classifier! ${Math.round(confidence * 100)}% confidence. ${co2Saved ? `Potential CO₂ savings: ${co2Saved}kg.` : ''} Help protect our environment! 🌱`;
  
  const shareUrl = window.location.origin;

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(url, '_blank');
    
    // Analytics tracking placeholder
    if (window.gtag) {
      window.gtag('event', 'share', {
        method: 'whatsapp',
        content_type: 'result',
        item_id: deviceClass
      });
    }
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
    
    // Analytics tracking placeholder
    if (window.gtag) {
      window.gtag('event', 'share', {
        method: 'twitter',
        content_type: 'result',
        item_id: deviceClass
      });
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      toast({
        title: "Copied to clipboard!",
        description: "Share this with your friends to spread awareness."
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05, y: -2 },
    tap: { scale: 0.95 }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
        <Button
          onClick={handleWhatsAppShare}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white glass-button"
          size="sm"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          WhatsApp
        </Button>
      </motion.div>

      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
        <Button
          onClick={handleTwitterShare}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white glass-button"
          size="sm"
        >
          <Twitter className="mr-2 h-4 w-4" />
          Twitter
        </Button>
      </motion.div>

      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
        <Button
          onClick={handleCopyLink}
          variant="outline"
          className="flex-1 glass-button"
          size="sm"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Copy Link
        </Button>
      </motion.div>
    </div>
  );
};

export default SharingButtons;