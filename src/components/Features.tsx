import { Zap, Target, Flag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Features = () => {
  const features = [
    {
      icon: Zap,
      title: 'Instant Classification',
      description: 'Upload a photo and get immediate AI-powered identification of your electronic device type with confidence scores.',
      color: 'text-primary'
    },
    {
      icon: Target,
      title: 'India-Specific Disposal',
      description: 'Receive tailored recycling guidance based on Indian regulations and find authorized e-waste centers near you.',
      color: 'text-secondary'
    },
    {
      icon: Flag,
      title: 'Flag Incorrect Predictions',
      description: 'Help improve the model by reporting misclassifications. Your feedback makes the system better for everyone.',
      color: 'text-primary'
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
            Smart E-Waste Management
          </h2>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI-powered platform makes responsible e-waste disposal simple, accurate, and accessible for everyone in India.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="bg-gradient-card border-border shadow-soft-sm hover:shadow-soft-md transition-shadow duration-300 group"
              >
                <CardHeader className="text-center pb-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="font-heading font-semibold text-xl text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-body text-muted-foreground text-center leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;