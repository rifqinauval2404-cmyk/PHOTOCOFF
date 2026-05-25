import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share2, RotateCcw, X, Link, ArrowRight, QrCode } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';
import { usePhotography } from '../context/PhotographyContext';

// Helper Icons for sharing platforms
const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.115-2.906-6.99C16.257 1.875 13.777 1.84 11.994 1.84c-5.438 0-9.863 4.42-9.867 9.864 0 1.73.465 3.42 1.345 4.922L2.463 20.35l3.96-.91c-.001-.285-.001-1.077 0-1.077-.042.062.137-.091.224-.131z" />
    <path d="M17.472 14.382c-.302-.151-1.787-.882-2.063-.982-.277-.1-.478-.151-.68.151-.202.302-.782.982-.96 1.182-.178.2-.355.226-.657.076-.301-.15-1.272-.469-2.422-1.494-.894-.797-1.498-1.782-1.674-2.083-.177-.302-.019-.465.132-.615.136-.135.302-.353.454-.53.151-.177.202-.302.302-.503.101-.2.05-.377-.025-.527-.075-.15-.68-1.64-.932-2.245-.246-.59-.496-.51-.68-.52-.177-.01-.38-.01-.583-.01-.203 0-.533.076-.812.379-.279.302-1.065 1.042-1.065 2.541s1.09 2.946 1.242 3.147c.152.202 2.146 3.277 5.197 4.59.726.313 1.292.5 1.735.64.73.232 1.393.199 1.918.121.585-.087 1.787-.73 2.039-1.433.253-.703.253-1.306.177-1.432-.076-.127-.279-.203-.581-.354z" />
  </svg>
);

const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FRAME_CONFIGS = {
  rustic: { // frame_1.png
    6: [
      { top: '11.5%', left: '11.2%', width: '37.0%', height: '18.5%' },
      { top: '11.5%', left: '51.8%', width: '37.0%', height: '18.5%' },
      { top: '34.8%', left: '11.2%', width: '37.0%', height: '18.5%' },
      { top: '34.8%', left: '51.8%', width: '37.0%', height: '18.5%' },
      { top: '58.1%', left: '11.2%', width: '37.0%', height: '18.5%' },
      { top: '58.1%', left: '51.8%', width: '37.0%', height: '18.5%' },
    ],
    3: [
      { top: '11.5%', left: '11.2%', width: '37.0%', height: '18.5%' },
      { top: '34.8%', left: '11.2%', width: '37.0%', height: '18.5%' },
      { top: '58.1%', left: '11.2%', width: '37.0%', height: '18.5%' },
    ]
  },
  romantic: { // frame_2.png
    6: [
      { top: '10.6%', left: '7.2%', width: '35.8%', height: '24.3%' },
      { top: '10.6%', left: '55.4%', width: '35.8%', height: '24.3%' },
      { top: '39.7%', left: '7.2%', width: '35.8%', height: '24.3%' },
      { top: '39.7%', left: '55.4%', width: '35.8%', height: '24.3%' },
      { top: '68.8%', left: '7.2%', width: '35.8%', height: '24.3%' },
      { top: '68.8%', left: '55.4%', width: '35.8%', height: '24.3%' },
    ],
    3: [
      { top: '10.6%', left: '7.2%', width: '35.8%', height: '24.3%' },
      { top: '39.7%', left: '7.2%', width: '35.8%', height: '24.3%' },
      { top: '68.8%', left: '7.2%', width: '35.8%', height: '24.3%' },
    ]
  },
  vintage: { // frame_3.png
    6: [
      { top: '33.8%', left: '2.8%', width: '94.4%', height: '27.8%' },
      { top: '77.8%', left: '2.8%', width: '30.8%', height: '18.8%' },
      { top: '64.8%', left: '38.0%', width: '24.0%', height: '12.0%' },
    ],
    3: [
      { top: '33.8%', left: '2.8%', width: '94.4%', height: '27.8%' },
      { top: '77.8%', left: '2.8%', width: '30.8%', height: '18.8%' },
      { top: '64.8%', left: '38.0%', width: '24.0%', height: '12.0%' },
    ]
  },
  denim: { // frame_4.png
    6: [
      { top: '11.5%', left: '11.2%', width: '37.0%', height: '18.5%' },
      { top: '11.5%', left: '51.8%', width: '37.0%', height: '18.5%' },
      { top: '34.8%', left: '11.2%', width: '37.0%', height: '18.5%' },
      { top: '34.8%', left: '51.8%', width: '37.0%', height: '18.5%' },
      { top: '58.1%', left: '11.2%', width: '37.0%', height: '18.5%' },
      { top: '58.1%', left: '51.8%', width: '37.0%', height: '18.5%' },
    ],
    3: [
      { top: '11.5%', left: '11.2%', width: '37.0%', height: '18.5%' },
      { top: '34.8%', left: '11.2%', width: '37.0%', height: '18.5%' },
      { top: '58.1%', left: '11.2%', width: '37.0%', height: '18.5%' },
    ]
  }
};

const Result = () => {
  const resultRef = useRef(null);
  const navigate = useNavigate();
  const { photos, photoCount, frame, framePhotosMapping, resetAll } = usePhotography();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  if (!photos || photos.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center">
        <button
          onClick={() => navigate('/')}
          className="text-wood hover:text-wood/60 transition-colors font-sans text-xs uppercase tracking-widest cursor-pointer"
        >
          No photos found. Go back to start.
        </button>
      </div>
    );
  }

  const handleDownload = async () => {
    if (!resultRef.current) return;
    const canvas = await html2canvas(resultRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#FDFBF9",
    });
    const image = canvas.toDataURL("image/jpeg", 0.95);
    const link = document.createElement("a");
    link.href = image;
    link.download = `pixel-snap-${Date.now()}.jpg`;
    link.click();
  };

  const handleShare = async () => {
    if (!resultRef.current) return;

    try {
      const canvas = await html2canvas(resultRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#FDFBF9",
      });
      
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.95));
      const file = new File([blob], `pixel-snap-${Date.now()}.jpg`, { type: 'image/jpeg' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'PhotoCoff - Pixel Snap',
          text: 'Look at my awesome photobooth portrait from PhotoCoff!',
        });
      } else {
        setIsShareModalOpen(true);
      }
    } catch (error) {
      console.error("Error invoking share API:", error);
      setIsShareModalOpen(true);
    }
  };

  const shareWhatsApp = () => {
    const text = `Look at my beautiful photobooth photo from PhotoCoff! ${window.location.origin}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareInstagram = () => {
    window.open('https://www.instagram.com/', '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleStartOver = () => {
    resetAll();
    navigate('/');
  };

  const getFrameImage = () => {
    const frameMap = {
      'rustic': '/frame_1.png',
      'romantic': '/frame_2.png',
      'vintage': '/frame_3.png',
      'denim': '/frame_4.png'
    };
    return frameMap[frame] || '/frame_1.png';
  };

  // Get current active coordinates configs
  const activeFrame = frame || 'rustic';
  const activeConfigs = FRAME_CONFIGS[activeFrame] || FRAME_CONFIGS.rustic;
  const currentConfigs = activeConfigs[photoCount] || activeConfigs[6];

  // Recap URL for the QR code
  const recapUrl = `${window.location.origin}/recap`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&color=30150e&bgcolor=faf0e6&data=${encodeURIComponent(recapUrl)}`;

  return (
    <div className="min-h-screen bg-[#FDFBF9] py-6 sm:py-8 px-4 flex flex-col items-center justify-center gap-6 sm:gap-8 font-sans relative overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-1.5 sm:space-y-2 flex-shrink-0"
      >
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-wood">There u go!</h1>
        <div className="h-[1px] w-10 sm:w-12 bg-wood/20 mx-auto" />
      </motion.div>

      {/* Side-by-Side: Composition & QR Code Card */}
      <div className="flex-1 w-full max-w-[950px] flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 px-2">
        {/* Left Side: Composition Preview */}
        <div className="flex-shrink-0 flex justify-center">
          <div 
            ref={resultRef}
            className="bg-white p-2.5 pb-3 sm:p-3.5 sm:pb-4 md:p-4 md:pb-6 shadow-[0_20px_50px_rgba(48,21,14,0.06)] rounded-sm flex flex-col gap-2.5 sm:gap-3 items-center justify-center"
          >
            <div className="relative h-[42vh] sm:h-[50vh] md:h-[56vh] max-h-[580px] aspect-[2/3] overflow-hidden bg-wood/5 rounded-sm">
              <img src={getFrameImage()} className="w-full h-full object-cover" alt="Frame" />
              
              {/* Absolute overlay of photos */}
              {currentConfigs.map((config, index) => {
                const mappedIndex = framePhotosMapping && framePhotosMapping[index] !== undefined 
                  ? framePhotosMapping[index] 
                  : index;
                const src = photos[mappedIndex];

                if (!src) return null;

                return (
                  <div
                    key={index}
                    style={{
                      position: 'absolute',
                      top: config.top,
                      left: config.left,
                      width: config.width,
                      height: config.height,
                    }}
                    className="overflow-hidden"
                  >
                    <img
                      src={src}
                      className="w-full h-full object-cover grayscale-[0.1] contrast-[1.05]"
                      alt={`Slot ${index + 1}`}
                    />
                  </div>
                );
              })}
            </div>
            
            <div className="text-center flex-shrink-0">
              <p className="font-sans text-[7px] sm:text-[8px] uppercase tracking-[0.4em] text-wood/30 font-bold">
                STUDIO EDITION
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: QR Code Card Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-[#FAF0E6]/95 backdrop-blur-sm rounded-[24px] border border-wood/10 p-5 sm:p-7 flex flex-col items-center text-center shadow-[0_15px_30px_rgba(48,21,14,0.04)] w-full max-w-sm md:w-[320px] shrink-0"
        >
          <div className="w-10 h-10 rounded-full bg-[#FCE6DF] flex items-center justify-center text-[#91545B] mb-3 sm:mb-4">
            <QrCode className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-wood">Scan for Recap</h3>
          <p className="text-[10px] sm:text-xs text-[#725A54] mt-1 sm:mt-1.5 mb-4 sm:mb-5 leading-relaxed font-sans max-w-[240px]">
            Scan this QR code with your phone camera to view your digital session recap & loop animation!
          </p>

          {/* QR Code Container */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/recap')}
            className="bg-white p-3 rounded-[20px] border border-wood/10 shadow-sm cursor-pointer relative group flex items-center justify-center"
            title="Click to open Recap Directly"
          >
            <img 
              src={qrImageUrl} 
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-xl"
              alt="Session Recap QR Code"
            />
            {/* Subtle hover overlay hint */}
            <div className="absolute inset-0 bg-[#30150E]/0 group-hover:bg-[#30150E]/2 rounded-[20px] transition-colors" />
          </motion.div>

          <button
            onClick={() => navigate('/recap')}
            className="mt-4 flex items-center gap-1.5 text-[10px] sm:text-xs text-[#91545B] hover:text-[#7a4249] font-sans font-bold uppercase tracking-widest transition-colors cursor-pointer"
          >
            Open Recap Directly
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>

      {/* Action Buttons below */}
      <div className="flex flex-col items-center gap-3 sm:gap-4 w-full max-w-[380px] flex-shrink-0 mt-2">
        <div className="flex gap-2 sm:gap-4 w-full">
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#200e09" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2.5 bg-[#30150E] text-[#FDFBF9] py-2.5 sm:py-3.5 rounded-full font-sans text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] shadow-[0_10px_20px_rgba(48,21,14,0.15)] transition-colors cursor-pointer"
          >
            <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            DOWNLOAD
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#3f0a09" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2.5 bg-[#530F0E] text-[#FDFBF9] py-2.5 sm:py-3.5 rounded-full font-sans text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] shadow-[0_10px_20px_rgba(83,15,14,0.15)] transition-colors cursor-pointer"
          >
            <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            SHARE
          </motion.button>
        </div>

        <button 
          onClick={handleStartOver}
          className="flex items-center gap-2 sm:gap-2.5 text-wood/50 hover:text-wood transition-colors font-sans text-[8px] sm:text-[9px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold cursor-pointer mt-1"
        >
          <RotateCcw className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={2.5} />
          START OVER
        </button>
      </div>

      {/* Share Fallback Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              className="absolute inset-0 bg-wood/75 backdrop-blur-sm"
            />
            
            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-[#FDFBF9] w-full max-w-md rounded-[20px] sm:rounded-[28px] shadow-2xl p-5 sm:p-6 md:p-8 flex flex-col items-center border border-wood/5 z-10"
            >
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 text-wood/40 hover:text-wood transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center w-full mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FCE6DF] flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-bounce">
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#91545B]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-wood">Share Your Portrait</h3>
                <p className="text-[10px] sm:text-xs text-wood/60 mt-1 sm:mt-1.5 font-sans leading-relaxed">
                  Choose a platform to share your beautiful photo.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 sm:gap-3.5 w-full">
                {/* WhatsApp Button */}
                <button
                  onClick={shareWhatsApp}
                  className="w-full flex items-center justify-between p-3 sm:p-4 bg-[#E8F8F0] hover:bg-[#D5F2E1] active:scale-[0.99] transition-all rounded-[14px] sm:rounded-[18px] group cursor-pointer border border-[#c3ecd4]"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3.5">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md">
                      <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-[11px] sm:text-[13px] font-bold text-wood font-sans">Share to WhatsApp</div>
                      <div className="text-[9px] sm:text-[10px] text-wood/50 font-sans">Send directly to your chat</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-wood/40 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Instagram Button */}
                <button
                  onClick={shareInstagram}
                  className="w-full flex items-center justify-between p-3 sm:p-4 bg-[#FFF0F3] hover:bg-[#FFE0E6] active:scale-[0.99] transition-all rounded-[14px] sm:rounded-[18px] group cursor-pointer border border-[#ffd2dc]"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3.5">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#FD1D1D] via-[#F56040] to-[#E1306C] text-white flex items-center justify-center shadow-md">
                      <InstagramIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-[11px] sm:text-[13px] font-bold text-wood font-sans">Share on Instagram</div>
                      <div className="text-[9px] sm:text-[10px] text-wood/50 font-sans">Post to Stories or Feed</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-wood/40 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Copy Link Button */}
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-between p-3 sm:p-4 bg-[#FFF9F6] hover:bg-[#FCE6DF] active:scale-[0.99] transition-all rounded-[14px] sm:rounded-[18px] group cursor-pointer border border-wood/5"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3.5">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#30150E] text-white flex items-center justify-center shadow-md">
                      <Link className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </div>
                    <div className="text-left">
                      <div className="text-[11px] sm:text-[13px] font-bold text-wood font-sans">Copy Web Link</div>
                      <div className="text-[9px] sm:text-[10px] text-wood/50 font-sans">Copy link to clipboard</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-wood/40 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-wood/5 w-full text-center">
                <p className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#91545B] font-bold font-sans">
                  💡 Tip: Download first for easy attachment!
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Copy Toast Success Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 sm:bottom-8 z-[60] bg-[#30150E] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase shadow-xl flex items-center gap-2 border border-white/10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Link Copied!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Result;
