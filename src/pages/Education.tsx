import facts from '@/data/facts.json';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FlagCorrectForm from '@/components/FlagCorrectForm';
import { useRef, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import FlashCard from '@/components/FlashCard';
import DidYouKnowFab from '@/components/DidYouKnowFab';
import DidYouKnowPanel from '@/components/DidYouKnowPanel';

// Group facts into themed sections. Each section receives
// exactly two facts for a balanced layout. If facts.json
// changes, update the IDs accordingly.
const pick = (ids: number[]) => facts.filter((f) => ids.includes(f.id));

const sections = [
  {
    title: 'Global Perspective',
    items: pick([1, 10]),
  },
  {
    title: 'Energy & Resource Savings',
    items: pick([2, 5]),
  },
  {
    title: 'Device Footprints & Choices',
    items: pick([3, 4]),
  },
  {
    title: 'India: Reality & Progress',
    items: pick([6, 7, 8, 9]),
  },
];

const FlagCorrectFormSection = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  return (
    <motion.section
      className="py-16 bg-background"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground mb-4">
            Help Us Improve
          </h2>
          <p className="font-body text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Found incorrect information or have suggestions? Your feedback helps us provide better e-waste education and classification.
          </p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-4 py-2 rounded border border-primary/20 hover:border-primary/40 bg-background text-primary"
            >
              Submit Feedback
            </button>
          </motion.div>
        </motion.div>
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

const palette: Array<NonNullable<Parameters<typeof FlashCard>[0]['color']>> = [
  'emerald', 'indigo', 'amber', 'rose', 'teal', 'violet'
];

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2
      className="
        text-center
        mx-auto
        max-w-3xl
        text-2xl md:text-3xl
        font-bold tracking-tight
        text-foreground
        mb-4
      "
    >
      {children}
    </h2>
  );
}

const Section = ({ title, items }: { title: string; items: typeof facts }) => {
  if (!items.length) return null;
  return (
    <section className="py-12">
      <SectionTitle>{title}</SectionTitle>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 mt-2">
          {items.map((f, idx) => (
            <FlashCard key={f.id} fact={f.fact} icon={f.icon} color={palette[idx % palette.length]} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default function Education() {
  const [open, setOpen] = useState(false);
  const fabRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-8 pb-16">
        {/* Header */}
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-foreground mb-3">
            E‑Waste Education
          </h1>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn about electronic waste and its environmental impact through concise facts and insights.
          </p>
        </motion.div>

        {/* Fact Sections */}
        {sections.map((section) => (
          <Section key={section.title} title={section.title} items={section.items} />
        ))}

        {/* Feedback Section */}
        <FlagCorrectFormSection />
      </main>
      {/* Did you know FAB and Panel */}
      <DidYouKnowFab ref={fabRef} onOpen={() => setOpen(true)} />
      <DidYouKnowPanel open={open} onOpenChange={setOpen} returnFocusRef={fabRef} />
      <Footer />
    </div>
  );
}
