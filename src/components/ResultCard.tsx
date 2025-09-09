import { useState } from 'react';
import { MapPin, Download, Flag, RotateCcw, ExternalLink, AlertCircle, CheckCircle, Info, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import ImpactCard from './ImpactCard';
import SharingButtons from './SharingButtons';
import FlagCorrectForm from './FlagCorrectForm';
import impactFactorsData from '@/data/impact_factors.json';

interface ClassificationResult {
  class: string;
  confidence: number;
  rationale: string;
  advice: string;
  suggested_centres: Array<{
    city: string;
    name: string;
    maps: string;
  }>;
}

interface ResultCardProps {
  result: ClassificationResult;
  imageUrl: string | null;
  onNewClassification: () => void;
}

const ResultCard = ({ result, imageUrl, onNewClassification }: ResultCardProps) => {
  const [showFlagForm, setShowFlagForm] = useState(false);
  const [flagReason, setFlagReason] = useState('');

  const confidencePercentage = Math.round(result.confidence * 100);
  const impactData = impactFactorsData[result.class as keyof typeof impactFactorsData];
  
  const getConfidenceColor = () => {
    if (confidencePercentage >= 85) return 'text-primary';
    if (confidencePercentage >= 65) return 'text-yellow-600';
    return 'text-destructive';
  };

  const getConfidenceIcon = () => {
    if (confidencePercentage >= 85) return CheckCircle;
    if (confidencePercentage >= 65) return Info;
    return AlertCircle;
  };

  const handleDownloadReport = () => {
    // Mock PDF generation
    toast({
      title: "Report downloaded",
      description: "Classification report saved to your downloads.",
    });
  };

  const handleFlag = () => {
    if (flagReason.trim()) {
      // Mock flag submission
      toast({
        title: "Thank you for your feedback",
        description: "Your report will help improve our model.",
      });
      setShowFlagForm(false);
      setFlagReason('');
    }
  };

  const ConfidenceIcon = getConfidenceIcon();

  return (
    <div className="space-y-6">
      {/* Header with image and classification */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Image Preview */}
        {imageUrl && (
          <div className="space-y-3">
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Analyzed Image
            </h3>
            <div className="relative rounded-lg overflow-hidden shadow-soft-md">
              <img 
                src={imageUrl} 
                alt="Analyzed device"
                className="w-full h-48 object-cover"
              />
            </div>
          </div>
        )}

        {/* Classification Results */}
        <div className="space-y-4">
          <h3 className="font-heading font-semibold text-lg text-foreground">
            Classification Results
          </h3>
          
          {/* Device Type */}
          <div>
            <Badge variant="secondary" className="mb-2 text-base px-3 py-1">
              {result.class.charAt(0).toUpperCase() + result.class.slice(1)}
            </Badge>
          </div>

          {/* Confidence Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-body text-sm text-muted-foreground">Confidence</span>
              <div className={`flex items-center space-x-1 ${getConfidenceColor()}`}>
                <ConfidenceIcon className="h-4 w-4" />
                <span className="font-medium">{confidencePercentage}%</span>
              </div>
            </div>
            <Progress value={confidencePercentage} className="h-2" />
          </div>

          {/* Rationale */}
          <div>
            <p className="font-body text-sm text-muted-foreground">
              {result.rationale}
            </p>
          </div>
        </div>
      </div>

      {/* Environmental Impact Card */}
      <ImpactCard deviceClass={result.class} />

      {/* Disposal Advice */}
      <Card className="bg-muted/30 border-border">
        <CardHeader>
          <CardTitle className="font-heading font-semibold text-lg text-foreground flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-primary" />
            Disposal Advice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-body text-foreground leading-relaxed">
            {result.advice}
          </p>
        </CardContent>
      </Card>

      {/* Recycling Centers */}
      {result.suggested_centres && result.suggested_centres.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-heading font-semibold text-lg text-foreground flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-primary" />
              Recommended Recycling Centers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.suggested_centres.map((centre, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">{centre.name}</div>
                    <div className="text-sm text-muted-foreground">{centre.city}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(centre.maps, '_blank')}
                  >
                    <ExternalLink className="mr-1 h-4 w-4" />
                    View Map
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sharing Buttons */}
      <div className="mb-6">
        <h4 className="font-heading font-medium text-foreground mb-3 flex items-center">
          <Share2 className="mr-2 h-4 w-4 text-primary" />
          Share Your Results
        </h4>
        <SharingButtons 
          deviceClass={result.class}
          confidence={result.confidence}
          co2Saved={impactData?.co2_saved_kg}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={handleDownloadReport}
          variant="outline"
          className="flex-1 glass-button hover-lift"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Report (PDF)
        </Button>
        
        <Button 
          onClick={() => setShowFlagForm(!showFlagForm)}
          variant="outline"
          className="flex-1 glass-button hover-lift"
        >
          <Flag className="mr-2 h-4 w-4" />
          Flag & Correct
        </Button>
        
        <Button 
          onClick={onNewClassification}
          className="flex-1 bg-gradient-primary hover:opacity-90 text-primary-foreground hover-lift"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          New Classification
        </Button>
      </div>

      {/* Flag & Correct Form */}
      <FlagCorrectForm
        isOpen={showFlagForm}
        onClose={() => setShowFlagForm(false)}
        originalClass={result.class}
        originalConfidence={result.confidence}
      />
    </div>
  );
};

export default ResultCard;