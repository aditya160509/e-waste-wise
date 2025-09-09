import { Leaf, Github, Shield, FileText } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-ink-900 to-slate-900 text-secondary-foreground border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary p-2 rounded-lg">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-xl">
                E-Waste Classifier
              </span>
            </div>
            <p className="font-body text-secondary-foreground/80 mb-4 leading-relaxed">
              AI-powered e-waste classification tool helping Indians make responsible recycling decisions. 
              Built with privacy and environmental consciousness at its core.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 font-body text-sm">
              <li>
                <a href="#home" className="text-secondary-foreground/80 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-secondary-foreground/80 hover:text-white transition-colors">
                  How it Works
                </a>
              </li>
              <li>
                <a href="#recycling-centers" className="text-secondary-foreground/80 hover:text-white transition-colors">
                  Recycling Centers
                </a>
              </li>
              <li>
                <a href="#methodology" className="text-secondary-foreground/80 hover:text-white transition-colors">
                  Methodology
                </a>
              </li>
            </ul>
          </div>

          {/* Legal and Resources */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2 font-body text-sm">
              <li>
                <a href="#" className="text-secondary-foreground/80 hover:text-white transition-colors flex items-center">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub Repository
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-foreground/80 hover:text-white transition-colors flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-foreground/80 hover:text-white transition-colors flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Terms of Service
                </a>
              </li>
              <li>
                <button 
                  className="text-secondary-foreground/80 hover:text-white transition-colors text-left text-sm"
                  onClick={() => {
                    // Mock delete image functionality
                    alert('Image deletion requested');
                  }}
                >
                  Delete My Image
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="font-body text-secondary-foreground/60 text-sm">
              © {currentYear} E-Waste Classifier. Built for a sustainable future.
            </p>
            <p className="font-body text-secondary-foreground/60 text-sm mt-2 md:mt-0">
              Powered by AI • Made in India 🇮🇳
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
