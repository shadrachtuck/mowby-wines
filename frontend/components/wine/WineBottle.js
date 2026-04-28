import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Sparkles, Wine } from 'lucide-react';

const wineMessages = [
  {
    message: 'Bold, vibrant, and full of life - just like the journey ahead.',
    wine: 'First Crush 2025 Syrah',
    notes: ['Blackberry', 'Black Pepper', 'Smoke'],
  },
  {
    message: 'Natural, authentic, and crafted with love.',
    wine: 'First Crush 2025 Syrah',
    notes: ['Wild Berry', 'Earth', 'Spice'],
  },
  {
    message: 'Low intervention, high reward - the best things are simple.',
    wine: 'First Crush 2025 Syrah',
    notes: ['Dark Fruit', 'Herbs', 'Mineral'],
  },
];

// Figma no-background wine bottle asset (transparent)
const BOTTLE_IMAGE = 'https://www.figma.com/api/mcp/asset/bf822845-1d0f-40d9-b884-0adf58f17b50';

export default function WineBottle() {
  const [state, setState] = useState('unopened');
  const [currentMessage, setCurrentMessage] = useState(null);
  const [email, setEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);

  const uncorkBottle = () => {
    if (state !== 'unopened') return;

    setState('uncorking');
    const randomMessage = wineMessages[Math.floor(Math.random() * wineMessages.length)];
    setCurrentMessage(randomMessage);

    setTimeout(() => {
      setState('opened');
    }, 2500);
  };

  const handleSubmitEmail = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      const existingEmails = JSON.parse(localStorage.getItem('wineWaitlist') || '[]');
      localStorage.setItem(
        'wineWaitlist',
        JSON.stringify([...existingEmails, { email, timestamp: Date.now() }])
      );
      setState('joined');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-mowby-cream">
      <AnimatePresence mode="wait">
        {state === 'unopened' && (
          <motion.div
            key="unopened"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              duration: 0.6,
            }}
            className="flex flex-col items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ y: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
              onClick={uncorkBottle}
              className="cursor-pointer mb-8 w-full max-w-[640px] px-2"
            >
              <div className="relative">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-12 bg-black/10 rounded-full blur-lg" />
                <img src={BOTTLE_IMAGE} alt="First Crush 2025 Syrah" className="w-full h-auto relative z-10" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="absolute top-4 right-4"
                >
                  <Sparkles className="w-6 h-6 text-mowby-blue drop-shadow-lg" />
                </motion.div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                  className="absolute bottom-12 left-4"
                >
                  <Sparkles className="w-4 h-4 text-mowby-yellow drop-shadow-lg" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center relative max-w-md"
            >
              <motion.h1
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8, ease: 'backOut' }}
                className="text-4xl md:text-5xl mb-3 text-mowby-blue font-display relative z-10"
              >
                First Crush
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="text-gray-700 mb-4 relative z-10"
              >
                Tap the bottle to uncork your exclusive preview
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 }}
                className="relative z-10"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-[10px] bg-mowby-cream/90 backdrop-blur-sm shadow-mowby-soft"
                >
                  <Sparkles className="w-4 h-4 text-mowby-blue" />
                  <span className="text-sm text-gray-900 font-medium">
                    Limited release wine awaits
                  </span>
                  <Sparkles className="w-4 h-4 text-mowby-yellow" />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {state === 'uncorking' && (
          <motion.div
            key="uncorking"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 0.95, 1.05] }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{ rotate: [0, -3, 3, -2, 2, 0] }}
              transition={{ duration: 2.5, ease: 'easeInOut' }}
              className="relative mb-8 max-w-xs"
            >
              <div className="relative">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: Math.cos((i * Math.PI * 2) / 12) * 80,
                      y: Math.sin((i * Math.PI * 2) / 12) * 80 - 60,
                    }}
                    transition={{
                      duration: 1.5,
                      delay: 0.3 + i * 0.05,
                      ease: 'easeOut',
                    }}
                    className="absolute top-0 left-1/2 w-2 h-2 bg-mowby-blue rounded-full"
                  />
                ))}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 0.6, 0],
                    scale: [0, 2, 3],
                    y: [0, -50, -100],
                  }}
                  transition={{ duration: 2, delay: 0.5, ease: 'easeOut' }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-mowby-blue/20 rounded-full blur-md"
                />
                <img src={BOTTLE_IMAGE} alt="First Crush 2025 Syrah" className="w-full h-auto relative z-10" />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.7, 1] }}
              transition={{ duration: 2.5 }}
              className="text-gray-700 text-center"
            >
              Uncorking your exclusive preview...
            </motion.p>
          </motion.div>
        )}

        {state === 'opened' && currentMessage && !showEmailForm && (
          <motion.div
            key="opened"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              delay: 0.2,
            }}
            className="w-full max-w-md"
          >
            <Card className="p-8 bg-mowby-cream shadow-xl">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-6"
              >
                <motion.div
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: [0, 1.2, 1], rotate: [0, 10, 0] }}
                  transition={{ delay: 0.5, duration: 0.8, ease: 'backOut' }}
                  className="inline-block mb-4"
                >
                  <Wine className="w-12 h-12 text-mowby-blue" />
                </motion.div>

                <motion.h2
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.6, ease: 'backOut' }}
                  className="text-2xl md:text-3xl mb-4 text-gray-900 font-display"
                >
                  {currentMessage.wine}
                </motion.h2>
              </motion.div>

              <motion.blockquote
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-gray-700 mb-6 italic leading-relaxed"
              >
                &quot;{currentMessage.message}&quot;
              </motion.blockquote>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center mb-6"
              >
                <h3 className="text-sm text-gray-900 font-medium mb-3">Tasting Notes</h3>
                <div className="flex justify-center gap-2 flex-wrap">
                  {currentMessage.notes.map((note, index) => (
                    <motion.div
                      key={note}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 1 + index * 0.1,
                        type: 'spring',
                        stiffness: 500,
                        damping: 25,
                      }}
                      className="px-4 py-2 bg-blue-50 rounded-[10px] shadow-sm border border-blue-100"
                    >
                      <span className="text-mowby-blue font-medium text-sm">{note}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                <Link href="/shop" className="block">
                  <Button size="lg" className="w-full rounded-[10px] text-lg">
                    Reserve a Bottle
                  </Button>
                </Link>
              </motion.div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
