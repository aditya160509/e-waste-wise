import { Shield, Database, MapPin } from 'lucide-react';

const TrustBadges = () => {
  const badges = [
    {
      icon: Database,
      title: 'Trained on 1k+ images',
      description: 'Comprehensive dataset of Indian e-waste items'
    },
    {
      icon: MapPin,
      title: 'India-focused disposal guidance',
      description: 'Localized recycling center recommendations'
    },
    {
      icon: Shield,
      title: 'Secure Hosted Model',
      description: 'Privacy-focused AI classification'
    }
  ];

  return (
    <section className="bg-card/50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div 
                key={index}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                  {badge.title}
                </h3>
                <p className="font-body text-muted-foreground">
                  {badge.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;