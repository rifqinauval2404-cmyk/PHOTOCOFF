import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ArrowRight, Trash2, Aperture } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePhotography } from '../context/PhotographyContext';

const Studio = () => {
  const navigate = useNavigate();
  const { method, photoCount, setPhotos: setContextPhotos } = usePhotography();
  const [photos, setPhotos] = useState([]);
  const [stream, setStream] = useState(null);
  const [flash, setFlash] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!method) {
      navigate('/select-method');
      return;
    }

    if (method === 'camera') {
      startCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [method, navigate]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { aspectRatio: 4 / 3, width: { ideal: 1280 }, height: { ideal: 960 } }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const triggerCapture = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 200);

    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    if (!video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photoData = canvas.toDataURL('image/jpeg');
    setPhotos(prev => {
      if (prev.length >= photoCount) return prev;
      return [...prev, photoData];
    });
  };

  const startCountdown = () => {
    if (photos.length >= photoCount || countdown !== null) return;

    let count = 1;
    setCountdown(count);

    timerRef.current = setInterval(() => {
      count += 1;
      if (count <= 3) {
        setCountdown(count);
      } else {
        clearInterval(timerRef.current);
        setCountdown(null);
        triggerCapture();
      }
    }, 1000);
  };

  const deletePhoto = (indexToDelete) => {
    setPhotos(photos.filter((_, index) => index !== indexToDelete));
  };

  const handleNext = () => {
    setContextPhotos(photos);
    navigate('/select-frame');
  };

  return (

    <div className="h-screen overflow-hidden w-screen bg-[#FDFBF9] flex flex-col items-center py-4 md:py-8 font-sans">

      {/* Flash Effect */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <main className="flex flex-row items-center justify-between w-full max-w-[1100px] px-4 md:px-8 flex-1 min-h-0 gap-6">
        {/* Left Column: Viewfinder & Controls */}
        <div className="flex flex-col flex-1 min-w-0 max-w-[660px] h-full justify-center">
          {/* Viewfinder */}
          <div className="relative w-full aspect-[4/3] max-h-[70vh] bg-[#111] rounded-[20px] overflow-hidden shadow-2xl ring-1 ring-wood/10 mx-auto animate-fadeIn">
            {/* Viewfinder Guide Overlay */}
            <div className="absolute inset-8 border border-white/10 pointer-events-none rounded-md z-10" />
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="w-10 h-10 relative">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/30" />
                <div className="absolute left-1/2 top-0 w-[1px] h-full bg-white/30" />
              </div>
            </div>

            {method === 'camera' && (
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
            )}
          </div>

          {/* Capture Controls */}
          <div className="flex flex-col items-center mt-6 relative w-full">
            {/* Small Countdown Display */}
            <div className="h-10 flex items-center justify-center mb-2">
              <AnimatePresence mode="wait">
                {countdown !== null && (
                  <motion.div
                    key={countdown}
                    initial={{ scale: 0.8, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 1.1, opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="bg-[#530F0E] text-[#FDFBF9] px-5 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase font-sans flex items-center gap-2.5 shadow-lg border border-[#FDFBF9]/10"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    POSE IN {countdown}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center relative w-full h-[80px]">
              <button
                onClick={() => setPhotos(photos.slice(0, -1))}
                disabled={photos.length === 0 || countdown !== null}
                className="absolute left-6 text-[10px] uppercase tracking-[0.2em] font-bold text-wood/40 hover:text-wood disabled:opacity-0 transition-all cursor-pointer font-sans"
              >
                RETAKE LAST
              </button>

              <motion.button
                whileHover={{ scale: (photos.length >= photoCount || countdown !== null) ? 1 : 1.05 }}
                whileTap={{ scale: (photos.length >= photoCount || countdown !== null) ? 1 : 0.9 }}
                onClick={startCountdown}
                disabled={photos.length >= photoCount || countdown !== null}
                className="mx-auto w-[80px] h-[80px] rounded-full flex items-center justify-center bg-[#30150E] shadow-[0_15px_30px_rgba(48,21,14,0.2)] z-10 disabled:opacity-50 cursor-pointer"
              >
                <Aperture className={`w-10 h-10 text-white stroke-[1.5] ${countdown !== null ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Right Column: Captured List */}
        <div className="w-[33%] max-w-[340px] bg-white rounded-[24px] p-6 flex flex-col shadow-[0_20px_50px_rgba(48,21,14,0.03)] border border-wood/5 h-full min-h-0">
          <div className="flex items-center justify-between pb-4 border-b border-wood/10 mb-4 flex-shrink-0">
            <h2 className="text-[11px] font-bold text-wood uppercase tracking-[0.2em] font-sans">CAPTURED</h2>
            <span className="text-[13px] italic font-serif text-wood/70">{photos.length} of {photoCount}</span>
          </div>

          <div className={`grid gap-3 flex-1 min-h-0 ${photoCount === 6 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {[...Array(photoCount)].map((_, i) => (
              <div key={i} className={`group min-h-0 w-full rounded-[16px] relative overflow-hidden transition-all ${photos[i] ? 'shadow-md ring-1 ring-wood/10' : 'bg-[#FFF9F6] border-2 border-dashed border-[#F3A0AA]/40'} flex items-center justify-center`}>
                {photos[i] ? (
                  <>
                    <img src={photos[i]} className="w-full h-full object-cover absolute inset-0" alt={`Captured ${i + 1}`} />
                    {/* Delete Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => deletePhoto(i)}
                        className="p-3 bg-white/20 hover:bg-[#91545B] rounded-full backdrop-blur-md text-white transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
                      >
                        <Trash2 className="w-5 h-5" strokeWidth={1.5} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 opacity-60 p-2">
                    <Camera className={`${photoCount === 6 ? 'w-4 h-4' : 'w-5 h-5'} text-[#91545B]/60`} strokeWidth={1.5} />
                    <span className={`${photoCount === 6 ? 'text-[7px]' : 'text-[9px]'} uppercase tracking-[0.15em] font-bold font-sans text-[#91545B]/60 text-center`}>
                      {photoCount === 6 ? 'EMPTY' : 'EMPTY FRAME'}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <motion.button
            disabled={photos.length === 0}
            onClick={handleNext}
            className={`mt-6 w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-sans text-[11px] font-bold uppercase tracking-[0.15em] transition-all flex-shrink-0 cursor-pointer ${photos.length > 0 ? 'bg-[#91545B] text-white hover:bg-[#7a4249] shadow-[0_10px_20px_rgba(145,84,91,0.2)]' : 'bg-wood/5 text-wood/30 cursor-not-allowed'}`}
          >
            NEXT STEP
            <ArrowRight className="w-4 h-4 ml-1" />
          </motion.button>
        </div>
      </main>
    </div>
  );
};

export default Studio;
