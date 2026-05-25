import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, ArrowLeft, Trash2, Plus, ArrowRight } from 'lucide-react';
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

// Sparkle set component to avoid code repetition
const SparkleSet = ({ offsets = {} }) => {
  const defaults = [
    { x: 18, y: -18, delay: 0.1, scale: 1.1, rotate: 90, pos: 'top-10 right-10', size: 'text-base', color: 'text-cashmere' },
    { x: -16, y: 16, delay: 0.5, scale: 0.9, rotate: -60, pos: 'bottom-12 left-10', size: 'text-sm', color: 'text-cashmere' },
    { x: 15, y: 15, delay: 0.9, scale: 1.0, rotate: 120, pos: 'bottom-16 right-12', size: 'text-xs', color: 'text-[#E7D6C5]' },
    { x: -15, y: -20, delay: 1.3, scale: 0.8, rotate: 45, pos: 'top-16 left-12', size: 'text-xs', color: 'text-[#E7D6C5]' },
  ];
  return defaults.map((s, i) => (
    <motion.span
      key={i}
      custom={{ ...s, delay: s.delay + (offsets.delay || 0) }}
      variants={sparkleVariants}
      className={`absolute ${s.pos} ${s.color} ${s.size} pointer-events-none`}
    >
      ✨
    </motion.span>
  ));
};

const SelectMethod = () => {
  const navigate = useNavigate();
  const { setMethod, setPhotos, setPhotoCount } = usePhotography();
  const [step, setStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState(null); // 'camera' or 'upload'
  const fileInputRef = useRef(null);
  const [uploadPhotoCount, setUploadPhotoCount] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleTakePhoto = () => {
    setMethod('camera');
    setSelectedMethod('camera');
    setStep(2);
  };

  const handleImportGallery = () => {
    setSelectedMethod('upload');
    setStep(2);
  };

  const handleSelectCount = (count) => {
    setPhotoCount(count);
    if (selectedMethod === 'camera') {
      navigate('/studio');
    } else {
      // Upload flow: transition to Upload Manager (step 3)
      setUploadPhotoCount(count);
      setStep(3);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const maxAllowed = uploadPhotoCount || 6;
    const currentCount = uploadedFiles.length;
    const remaining = maxAllowed - currentCount;
    if (remaining <= 0) return;

    const filesToProcess = files.slice(0, remaining);
    let processed = 0;
    const tempPhotos = [...uploadedFiles];

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        tempPhotos.push(event.target.result);
        processed++;
        if (processed === filesToProcess.length) {
          setUploadedFiles(tempPhotos);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input value so same files can be re-uploaded if deleted
    e.target.value = '';
  };

  const handleDeleteUploaded = (indexToDelete) => {
    setUploadedFiles(prev => prev.filter((_, idx) => idx !== indexToDelete));
  };

  const handleUploadNext = () => {
    if (uploadedFiles.length === uploadPhotoCount) {
      setPhotos(uploadedFiles);
      setMethod('upload');
      navigate('/select-frame');
    }
  };

  const handleUploadBack = () => {
    setUploadedFiles([]);
    setStep(2);
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
            className="relative z-10 w-full text-center space-y-8 sm:space-y-12 max-w-5xl flex flex-col items-center px-2"
          >
            <div className="space-y-3 sm:space-y-5">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-wood font-serif tracking-tight">Select Method</h1>
              <p className="text-wood/60 font-sans text-xs sm:text-sm tracking-wide">
                Choose how you want to continue your photo session.
              </p>
            </div>

            <div className="method-grid mx-auto">
              {/* Live Capture Card */}
              <motion.button
                variants={cardVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={handleTakePhoto}
                className="relative flex flex-col items-center justify-center w-[240px] h-[270px] sm:w-[290px] sm:h-[320px] p-5 sm:p-6 bg-[#FAF0E6]/95 backdrop-blur-md rounded-[28px] sm:rounded-[32px] border-2 transition-colors duration-300 group shrink-0 cursor-pointer overflow-hidden"
              >
                {/* Inner decorative dashed border */}
                <div className="absolute inset-3 rounded-[18px] sm:rounded-[22px] border-2 border-dashed border-[#E7D6C5]/85 group-hover:border-cashmere/45 transition-colors duration-500 pointer-events-none" />

                <SparkleSet />

                {/* Icon circle */}
                <div className="w-[68px] h-[68px] sm:w-[84px] sm:h-[84px] rounded-full bg-[#F5E6D8]/60 border-2 border-[#E9DACB]/80 flex items-center justify-center mb-4 sm:mb-5 group-hover:bg-cashmere/10 group-hover:border-cashmere/60 transition-all duration-500 relative z-10 shadow-sm">
                  <Camera className="w-6 h-6 sm:w-7 sm:h-7 text-wood group-hover:rotate-12 group-hover:scale-110 transition-all duration-500" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h2 className="text-lg sm:text-xl font-bold text-wood mb-1 tracking-wide font-serif relative z-10">
                  Take Photo
                </h2>

                {/* Divider Line */}
                <div className="w-10 sm:w-12 h-[2px] bg-wood/15 group-hover:w-16 sm:group-hover:w-20 group-hover:bg-cashmere transition-all duration-500 rounded-full my-2 sm:my-3 relative z-10" />

                {/* Description */}
                <p className="text-[12px] sm:text-[13px] text-[#725A54] font-sans leading-relaxed max-w-[200px] sm:max-w-[210px] text-center relative z-10">
                  Step into the light and capture a fresh portrait instantly.
                </p>
              </motion.button>

              {/* Import Gallery Card */}
              <motion.button
                variants={cardVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={handleImportGallery}
                className="relative flex flex-col items-center justify-center w-[240px] h-[270px] sm:w-[290px] sm:h-[320px] p-5 sm:p-6 bg-[#FAF0E6]/95 backdrop-blur-md rounded-[28px] sm:rounded-[32px] border-2 transition-colors duration-300 group shrink-0 cursor-pointer overflow-hidden"
              >
                {/* Inner decorative dashed border */}
                <div className="absolute inset-3 rounded-[18px] sm:rounded-[22px] border-2 border-dashed border-[#E7D6C5]/85 group-hover:border-cashmere/45 transition-colors duration-500 pointer-events-none" />

                <SparkleSet offsets={{ delay: 0.2 }} />

                {/* Icon circle */}
                <div className="w-[68px] h-[68px] sm:w-[84px] sm:h-[84px] rounded-full bg-[#F5E6D8]/60 border-2 border-[#E9DACB]/80 flex items-center justify-center mb-4 sm:mb-5 group-hover:bg-cashmere/10 group-hover:border-cashmere/60 transition-all duration-500 relative z-10 shadow-sm">
                  <Upload className="w-6 h-6 sm:w-7 sm:h-7 text-wood group-hover:-translate-y-1 group-hover:scale-110 transition-all duration-500" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h2 className="text-lg sm:text-xl font-bold text-wood mb-1 tracking-wide font-serif relative z-10">
                  Import Gallery
                </h2>

                {/* Divider Line */}
                <div className="w-10 sm:w-12 h-[2px] bg-wood/15 group-hover:w-16 sm:group-hover:w-20 group-hover:bg-cashmere transition-all duration-500 rounded-full my-2 sm:my-3 relative z-10" />

                {/* Description */}
                <p className="text-[12px] sm:text-[13px] text-[#725A54] font-sans leading-relaxed max-w-[200px] sm:max-w-[210px] text-center relative z-10">
                  Select a cherished photograph from your personal archives.
                </p>
              </motion.button>
            </div>
          </motion.div>
        ) : step === 2 ? (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full text-center space-y-8 sm:space-y-12 max-w-5xl flex flex-col items-center px-2"
          >
            <div className="space-y-3 sm:space-y-5">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-wood font-serif tracking-tight">Select Number of Photos</h1>
              <p className="text-wood/60 font-sans text-xs sm:text-sm tracking-wide">
                {selectedMethod === 'camera'
                  ? 'Select the number of photos you want to take in the Studio.'
                  : 'Select the number of photos you want to import from gallery.'}
              </p>
            </div>

            <div className="method-grid mx-auto">
              {/* 3 Photos Card */}
              <motion.button
                variants={cardVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleSelectCount(3)}
                className="relative flex flex-col items-center justify-center w-[240px] h-[270px] sm:w-[290px] sm:h-[320px] p-5 sm:p-6 bg-[#FAF0E6]/95 backdrop-blur-md rounded-[28px] sm:rounded-[32px] border-2 transition-colors duration-300 group shrink-0 cursor-pointer overflow-hidden"
              >
                {/* Inner decorative dashed border */}
                <div className="absolute inset-3 rounded-[18px] sm:rounded-[22px] border-2 border-dashed border-[#E7D6C5]/85 group-hover:border-cashmere/45 transition-colors duration-500 pointer-events-none" />

                <SparkleSet offsets={{ delay: 0.1 }} />

                {/* Icon circle with number 3 */}
                <div className="w-[68px] h-[68px] sm:w-[84px] sm:h-[84px] rounded-full bg-[#F5E6D8]/60 border-2 border-[#E9DACB]/80 flex items-center justify-center mb-4 sm:mb-5 group-hover:bg-cashmere/10 group-hover:border-cashmere/60 transition-all duration-500 relative z-10 shadow-sm">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-wood group-hover:scale-120 group-hover:rotate-12 transition-all duration-500 inline-block">3</span>
                </div>

                {/* Title */}
                <h2 className="text-lg sm:text-xl font-bold text-wood mb-1 tracking-wide font-serif relative z-10">
                  3 Photos
                </h2>

                {/* Divider Line */}
                <div className="w-10 sm:w-12 h-[2px] bg-wood/15 group-hover:w-16 sm:group-hover:w-20 group-hover:bg-cashmere transition-all duration-500 rounded-full my-2 sm:my-3 relative z-10" />

                {/* Description */}
                <p className="text-[12px] sm:text-[13px] text-[#725A54] font-sans leading-relaxed max-w-[200px] sm:max-w-[210px] text-center relative z-10">
                  {selectedMethod === 'camera'
                    ? 'Take 3 best poses with a vertical strip layout format.'
                    : 'Import 3 photos for a vertical strip layout format.'}
                </p>
              </motion.button>

              {/* 6 Photos Card */}
              <motion.button
                variants={cardVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleSelectCount(6)}
                className="relative flex flex-col items-center justify-center w-[240px] h-[270px] sm:w-[290px] sm:h-[320px] p-5 sm:p-6 bg-[#FAF0E6]/95 backdrop-blur-md rounded-[28px] sm:rounded-[32px] border-2 transition-colors duration-300 group shrink-0 cursor-pointer overflow-hidden"
              >
                {/* Inner decorative dashed border */}
                <div className="absolute inset-3 rounded-[18px] sm:rounded-[22px] border-2 border-dashed border-[#E7D6C5]/85 group-hover:border-cashmere/45 transition-colors duration-500 pointer-events-none" />

                <SparkleSet offsets={{ delay: 0.3 }} />

                {/* Icon circle with number 6 */}
                <div className="w-[68px] h-[68px] sm:w-[84px] sm:h-[84px] rounded-full bg-[#F5E6D8]/60 border-2 border-[#E9DACB]/80 flex items-center justify-center mb-4 sm:mb-5 group-hover:bg-cashmere/10 group-hover:border-cashmere/60 transition-all duration-500 relative z-10 shadow-sm">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-wood group-hover:scale-120 group-hover:rotate-12 transition-all duration-500 inline-block">6</span>
                </div>

                {/* Title */}
                <h2 className="text-lg sm:text-xl font-bold text-wood mb-1 tracking-wide font-serif relative z-10">
                  6 Photos
                </h2>

                {/* Divider Line */}
                <div className="w-10 sm:w-12 h-[2px] bg-wood/15 group-hover:w-16 sm:group-hover:w-20 group-hover:bg-cashmere transition-all duration-500 rounded-full my-2 sm:my-3 relative z-10" />

                {/* Description */}
                <p className="text-[12px] sm:text-[13px] text-[#725A54] font-sans leading-relaxed max-w-[200px] sm:max-w-[210px] text-center relative z-10">
                  {selectedMethod === 'camera'
                    ? 'Take 6 creative poses with a complete 2-column grid format.'
                    : 'Import 6 photos for a complete 2-column grid format.'}
                </p>
              </motion.button>
            </div>

            {/* Back Button with hover arrow nudge and smooth hover scaling */}
            <motion.button
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setStep(1); setSelectedMethod(null); }}
              className="flex items-center gap-2 text-wood/60 hover:text-wood font-sans text-xs uppercase tracking-widest font-bold transition-colors cursor-pointer mt-2 sm:mt-4 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              BACK
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full text-center space-y-6 sm:space-y-8 max-w-4xl flex flex-col items-center px-2"
          >
            <div className="space-y-2 sm:space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-wood font-serif tracking-tight">Upload Your Photos</h1>
              <p className="text-wood/60 font-sans text-xs sm:text-sm tracking-wide">
                Upload exactly {uploadPhotoCount} photos to build your layout.
              </p>
            </div>

            {/* Slots Grid */}
            <div className={`grid gap-3 sm:gap-4 w-full max-w-xl px-4 ${uploadPhotoCount === 6 ? 'grid-cols-3' : 'grid-cols-3'}`}>
              {[...Array(uploadPhotoCount)].map((_, i) => (
                <div
                  key={i}
                  className={`group relative aspect-[3/4] w-full rounded-2xl overflow-hidden transition-all duration-300 ${
                    uploadedFiles[i]
                      ? 'shadow-md ring-1 ring-wood/10 bg-white'
                      : 'bg-[#FAF0E6]/60 border-2 border-dashed border-[#F3A0AA]/40 hover:border-[#F3A0AA]/80 hover:bg-[#FAF0E6]/90 cursor-pointer'
                  } flex flex-col items-center justify-center`}
                  onClick={() => {
                    if (!uploadedFiles[i]) {
                      fileInputRef.current?.click();
                    }
                  }}
                >
                  {uploadedFiles[i] ? (
                    <>
                      <img src={uploadedFiles[i]} className="w-full h-full object-cover" alt={`Uploaded ${i + 1}`} />
                      {/* Delete Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUploaded(i);
                          }}
                          className="p-2 bg-white/20 hover:bg-[#91545B] rounded-full backdrop-blur-md text-white transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" strokeWidth={1.5} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-2 text-[#91545B]/65 group-hover:text-wood transition-colors">
                      <Plus className="w-5 h-5 sm:w-6 sm:h-6 mb-1 stroke-[1.5]" />
                      <span className="text-[8px] sm:text-[9px] font-sans font-bold uppercase tracking-widest text-center">
                        SLOT {i + 1}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center gap-3 sm:gap-4 w-full max-w-sm px-4">
              <div className="flex gap-2 sm:gap-3 w-full">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadedFiles.length >= uploadPhotoCount}
                  className="flex-1 py-2.5 sm:py-3.5 px-3 sm:px-4 bg-white hover:bg-wood/5 text-wood border border-wood/20 rounded-xl font-sans text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.12em] transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  UPLOAD FILE(S)
                </motion.button>

                <motion.button
                  disabled={uploadedFiles.length < uploadPhotoCount}
                  whileHover={{ scale: uploadedFiles.length === uploadPhotoCount ? 1.02 : 1 }}
                  whileTap={{ scale: uploadedFiles.length === uploadPhotoCount ? 0.98 : 1 }}
                  onClick={handleUploadNext}
                  className={`flex-1 py-2.5 sm:py-3.5 px-3 sm:px-4 rounded-xl font-sans text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.12em] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    uploadedFiles.length === uploadPhotoCount
                      ? 'bg-[#91545B] text-white hover:bg-[#7a4249] shadow-[0_10px_20px_rgba(145,84,91,0.25)]'
                      : 'bg-wood/5 text-wood/30 cursor-not-allowed'
                  }`}
                >
                  NEXT STEP
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>

              {/* Back to Step 2 Button */}
              <motion.button
                whileHover={{ x: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUploadBack}
                className="flex items-center gap-2 text-wood/60 hover:text-wood font-sans text-xs uppercase tracking-widest font-bold transition-colors cursor-pointer group mt-2"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                BACK
              </motion.button>
            </div>
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
