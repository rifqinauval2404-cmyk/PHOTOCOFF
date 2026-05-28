import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Camera, Trash2, RefreshCw, Film, Sparkles, Heart, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePhotography } from '../context/PhotographyContext';

const handleDownloadSingle = (dataUrl, name) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  const timestamp = Date.now();
  link.download = `${name}-${timestamp}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const Recap = () => {
  const navigate = useNavigate();
  const { photos, deletedPhotos, retakenPhotos, resetAll } = usePhotography();
  
  // Slideshow state
  const [currentIndex, setCurrentIndex] = useState(0);

  // Autoplay slideshow loop at rapid speed (450ms) for "Live Photo" loop
  useEffect(() => {
    if (photos.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }, 450);

    return () => clearInterval(interval);
  }, [photos]);

  const handleStartOver = () => {
    resetAll();
    navigate('/');
  };

  // Safe checks if page accessed directly
  const hasPhotos = photos && photos.length > 0;

  // Combine deleted and retaken photos into unselected list
  const unselectedPhotos = [
    ...(deletedPhotos || []).map((p, i) => ({ src: p, label: `Deleted #${i + 1}`, type: 'deleted' })),
    ...(retakenPhotos || []).map((p, i) => ({ src: p, label: `Retaken #${i + 1}`, type: 'retaken' }))
  ];

  return (
    <div className="min-h-screen bg-silk text-wood font-sans py-6 sm:py-10 md:py-16 px-4 sm:px-6 relative overflow-y-auto flex flex-col items-center justify-start">
      {/* Decorative background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-40 mix-blend-overlay z-0"
        style={{ backgroundImage: "url('/bg_landingpage.png')" }}
      />

      <div className="max-w-4xl w-full space-y-8 sm:space-y-12 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2 sm:space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-wood/5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#91545B] border border-wood/5">
            <Sparkles className="w-3 h-3 text-[#91545B]" />
            Session Complete
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-wood tracking-tight">
            Digital Recap & Memory
          </h1>
          <p className="text-wood/65 text-xs sm:text-sm max-w-md mx-auto font-sans leading-relaxed">
            Your beautiful captured moments! Save your frame or download individual snaps below.
          </p>
          <div className="h-[1px] w-12 bg-[#91545B]/30 mx-auto mt-4" />
        </motion.div>

        {!hasPhotos ? (
          /* Empty Session State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FAF0E6]/90 backdrop-blur-md rounded-[28px] p-8 text-center border border-wood/10 max-w-md mx-auto shadow-xl space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-[#FCE6DF] flex items-center justify-center mx-auto text-[#91545B]">
              <Film className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-bold">No Photos Found</h2>
              <p className="text-sm text-wood/65 leading-relaxed font-sans">
                It looks like you don't have any photos from this session yet. Let's take some beautiful shots!
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStartOver}
              className="w-full py-3.5 bg-[#30150E] text-white rounded-full font-bold uppercase tracking-widest text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-[#200e09] transition-colors font-sans"
            >
              <Camera className="w-4 h-4" />
              START SESSION
            </motion.button>
          </motion.div>
        ) : (
          /* Main Recap Layout */
          <div className="space-y-8 sm:space-y-12 max-w-2xl mx-auto w-full">
            
            {/* Top Section: Centered Live Photo Loop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#FAF0E6]/95 backdrop-blur-md rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 border border-wood/10 shadow-[0_15px_35px_rgba(48,21,14,0.04)] flex flex-col items-center"
            >
              <div className="w-full flex items-center justify-between pb-3 border-b border-wood/10 mb-6 sm:mb-8">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-[#91545B]" />
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-wood font-sans">
                    Live Photo Loop
                  </h3>
                </div>
                <span className="text-[9px] sm:text-[10px] bg-[#91545B] text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
                  LIVE SNAP
                </span>
              </div>

              {/* Simulated Polaroid Slideshow Frame with Tape and Bouncy Tilt */}
              <div className="relative w-full max-w-[320px] mx-auto pb-4">
                {/* Washi Tape decorative element */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#F3A0AA]/50 border-x border-[#FAF0E6]/20 backdrop-blur-xs rotate-[-1.5deg] z-20 shadow-sm" />
                
                {/* Polaroid Frame */}
                <motion.div 
                  animate={{ rotate: [0.5, -0.5, 0.5] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="w-full bg-white p-3.5 pb-10 sm:p-4.5 sm:pb-14 shadow-[0_15px_35px_rgba(48,21,14,0.08)] rounded-[4px] border border-wood/5 flex flex-col gap-3 relative"
                >
                  <div className="relative aspect-[3/4] w-full bg-wood/5 overflow-hidden rounded-[2px]">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentIndex}
                        src={photos[currentIndex]}
                        initial={{ opacity: 0.94 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0.94 }}
                        transition={{ duration: 0.08 }} // Direct fast transition for rapid GIF feel!
                        className="absolute inset-0 w-full h-full object-cover scale-x-[-1] grayscale-[0.03] contrast-[1.04]"
                        alt="Live Photo Snap"
                      />
                    </AnimatePresence>
                    
                    {/* Glossy overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
                  </div>
                  
                  {/* Polaroid Handwritten Caption */}
                  <div className="text-center mt-1">
                    <span className="font-serif italic text-wood/60 text-xs sm:text-sm tracking-widest flex items-center justify-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 fill-[#F3A0AA] text-[#91545B]" />
                      photo live snap
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Slideshow Progress Bar Indicators */}
              <div className="flex gap-1 mt-3 justify-center mb-6">
                {photos.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-200 ${idx === currentIndex ? 'w-5 bg-[#91545B]' : 'w-1.5 bg-wood/15'}`}
                  />
                ))}
              </div>

              {/* Centered Start New Session Button inside the loop panel */}
              <div className="w-full pt-4 border-t border-wood/10 flex flex-col items-center space-y-3">
                <p className="text-[10px] sm:text-xs text-[#725A54] leading-relaxed font-sans text-center">
                  Finished saving your photos? Start a fresh session to capture more memories!
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartOver}
                  className="w-full max-w-xs py-3 bg-gradient-to-r from-[#91545B] to-[#530F0E] text-white rounded-full font-bold uppercase tracking-widest text-[10px] sm:text-xs shadow-[0_8px_20px_rgba(145,84,91,0.25)] flex items-center justify-center gap-2 cursor-pointer font-sans"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  START NEW SESSION
                </motion.button>
              </div>
            </motion.div>

            {/* Middle Section: Selected Photos Gallery (with Download) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#FAF0E6]/95 backdrop-blur-md rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 md:p-8 border border-wood/10 shadow-[0_20px_50px_rgba(48,21,14,0.04)] space-y-6"
            >
              <div className="pb-4 border-b border-wood/10">
                <h3 className="text-lg sm:text-xl font-bold font-serif text-wood">
                  Selected Layout Photos
                </h3>
                <p className="text-[10px] sm:text-xs text-wood/60 font-sans mt-0.5">
                  These photos are featured in your chosen frame layout.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {photos.map((src, index) => (
                  <div
                    key={index}
                    className="group relative bg-white p-2 rounded-xl shadow-xs border border-wood/5 overflow-hidden flex flex-col gap-2 transition-all duration-300"
                  >
                    <div className="aspect-[3/4] w-full rounded-lg overflow-hidden bg-wood/5 relative">
                      <img
                        src={src}
                        className="w-full h-full object-cover scale-x-[-1] grayscale-[0.02]"
                        alt={`Selected ${index + 1}`}
                      />
                    </div>
                    
                    {/* Action Panel */}
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[8px] sm:text-[9px] font-sans font-bold text-wood/40 uppercase tracking-widest">
                        PHOTO #{index + 1}
                      </span>
                      <button
                        onClick={() => handleDownloadSingle(src, `selected-${index + 1}`)}
                        className="p-1 bg-[#FAF0E6] hover:bg-[#F3A0AA]/20 text-[#91545B] hover:text-[#7a4249] rounded-md transition-colors cursor-pointer animate-fadeIn"
                        title="Download Photo"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Bottom Section: Unselected Photos (Deleted & Retaken) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#FAF0E6]/95 backdrop-blur-md rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 md:p-8 border border-wood/10 shadow-[0_20px_50px_rgba(48,21,14,0.04)] space-y-6"
            >
              <div className="pb-4 border-b border-wood/10">
                <h3 className="text-lg sm:text-xl font-bold font-serif text-wood">
                  Saves from Studio (Unused Poses)
                </h3>
                <p className="text-[10px] sm:text-xs text-wood/60 font-sans mt-0.5">
                  These photos were deleted or retaken, but you can still download them here!
                </p>
              </div>

              {unselectedPhotos.length === 0 ? (
                <div className="py-10 text-center text-wood/40 font-sans text-xs uppercase tracking-widest">
                  No unselected photos in this session.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {unselectedPhotos.map((item, index) => (
                    <div
                      key={index}
                      className="group relative bg-white p-2 rounded-xl shadow-xs border border-wood/5 overflow-hidden flex flex-col gap-2 transition-all duration-300"
                    >
                      <div className="aspect-[3/4] w-full rounded-lg overflow-hidden bg-wood/5 relative">
                        <img
                          src={item.src}
                          className="w-full h-full object-cover scale-x-[-1] grayscale-[0.05]"
                          alt={item.label}
                        />
                        
                        {/* Status Label Overlay */}
                        <div className="absolute top-2 left-2">
                          {item.type === 'deleted' ? (
                            <span className="text-[7px] sm:text-[8px] bg-red-500 text-white font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5">
                              <Trash2 className="w-2.5 h-2.5" />
                              Deleted
                            </span>
                          ) : (
                            <span className="text-[7px] sm:text-[8px] bg-amber-500 text-white font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5">
                              <RefreshCw className="w-2.5 h-2.5" />
                              Retaken
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Panel */}
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[8px] sm:text-[9px] font-sans font-bold text-wood/40 uppercase tracking-widest">
                          {item.label}
                        </span>
                        <button
                          onClick={() => handleDownloadSingle(item.src, item.type === 'deleted' ? `deleted-${index + 1}` : `retaken-${index + 1}`)}
                          className="p-1 bg-[#FAF0E6] hover:bg-[#F3A0AA]/20 text-[#91545B] hover:text-[#7a4249] rounded-md transition-colors cursor-pointer"
                          title="Download Photo"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recap;
