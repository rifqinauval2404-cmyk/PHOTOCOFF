import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePhotography } from '../context/PhotographyContext';

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
      {/* Background Image with slow animation */}
      <motion.div 
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: "url('/bgphotocoff2.jpg')" }}
      />
      {/* Soft elegant overlay with backdrop blur for readability */}
      <div className="absolute inset-0 bg-silk/85 backdrop-blur-[6px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-silk/40 via-transparent to-silk/95 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(48,21,14,0.15)_100%)] pointer-events-none" />

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full text-center space-y-12 max-w-5xl flex flex-col items-center"
          >
            <div className="space-y-5">
              <h1 className="text-4xl md:text-5xl font-bold text-wood font-serif tracking-tight">Select Method</h1>
              <p className="text-wood/60 font-sans text-sm tracking-wide">
                Choose how you want to continue your photo session.
              </p>
            </div>

            <div className="method-grid mx-auto flex flex-col sm:flex-row justify-center items-center gap-8 md:gap-16">
              <motion.button
                whileHover={{ y: -5, transition: { duration: 0.4, ease: "easeOut" } }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTakePhoto}
                className="flex flex-col items-center justify-center w-[280px] h-[280px] p-8 bg-white rounded-[20px] shadow-[0_15px_40px_rgba(48,21,14,0.04)] border border-transparent hover:border-cashmere/20 transition-all group shrink-0 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-[#FCE6DF] flex items-center justify-center mb-6 transition-colors group-hover:bg-[#FADBD0]">
                  <Camera className="w-6 h-6 text-wood" strokeWidth={1.5} />
                </div>
                <h2 className="text-lg font-bold text-wood mb-2 tracking-[0.05em] font-serif uppercase">TAKE PHOTO</h2>
                <p className="text-[11px] text-wood/50 font-sans leading-relaxed max-w-[200px]">
                  Use your device camera to take a new picture instantly.
                </p>
              </motion.button>

              <motion.button
                whileHover={{ y: -5, transition: { duration: 0.4, ease: "easeOut" } }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUploadClick}
                className="flex flex-col items-center justify-center w-[280px] h-[280px] p-8 bg-white rounded-[20px] shadow-[0_15px_40px_rgba(48,21,14,0.04)] border border-transparent hover:border-cashmere/20 transition-all group shrink-0 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-[#FCE6DF] flex items-center justify-center mb-6 transition-colors group-hover:bg-[#FADBD0]">
                  <Upload className="w-6 h-6 text-wood" strokeWidth={1.5} />
                </div>
                <h2 className="text-lg font-bold text-wood mb-2 tracking-[0.05em] font-serif uppercase">UPLOAD PHOTO</h2>
                <p className="text-[11px] text-wood/50 font-sans leading-relaxed max-w-[200px]">
                  Select existing photos from your personal collection.
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
            className="w-full text-center space-y-12 max-w-5xl flex flex-col items-center"
          >
            <div className="space-y-5">
              <h1 className="text-4xl md:text-5xl font-bold text-wood font-serif tracking-tight">Select Number of Photos</h1>
              <p className="text-wood/60 font-sans text-sm tracking-wide">
                Select the number of photos you want to take in the Studio.
              </p>
            </div>

            <div className="method-grid mx-auto flex flex-col sm:flex-row justify-center items-center gap-8 md:gap-16">
              <motion.button
                whileHover={{ y: -5, transition: { duration: 0.4, ease: "easeOut" } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectCount(3)}
                className="flex flex-col items-center justify-center w-[280px] h-[280px] p-8 bg-white rounded-[20px] shadow-[0_15px_40px_rgba(48,21,14,0.04)] border border-transparent hover:border-cashmere/20 transition-all group shrink-0 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-[#FCE6DF] flex items-center justify-center mb-6 transition-colors group-hover:bg-[#FADBD0] text-wood font-serif text-2xl font-bold">
                  3
                </div>
                <h2 className="text-lg font-bold text-wood mb-2 tracking-[0.05em] font-serif uppercase">3 PHOTOS</h2>
                <p className="text-[11px] text-wood/50 font-sans leading-relaxed max-w-[200px]">
                  Take 3 best poses with a vertical strip layout format.
                </p>
              </motion.button>

              <motion.button
                whileHover={{ y: -5, transition: { duration: 0.4, ease: "easeOut" } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectCount(6)}
                className="flex flex-col items-center justify-center w-[280px] h-[280px] p-8 bg-white rounded-[20px] shadow-[0_15px_40px_rgba(48,21,14,0.04)] border border-transparent hover:border-cashmere/20 transition-all group shrink-0 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-[#FCE6DF] flex items-center justify-center mb-6 transition-colors group-hover:bg-[#FADBD0] text-wood font-serif text-2xl font-bold">
                  6
                </div>
                <h2 className="text-lg font-bold text-wood mb-2 tracking-[0.05em] font-serif uppercase">6 PHOTOS</h2>
                <p className="text-[11px] text-wood/50 font-sans leading-relaxed max-w-[200px]">
                  Take 6 creative poses with a complete 2-column grid format.
                </p>
              </motion.button>
            </div>

            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-wood/60 hover:text-wood font-sans text-xs uppercase tracking-widest font-bold transition-colors cursor-pointer mt-4"
            >
              <ArrowLeft className="w-4 h-4" />
              BACK
            </button>
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
