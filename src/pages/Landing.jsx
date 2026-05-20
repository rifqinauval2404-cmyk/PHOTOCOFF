import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const handleStart = () => navigate('/select-method');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background vignette effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-silk via-silk/95 to-silk/90 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(48,21,14,0.03)_100%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center space-y-4 max-w-xl mx-auto"
      >
        <h1 className="text-4xl md:text-[52px] font-bold text-blush tracking-tight leading-none uppercase font-serif">
          PhotoCoff
        </h1>
        <p className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-wood/80 font-sans font-semibold">
          Make a Beutiful Moments with us!
        </p>

        <div className="pt-8">
          <motion.button
            onClick={handleStart}
            whileHover={{ scale: 1.05, backgroundColor: "#25100a" }}
            whileTap={{ scale: 0.98 }}
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#30150E] text-white rounded-full font-sans text-[10px] md:text-xs font-bold tracking-widest transition-all shadow-xl shadow-wood/20"
          >
            GET STARTED
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </div>
      </motion.div>

      {/* Bottom Logo/Icon */}
      <div className="absolute bottom-12 flex flex-col items-center gap-4 opacity-30">
        <div className="w-8 h-8 border border-wood rounded-full flex items-center justify-center p-1.5">
          <div className="w-full h-full border border-wood rounded-full relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 bg-wood rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
