import { Upload, Cpu, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      step: '1',
      title: 'Upload Photo',
      description: 'Take or upload a clear photo of your electronic device'
    },
    {
      icon: Cpu,
      step: '2', 
      title: 'AI Classification',
      description: 'Our model analyzes the image and predicts the device type'
    },
    {
      icon: CheckCircle,
      step: '3',
      title: 'Follow Advice',
      description: 'Get recycling guidance and locate authorized centers'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
            How It Works
          </h2>
          <p className="font-body text-xl text-muted-foreground">
            Three simple steps to responsible e-waste disposal
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary to-primary/30 transform translate-x-8"></div>
                )}
                
                {/* Step circle */}
                <div className="relative z-10 inline-flex items-center justify-center w-24 h-24 bg-gradient-primary rounded-full mb-6 shadow-soft-md">
                  <Icon className="h-10 w-10 text-primary-foreground" />
                </div>
                
                {/* Step number */}
                <div className="absolute top-0 right-1/2 transform translate-x-6 -translate-y-2 bg-secondary text-secondary-foreground rounded-full w-8 h-8 flex items-center justify-center font-heading font-bold text-sm">
                  {step.step}
                </div>

                <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="font-body text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;