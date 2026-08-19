import { useState, useRef, useEffect } from 'react';
import { 
  Pause, 
  Play, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RotateCcw,
  VideoOff 
} from 'lucide-react';

const Editorial = ({ 
  secureurl, 
  secureUrl, 
  thumbnail, 
  thumbnailUrl, 
  duration: initialDuration,
  editorial 
}) => {
  // Support both camelCase and lowercase props from backend
  const videoSrc = secureurl || secureUrl;
  const posterSrc = thumbnail || thumbnailUrl;

  const containerRef = useRef(null);
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(Number(initialDuration) || 0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
      setIsMuted(newVol === 0);
    }
  };

  const handleSeek = (e) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const toggleFullScreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      }
    };
    const handleVideoEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleVideoEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleVideoEnded);
    };
  }, [videoSrc]);

  // Fallback view when no video is uploaded
  if (!videoSrc) {
    return (
      <div className="w-full h-80 rounded-xl bg-[#0d1117] border border-[#161b22] flex flex-col items-center justify-center text-gray-500 gap-3 p-6">
        <VideoOff size={40} className="text-gray-600 animate-pulse" />
        <p className="text-sm font-mono tracking-wide text-gray-400">
          NO_EDITORIAL_VIDEO_AVAILABLE
        </p>
        {editorial && (
          <div className="w-full mt-4 p-4 bg-[#050505] rounded-lg border border-[#30363d] text-left text-xs font-mono text-gray-300">
            <span className="text-indigo-600 font-bold">Text Solution: </span>
            {editorial}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Video Container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-black border border-[#161b22] group select-none"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          onClick={togglePlayPause}
          className="w-full aspect-video bg-black cursor-pointer object-contain"
        />

        {/* Center Play Overlay Icon on Pause */}
        {!isPlaying && (
          <div 
            onClick={togglePlayPause}
            className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer pointer-events-auto"
          >
            <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center pl-1 shadow-lg hover:scale-110 transition-transform">
              <Play size={28} />
            </div>
          </div>
        )}

        {/* Video Controls Bottom Overlay */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent px-4 py-3 transition-opacity duration-300 flex flex-col gap-2 ${
            isHovering || !isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Progress Timeline Slider */}
          <div className="w-full flex items-center gap-2">
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:h-2 transition-all"
            />
          </div>

          {/* Bottom Bar Controls */}
          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-4">
              {/* Play / Pause Toggle */}
              <button
                onClick={togglePlayPause}
                className="hover:text-indigo-600 transition-colors p-1"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>

              {/* Reset to Start */}
              <button
                onClick={() => {
                  if (videoRef.current) videoRef.current.currentTime = 0;
                }}
                className="hover:text-indigo-600 transition-colors p-1"
                title="Restart"
              >
                <RotateCcw size={16} />
              </button>

              {/* Volume Controls */}
              <div className="flex items-center gap-1.5 group/vol">
                <button onClick={toggleMute} className="hover:text-indigo-600 transition-colors">
                  {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Timestamp */}
              <span className="font-mono text-[11px] text-gray-300">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullScreen}
              className="hover:text-indigo-600 transition-colors p-1"
              title="Fullscreen"
            >
              <Maximize size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Optional Text Editorial / Notes */}
      {editorial && (
        <div className="p-4 bg-[#0d1117] border border-[#161b22] rounded-xl text-gray-300 font-mono text-xs">
          <h4 className="text-indigo-600 font-bold uppercase tracking-wider mb-2">Editorial Notes:</h4>
          <p className="whitespace-pre-line leading-relaxed">{editorial}</p>
        </div>
      )}
    </div>
  );
};

export default Editorial;