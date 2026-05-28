import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePhotography } from '../context/PhotographyContext';
import { X, Check } from 'lucide-react';

const FRAMES = [
  { id: 'rustic', name: 'Rustic Charm', desc: 'Warm tones and country textures.', image: '/frame_1.png', slots: 6 },
  { id: 'romantic', name: 'Romantic Scrapbook', desc: 'Capturing love in every detail.', image: '/frame_2.png', slots: 6 },
  { id: 'vintage', name: 'Vintage News', desc: 'Classic editorial newspaper style.', image: '/frame_3.png', slots: 3 },
  { id: 'denim', name: 'Denim Creative', desc: 'Playful, textured denim layout.', image: '/frame_4.png', slots: 6 },
];

const SelectFrame = () => {
  const navigate = useNavigate();
  const { photos, photoCount, frame, setFrame, setFramePhotosMapping } = usePhotography();

  // Filter frames by supported photo slot count
  const filteredFrames = FRAMES.filter(f => f.slots === photoCount);
  
  // Default selected frame dynamically chosen from filtered list
  const defaultFrameId = filteredFrames.length > 0 ? filteredFrames[0].id : 'rustic';
  const [selectedFrame, setSelectedFrame] = useState(
    frame && filteredFrames.some(f => f.id === frame) ? frame : defaultFrameId
  );
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFrameId, setActiveFrameId] = useState(null);
  
  // Mapping array: index maps to photo index.
  const [photoMapping, setPhotoMapping] = useState([]);

  const handleSelect = (frameId) => {
    setSelectedFrame(frameId);
    setFrame(frameId);
    const defaultMapping = [...Array(photoCount)].map((_, i) => i);
    setFramePhotosMapping(defaultMapping);
    navigate('/result');
  };

  const handleFrameClick = (frameId) => {
    setActiveFrameId(frameId);
    setPhotoMapping([...Array(photoCount)].map((_, i) => (photos[i] !== undefined ? i : null)));
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    setFrame(activeFrameId);
    setFramePhotosMapping(photoMapping);
    setIsModalOpen(false);
    navigate('/result');
  };

  return (
    <div className="h-screen overflow-y-auto md:overflow-hidden bg-silk flex flex-col font-sans relative">
      {/* Decorative background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-40 mix-blend-overlay z-0"
        style={{ backgroundImage: "url('/bg_landingpage.png')" }}
      />

      <main className="relative z-10 flex-1 p-3 sm:p-4 md:p-6 max-w-[1100px] mx-auto w-full flex flex-col gap-4 sm:gap-6 min-h-0">
        <div className="text-center space-y-1.5 sm:space-y-2 flex-shrink-0">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-serif font-semibold text-wood">Select Your Frame</h1>
          <p className="text-wood/60 font-sans text-[10px] sm:text-[11px] md:text-[13px] max-w-xl mx-auto leading-relaxed">
            Click on a frame design to select and arrange your captured photos.
          </p>
        </div>

        {/* Mobile: scrollable single column, Desktop: grid */}
        <div className={`grid gap-3 sm:gap-4 md:gap-6 flex-1 min-h-0 ${
          filteredFrames.length === 1 
            ? 'grid-cols-1 max-w-[420px] mx-auto w-full' 
            : 'grid-cols-1 sm:grid-cols-2 sm:grid-rows-2'
        }`}>
          {filteredFrames.map((frameData) => (
            <motion.div
              key={frameData.id}
              whileHover={{ y: -2 }}
              onClick={() => handleSelect(frameData.id)}
              className="bg-white rounded-[14px] sm:rounded-[20px] p-3 sm:p-4 shadow-[0_15px_40px_rgba(48,21,14,0.04)] overflow-hidden transition-all group cursor-pointer border border-transparent hover:border-wood/10 flex flex-col min-h-0 animate-fadeIn"
            >
              {/* Frame Preview - Click to open modal */}
              <div 
                className="flex-1 min-h-[120px] sm:min-h-0 w-full rounded-lg sm:rounded-xl overflow-hidden relative bg-[#F8F5F2] mb-3 sm:mb-4 group-hover:ring-2 ring-wood/20 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFrameClick(frameData.id);
                }}
              >
                <img 
                  src={frameData.image} 
                  alt={frameData.name}
                  className="absolute inset-0 w-full h-full object-contain p-2 sm:p-3"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="bg-white/90 text-wood px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[9px] sm:text-[10px] font-bold tracking-widest uppercase shadow-sm">
                    Arrange Photos
                  </span>
                </div>
              </div>

              {/* Name, Description & Select Button */}
              <div className="flex items-center justify-between mt-auto flex-shrink-0">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <h3 className="text-base sm:text-xl md:text-2xl font-serif font-medium text-wood truncate">{frameData.name}</h3>
                  <p className="text-[8px] sm:text-[9px] md:text-[11px] text-wood/50 font-sans tracking-wide hidden sm:block">{frameData.desc}</p>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(frameData.id);
                  }}
                  className={`px-3 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all flex-shrink-0 ml-2 sm:ml-4 border cursor-pointer ${selectedFrame === frameData.id ? 'bg-[#30150E] text-[#FDFBF9] border-[#30150E]' : 'bg-[#EFE6DC] text-[#30150E] border-transparent hover:bg-[#E5D7CA]'}`}
                >
                  {selectedFrame === frameData.id ? 'SELECTED' : 'SELECT →'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Photo Arrangement Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-wood/80 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#FDFBF9] w-full max-w-2xl rounded-[18px] sm:rounded-[24px] shadow-2xl p-4 sm:p-6 md:p-8 flex flex-col max-h-[90vh]"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 text-wood/50 hover:text-wood transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <div className="text-center mb-4 sm:mb-8">
                <h2 className="text-xl sm:text-3xl font-serif text-wood font-medium">Arrange Your Photos</h2>
                <p className="text-[10px] sm:text-xs text-wood/60 mt-1.5 sm:mt-2 font-sans">Select the photo order for your final composition.</p>
              </div>

              <div className="flex-1 overflow-y-auto min-h-0 px-1 sm:px-2">
                <div className={`grid gap-3 sm:gap-4 ${photoCount === 6 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
                  {photoMapping.map((photoIndex, slotIndex) => (
                    <div key={slotIndex} className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-sm border border-wood/5 flex flex-col gap-2 sm:gap-3">
                      <div className="text-[9px] sm:text-[10px] font-bold tracking-widest text-wood/40 uppercase">Slot {slotIndex + 1}</div>
                      <div className="aspect-[4/3] w-full relative bg-wood/5 rounded-md sm:rounded-lg overflow-hidden border border-wood/10">
                        {photoIndex !== null && photos[photoIndex] ? (
                          <img src={photos[photoIndex]} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-wood/20 text-[10px] sm:text-xs">Empty</div>
                        )}
                      </div>
                      <div className="flex gap-1.5 sm:gap-2">
                        {photos.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              const newMapping = [...photoMapping];
                              newMapping[slotIndex] = i;
                              setPhotoMapping(newMapping);
                            }}
                            className={`flex-1 py-1 sm:py-1.5 rounded-md text-[9px] sm:text-[10px] font-bold transition-colors cursor-pointer ${photoIndex === i ? 'bg-wood text-white' : 'bg-wood/5 text-wood/50 hover:bg-wood/10'}`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 sm:mt-8 flex justify-end flex-shrink-0">
                <button
                  onClick={handleConfirm}
                  className="bg-[#530F0E] text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-full text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase shadow-lg hover:bg-[#3f0b0a] transition-all flex items-center gap-2 cursor-pointer"
                >
                  Confirm Frame
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SelectFrame;
