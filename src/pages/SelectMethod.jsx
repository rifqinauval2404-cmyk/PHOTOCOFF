import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePhotography } from '../context/PhotographyContext';

// Cute magical floating sparkle animations on hover
const sparkleVariants = {
  initial: { opacity: 0, scale: 0, x: 0, y: 0, rotate: 0 },
  hover: (custom) => ({
    opacity: [0, 1, 1, 0],
    scale: [0, custom.scale || 1.1, custom.scale || 1.1, 0],
    x: [0, custom.x],
    y: [0, custom.y],
    rotate: [0, custom.rotate || 180],
    transition: {
      duration: 1.6,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut",
      delay: custom.delay || 0,
    }
  })
};

// Elastic spring transitions for the card buttons
const cardVariants = {
  initial: {
    y: 0,
    scale: 1,
    boxShadow: "0 12px 36px rgba(48,21,14,0.04)",
    borderColor: "#EADAC9",
  },
  hover: {
    y: -10,
    scale: 1.04,
    boxShadow: "0 24px 48px rgba(48,21,14,0.12)",
    borderColor: "#F3A0AA",
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 18,
    }
  },
  tap: {
    scale: 0.97,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15,
    }
  }
};

const SelectMethod = () => {
  const navigate = useNavigate();
  const { setMethod, setPhotos, setPhotoCount } = usePhotography();
  const [step, setStep] = useState(1);
  const fileInputRef = useRef(null);

  const handleTakePhoto = () => {
    setMethod('camera');
    setStep(2);
  };

  const handleSelectCount = (count) => {
    setPhotoCount(count);
    navigate('/studio');
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const count = files.length >= 6 ? 6 : 3;
    const uploadedPhotos = [];

    files.slice(0, count).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        uploadedPhotos.push(event.target.result);
        if (uploadedPhotos.length === Math.min(count, files.length)) {
          setPhotos(uploadedPhotos);
          setPhotoCount(count);
          setMethod('upload');
          navigate('/select-frame');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image - fully visible */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: "url('/bg_landingpage.png')" }}
      />

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full text-center space-y-12 max-w-5xl flex flex-col items-center"
          >
            <div className="space-y-5">
              <h1 className="text-4xl md:text-5xl font-bold text-wood font-serif tracking-tight">Select Method</h1>
              <p className="text-wood/60 font-sans text-sm tracking-wide">
                Choose how you want to continue your photo session.
              </p>
            </div>

            <div className="method-grid mx-auto flex flex-col sm:flex-row justify-center items-center gap-8 md:gap-16">
              {/* Live Capture Card */}
              <motion.button
                variants={cardVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={handleTakePhoto}
                className="relative flex flex-col items-center justify-center w-[290px] h-[320px] p-6 bg-[#FAF0E6]/95 backdrop-blur-md rounded-[32px] border-2 transition-colors duration-300 group shrink-0 cursor-pointer overflow-hidden"
              >
                {/* Inner decorative dashed border */}
                <div className="absolute inset-3 rounded-[22px] border-2 border-dashed border-[#E7D6C5]/85 group-hover:border-cashmere/45 transition-colors duration-500 pointer-events-none" />

                {/* Floating Sparkles */}
                <motion.span
                  custom={{ x: 18, y: -18, delay: 0.1, scale: 1.1, rotate: 90 }}
                  variants={sparkleVariants}
                  className="absolute top-10 right-10 text-cashmere text-base pointer-events-none"
                >
                  ✨
                </motion.span>
                <motion.span
                  custom={{ x: -16, y: 16, delay: 0.5, scale: 0.9, rotate: -60 }}
                  variants={sparkleVariants}
                  className="absolute bottom-12 left-10 text-cashmere text-sm pointer-events-none"
                >
                  ✨
                </motion.span>
                <motion.span
                  custom={{ x: 15, y: 15, delay: 0.9, scale: 1.0, rotate: 120 }}
                  variants={sparkleVariants}
                  className="absolute bottom-16 right-12 text-[#E7D6C5] text-xs pointer-events-none"
                >
                  ✨
                </motion.span>
                <motion.span
                  custom={{ x: -15, y: -20, delay: 1.3, scale: 0.8, rotate: 45 }}
                  variants={sparkleVariants}
                  className="absolute top-16 left-12 text-[#E7D6C5] text-xs pointer-events-none"
                >
                  ✨
                </motion.span>

                {/* Icon circle */}
                <div className="w-[84px] h-[84px] rounded-full bg-[#F5E6D8]/60 border-2 border-[#E9DACB]/80 flex items-center justify-center mb-5 group-hover:bg-cashmere/10 group-hover:border-cashmere/60 transition-all duration-500 relative z-10 shadow-sm">
                  <Camera className="w-7 h-7 text-wood group-hover:rotate-12 group-hover:scale-110 transition-all duration-500" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-wood mb-1 tracking-wide font-serif relative z-10">
                  Take Photo
                </h2>

                {/* Divider Line */}
                <div className="w-12 h-[2px] bg-wood/15 group-hover:w-20 group-hover:bg-cashmere transition-all duration-500 rounded-full my-3 relative z-10" />

                {/* Description */}
                <p className="text-[13px] text-[#725A54] font-sans leading-relaxed max-w-[210px] text-center relative z-10">
                  Step into the light and capture a fresh portrait instantly.
                </p>
              </motion.button>

              {/* Import Gallery Card */}
              <motion.button
                variants={cardVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={handleUploadClick}
                className="relative flex flex-col items-center justify-center w-[290px] h-[320px] p-6 bg-[#FAF0E6]/95 backdrop-blur-md rounded-[32px] border-2 transition-colors duration-300 group shrink-0 cursor-pointer overflow-hidden"
              >
                {/* Inner decorative dashed border */}
                <div className="absolute inset-3 rounded-[22px] border-2 border-dashed border-[#E7D6C5]/85 group-hover:border-cashmere/45 transition-colors duration-500 pointer-events-none" />

                {/* Floating Sparkles */}
                <motion.span
                  custom={{ x: 18, y: -18, delay: 0.3, scale: 1.1, rotate: 90 }}
                  variants={sparkleVariants}
                  className="absolute top-10 right-10 text-cashmere text-base pointer-events-none"
                >
                  ✨
                </motion.span>
                <motion.span
                  custom={{ x: -16, y: 16, delay: 0.7, scale: 0.9, rotate: -60 }}
                  variants={sparkleVariants}
                  className="absolute bottom-12 left-10 text-cashmere text-sm pointer-events-none"
                >
                  ✨
                </motion.span>
                <motion.span
                  custom={{ x: 15, y: 15, delay: 1.1, scale: 1.0, rotate: 120 }}
                  variants={sparkleVariants}
                  className="absolute bottom-16 right-12 text-[#E7D6C5] text-xs pointer-events-none"
                >
                  ✨
                </motion.span>
                <motion.span
                  custom={{ x: -15, y: -20, delay: 1.5, scale: 0.8, rotate: 45 }}
                  variants={sparkleVariants}
                  className="absolute top-16 left-12 text-[#E7D6C5] text-xs pointer-events-none"
                >
                  ✨
                </motion.span>

                {/* Icon circle */}
                <div className="w-[84px] h-[84px] rounded-full bg-[#F5E6D8]/60 border-2 border-[#E9DACB]/80 flex items-center justify-center mb-5 group-hover:bg-cashmere/10 group-hover:border-cashmere/60 transition-all duration-500 relative z-10 shadow-sm">
                  <Upload className="w-7 h-7 text-wood group-hover:-translate-y-1 group-hover:scale-110 transition-all duration-500" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-wood mb-1 tracking-wide font-serif relative z-10">
                  Import Gallery
                </h2>

                {/* Divider Line */}
                <div className="w-12 h-[2px] bg-wood/15 group-hover:w-20 group-hover:bg-cashmere transition-all duration-500 rounded-full my-3 relative z-10" />

                {/* Description */}
                <p className="text-[13px] text-[#725A54] font-sans leading-relaxed max-w-[210px] text-center relative z-10">
                  Select a cherished photograph from your personal archives.
                </p>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full text-center space-y-12 max-w-5xl flex flex-col items-center"
          >
            <div className="space-y-5">
              <h1 className="text-4xl md:text-5xl font-bold text-wood font-serif tracking-tight">Select Number of Photos</h1>
              <p className="text-wood/60 font-sans text-sm tracking-wide">
                Select the number of photos you want to take in the Studio.
              </p>
            </div>

            <div className="method-grid mx-auto flex flex-col sm:flex-row justify-center items-center gap-8 md:gap-16">
              {/* 3 Photos Card */}
              <motion.button
                variants={cardVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleSelectCount(3)}
                className="relative flex flex-col items-center justify-center w-[290px] h-[320px] p-6 bg-[#FAF0E6]/95 backdrop-blur-md rounded-[32px] border-2 transition-colors duration-300 group shrink-0 cursor-pointer overflow-hidden"
              >
                {/* Inner decorative dashed border */}
                <div className="absolute inset-3 rounded-[22px] border-2 border-dashed border-[#E7D6C5]/85 group-hover:border-cashmere/45 transition-colors duration-500 pointer-events-none" />

                {/* Floating Sparkles */}
                <motion.span
                  custom={{ x: 18, y: -18, delay: 0.2, scale: 1.1, rotate: 90 }}
                  variants={sparkleVariants}
                  className="absolute top-10 right-10 text-cashmere text-base pointer-events-none"
                >
                  ✨
                </motion.span>
                <motion.span
                  custom={{ x: -16, y: 16, delay: 0.6, scale: 0.9, rotate: -60 }}
                  variants={sparkleVariants}
                  className="absolute bottom-12 left-10 text-cashmere text-sm pointer-events-none"
                >
                  ✨
                </motion.span>
                <motion.span
                  custom={{ x: 15, y: 15, delay: 1.0, scale: 1.0, rotate: 120 }}
                  variants={sparkleVariants}
                  className="absolute bottom-16 right-12 text-[#E7D6C5] text-xs pointer-events-none"
                >
                  ✨
                </motion.span>
                <motion.span
                  custom={{ x: -15, y: -20, delay: 1.4, scale: 0.8, rotate: 45 }}
                  variants={sparkleVariants}
                  className="absolute top-16 left-12 text-[#E7D6C5] text-xs pointer-events-none"
                >
                  ✨
                </motion.span>

                {/* Icon circle with number 3 */}
                <div className="w-[84px] h-[84px] rounded-full bg-[#F5E6D8]/60 border-2 border-[#E9DACB]/80 flex items-center justify-center mb-5 group-hover:bg-cashmere/10 group-hover:border-cashmere/60 transition-all duration-500 relative z-10 shadow-sm">
                  <span className="font-serif text-3xl font-bold text-wood group-hover:scale-120 group-hover:rotate-12 transition-all duration-500 inline-block">3</span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-wood mb-1 tracking-wide font-serif relative z-10">
                  3 Photos
                </h2>

                {/* Divider Line */}
                <div className="w-12 h-[2px] bg-wood/15 group-hover:w-20 group-hover:bg-cashmere transition-all duration-500 rounded-full my-3 relative z-10" />

                {/* Description */}
                <p className="text-[13px] text-[#725A54] font-sans leading-relaxed max-w-[210px] text-center relative z-10">
                  Take 3 best poses with a vertical strip layout format.
                </p>
              </motion.button>

              {/* 6 Photos Card */}
              <motion.button
                variants={cardVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleSelectCount(6)}
                className="relative flex flex-col items-center justify-center w-[290px] h-[320px] p-6 bg-[#FAF0E6]/95 backdrop-blur-md rounded-[32px] border-2 transition-colors duration-300 group shrink-0 cursor-pointer overflow-hidden"
              >
                {/* Inner decorative dashed border */}
                <div className="absolute inset-3 rounded-[22px] border-2 border-dashed border-[#E7D6C5]/85 group-hover:border-cashmere/45 transition-colors duration-500 pointer-events-none" />

                {/* Floating Sparkles */}
                <motion.span
                  custom={{ x: 18, y: -18, delay: 0.4, scale: 1.1, rotate: 90 }}
                  variants={sparkleVariants}
                  className="absolute top-10 right-10 text-cashmere text-base pointer-events-none"
                >
                  ✨
                </motion.span>
                <motion.span
                  custom={{ x: -16, y: 16, delay: 0.8, scale: 0.9, rotate: -60 }}
                  variants={sparkleVariants}
                  className="absolute bottom-12 left-10 text-cashmere text-sm pointer-events-none"
                >
                  ✨
                </motion.span>
                <motion.span
                  custom={{ x: 15, y: 15, delay: 1.2, scale: 1.0, rotate: 120 }}
                  variants={sparkleVariants}
                  className="absolute bottom-16 right-12 text-[#E7D6C5] text-xs pointer-events-none"
                >
                  ✨
                </motion.span>
                <motion.span
                  custom={{ x: -15, y: -20, delay: 1.6, scale: 0.8, rotate: 45 }}
                  variants={sparkleVariants}
                  className="absolute top-16 left-12 text-[#E7D6C5] text-xs pointer-events-none"
                >
                  ✨
                </motion.span>

                {/* Icon circle with number 6 */}
                <div className="w-[84px] h-[84px] rounded-full bg-[#F5E6D8]/60 border-2 border-[#E9DACB]/80 flex items-center justify-center mb-5 group-hover:bg-cashmere/10 group-hover:border-cashmere/60 transition-all duration-500 relative z-10 shadow-sm">
                  <span className="font-serif text-3xl font-bold text-wood group-hover:scale-120 group-hover:rotate-12 transition-all duration-500 inline-block">6</span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-wood mb-1 tracking-wide font-serif relative z-10">
                  6 Photos
                </h2>

                {/* Divider Line */}
                <div className="w-12 h-[2px] bg-wood/15 group-hover:w-20 group-hover:bg-cashmere transition-all duration-500 rounded-full my-3 relative z-10" />

                {/* Description */}
                <p className="text-[13px] text-[#725A54] font-sans leading-relaxed max-w-[210px] text-center relative z-10">
                  Take 6 creative poses with a complete 2-column grid format.
                </p>
              </motion.button>
            </div>

            {/* Back Button with hover arrow nudge and smooth hover scaling */}
            <motion.button
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-wood/60 hover:text-wood font-sans text-xs uppercase tracking-widest font-bold transition-colors cursor-pointer mt-4 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              BACK
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />
    </div>
  );
};

export default SelectMethod;
