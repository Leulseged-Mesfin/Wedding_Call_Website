import React, { useState, useEffect, useRef, useCallback } from 'react';
import heroImage from './assets/DSC04429.JPG';
import heroImage2 from './assets/DSC04750.JPG';
import pageBackground from './assets/DSC04655.JPG';
import qrCode from './assets/qrcode.png';
 
/**
 * Asnake & Dr. Tsion — Wedding Invitation
 * Self-contained React component.
 *
 * Dynamically loads all JPG images from assets folder
 */

// ---------- Dynamically load all JPG images from assets folder ----------
const imageModules = import.meta.glob('./assets/*.{JPG,jpg,JPEG,jpeg}', { eager: true });
const GALLERY_IMAGES = Object.values(imageModules)
  .map((mod) => mod.default)
  .filter((img) => !img.includes('react.svg')); // Filter out non-image files

// ---------- Google Maps links for the 3 locations ----------
const LOCATIONS = [
  {
    id: 'groom',
    title: "Groom's House",
    icon: '🏠',
    // Replace these URLs with your exact Google Maps share links if needed
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.633017652979!2d38.480898675595206!3d7.052336492949958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x17b14500688dd985%3A0xca89012283fd6cba!2sDiaspora!5e0!3m2!1sen!2set!4v1791535056239!5m2!1sen!2set",
    mapsUrl: "https://maps.app.goo.gl/XHoogCa5fDiSsLW79",
  },
  {
    id: 'bride',
    title: "Bride's House",
    icon: '🏠',
    embedUrl:
      // 'https://maps.google.com/maps?q=Kidus+Gabriel+Hospital,Hawassa&t=&z=16&ie=UTF8&iwloc=&output=embed',
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.841018191744!2d38.48487037559505!3d7.027965792973863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x17b14f00007e3e85%3A0x76b023fbe588f999!2sAlamura%20Secondary%20School!5e0!3m2!1sen!2set!4v1791534863162!5m2!1sen!2set"
  ,
    mapsUrl:
      "https://maps.app.goo.gl/Qh1u5ru3cVU1zFKU7",
  },
  {
    id: 'joshua',
    title: 'Joshua Campaign',
    icon: '🏰',
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.370900853138!2d38.47714567559548!3d7.082928992919984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x17b15bd3b2cc1aef%3A0xf19db30641066bcf!2sJoshua%20Campaign%20Ethiopia%20Hawasa%20Office!5e0!3m2!1sen!2set!4v1791535237639!5m2!1sen!2set",
    mapsUrl:
      "https://maps.app.goo.gl/6D2EGxUt59Hg3ris8",
  },
];

const WEDDING_TARGET = new Date('2026-05-03T09:00:00+03:00').getTime();

const AUDIO_SRC =
  'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=soft-piano-113337.mp3';

// Custom styles – Poppins
const customStyles = `
  .font-poppins { font-family: 'Poppins', system-ui, -apple-system, sans-serif; }
  .font-serif { font-family: 'Playfair Display', Georgia, serif; }
  .gold-glow-text {
    text-shadow: 0 0 16px rgba(229, 184, 59, 0.45), 0 0 2px rgba(250, 227, 146, 0.8);
  }
  .gold-box-glow { box-shadow: 0 0 25px rgba(229, 184, 59, 0.22); }
  .gold-border-glow {
    border: 1.5px solid #d4af37;
    box-shadow: 0 0 14px rgba(212, 175, 55, 0.35);
  }
  ::-webkit-scrollbar { display: none; }
  body {
    -ms-overflow-style: none;
    scrollbar-width: none;
    background-color: #0b0b0c;
    font-family: 'Poppins', system-ui, -apple-system, sans-serif;
  }
  @keyframes pulseSoft {
    0%, 100% { transform: scale(1); opacity: 0.95; }
    50% { transform: scale(1.04); opacity: 1; }
  }
  .animate-pulse-soft { animation: pulseSoft 2.4s infinite ease-in-out; }
  @keyframes soundWave {
    0% { height: 4px; }
    50% { height: 16px; }
    100% { height: 4px; }
  }
  .wave-bar-1 { animation: soundWave 1.2s infinite ease-in-out; }
  .wave-bar-2 { animation: soundWave 0.9s infinite 0.2s ease-in-out; }
  .wave-bar-3 { animation: soundWave 1.4s infinite 0.4s ease-in-out; }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-in { animation: fadeIn 0.5s ease-out; }

  /* Timeline */
  .timeline-line {
    background: linear-gradient(180deg, #e5b83b 0%, #c59b27 40%, #9d781b 70%, transparent 100%);
  }
  .timeline-card {
    background: linear-gradient(135deg, #1a1712 0%, #141416 50%, #0d0d0f 100%);
    border: 1px solid rgba(229, 184, 59, 0.35);
    box-shadow: 0 8px 32px rgba(229, 184, 59, 0.15), inset 0 1px 0 rgba(250, 227, 146, 0.1);
  }
  .timeline-card:hover {
    border-color: rgba(229, 184, 59, 0.6);
    box-shadow: 0 12px 40px rgba(229, 184, 59, 0.2), inset 0 1px 0 rgba(250, 227, 146, 0.15);
  }
  .timeline-dot {
    background: radial-gradient(circle at 30% 30%, #fae392, #e5b83b 60%, #c59b27);
    box-shadow: 0 0 0 4px rgba(229, 184, 59, 0.25), 0 0 18px rgba(229, 184, 59, 0.55);
  }
  .gold-gradient-text {
    background: linear-gradient(90deg, #fae392, #e5b83b, #c59b27, #fae392);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

function WeddingInvitation() {
  const [screen, setScreen] = useState('cover');
  const [coverOpacity, setCoverOpacity] = useState(1);
  const [transitionOpacity, setTransitionOpacity] = useState(1);
  const [countdownDigit, setCountdownDigit] = useState(3);

  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef(null);

  const [timer, setTimer] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [galleryImages, setGalleryImages] = useState(GALLERY_IMAGES);
  const [imgOpacity, setImgOpacity] = useState(1);

  const [rsvpForm, setRsvpForm] = useState({
    name: '',
    attendance: '',
    relation: '',
    message: '',
  });
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [rsvpSuccessName, setRsvpSuccessName] = useState('');

  // Inject styles + Poppins font
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-wedding-styles', 'true');
    styleEl.textContent = customStyles;
    document.head.appendChild(styleEl);

    if (!document.querySelector('link[href*="Poppins"]')) {
      const preconnect1 = document.createElement('link');
      preconnect1.rel = 'preconnect';
      preconnect1.href = 'https://fonts.googleapis.com';
      document.head.appendChild(preconnect1);

      const preconnect2 = document.createElement('link');
      preconnect2.rel = 'preconnect';
      preconnect2.href = 'https://fonts.gstatic.com';
      preconnect2.crossOrigin = '';
      document.head.appendChild(preconnect2);

      const fontLink = document.createElement('link');
      fontLink.href =
        'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,500&display=swap';
      fontLink.rel = 'stylesheet';
      document.head.appendChild(fontLink);
    }

    if (window.tailwind) {
      window.tailwind.config = {
        theme: {
          extend: {
            colors: {
              gold: {
                300: '#fae392',
                400: '#f6ce58',
                500: '#e5b83b',
                600: '#c59b27',
                700: '#9d781b',
              },
              darkBg: '#0f0f11',
              cardBg: '#1b1b1e',
              subtleBorder: '#2e2b24',
            },
            fontFamily: {
              sans: ['"Poppins"', 'system-ui', '-apple-system', 'sans-serif'],
              poppins: ['"Poppins"', 'system-ui', '-apple-system', 'sans-serif'],
              serif: ['"Playfair Display"', 'Georgia', 'serif'],
            },
          },
        },
      };
    }

    return () => {
      styleEl.remove();
    };
  }, []);

  // Countdown
  useEffect(() => {
    const update = () => {
      const now = Date.now();
      let diff = WEDDING_TARGET - now;
      if (diff < 0) diff = Math.abs(diff);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimer({ days, hours, mins: minutes, secs: seconds });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // Transition countdown
  useEffect(() => {
    if (screen !== 'transition') return;
    setCountdownDigit(3);
    let n = 3;
    const id = setInterval(() => {
      n -= 1;
      if (n > 0) {
        setCountdownDigit(n);
      } else {
        clearInterval(id);
        revealMainPage();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [screen]);

  const startCountdownScreen = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.paused) {
      audio.play().catch(() => {});
    }
    setCoverOpacity(0);
    setTimeout(() => {
      setScreen('transition');
      setTransitionOpacity(1);
    }, 400);
  }, []);

  const revealMainPage = useCallback(() => {
    setTransitionOpacity(0);
    setTimeout(() => {
      setScreen('main');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 350);
  }, []);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const showSlide = (idx) => {
    const next = (idx + galleryImages.length) % galleryImages.length;
    setImgOpacity(0.3);
    setTimeout(() => {
      setCurrentSlide(next);
      setImgOpacity(1);
    }, 150);
  };

  const nextSlide = () => showSlide(currentSlide + 1);
  const prevSlide = () => showSlide(currentSlide - 1);

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    setRsvpSuccessName(rsvpForm.name || 'dear guest');
    setRsvpSuccess(true);
    setTimeout(() => {
      setRsvpForm({ name: '', attendance: '', relation: '', message: '' });
    }, 1500);
  };

  return (
    <div className="text-neutral-100 min-h-screen w-full bg-[#0b0b0c] antialiased select-none font-poppins overflow-x-hidden">
      <div className="w-full min-h-screen relative flex flex-col bg-black overflow-x-hidden">
        {/* Floating Audio Player */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <button
            type="button"
            onClick={toggleAudio}
            className="flex items-center gap-2 bg-neutral-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-gold-500/50 shadow-lg text-xs font-medium text-gold-300 transition-all active:scale-95"
          >
            <span
              className={`flex items-end gap-0.5 h-4 w-3.5 pb-0.5 ${!isPlaying ? 'opacity-30' : ''}`}
            >
              <span className="w-0.5 bg-gold-400 rounded-full wave-bar-1" />
              <span className="w-0.5 bg-gold-400 rounded-full wave-bar-2" />
              <span className="w-0.5 bg-gold-400 rounded-full wave-bar-3" />
            </span>
            <span>{isPlaying ? 'Music: ON' : 'Music: OFF'}</span>
          </button>
          <audio ref={audioRef} loop preload="none">
            <source src={AUDIO_SRC} type="audio/mp3" />
          </audio>
        </div>

        {/* ========== Cover ========== */}
        {screen === 'cover' && (
          <section
            className="relative w-full h-screen min-h-[660px] lg:min-h-[800px] flex flex-col items-center justify-between text-center overflow-hidden transition-opacity duration-700"
            style={{ opacity: coverOpacity }}
          >
            <div className="absolute inset-0 z-0">
              <img
                alt="Dr Fikre & Eyerusalem"
                className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.05]"
                // src="/assets/DSC04429.jpg"
                // onError={(e) => {
                //   e.currentTarget.src =
                //     'https://lh3.googleusercontent.com/aida-public/AB6AXuCYJetjLcTIahBIAfpwYftYw15eodr93V6xT4j_aRfUIW8Q-ZgDj36bOj_I_BTsAJogXycJr5-5Sho-NuadU6wYHR_ear9N6N9jhAXoJb2suLtTDb980djqqX5fIG3z1wS0HZULNqd-OAUvM-5znJZA1wOj8U2498YU1wT4KlydVGABF5Vc99zSN0QNUipbH0T8jSdHEz62vqh3ve2TKaeaE7XUELche7InDIEurGjwXiVNxaMZ_cM9';
                // }}
                src={heroImage}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/90" />
            </div>
            <div className="relative z-10 pt-16" />
            <div className="relative z-10 px-6 flex flex-col items-center">
              <h1 className="text-[2.75rem] sm:text-[3.4rem] leading-[1.15] font-semibold text-[#edd588] tracking-wide gold-glow-text mb-2">
                Dr Fikre &amp; Eyerusalem
              </h1>
              <div className="flex items-center justify-center gap-2 text-gold-300 text-lg sm:text-xl tracking-wide mt-2">
                <span>💛</span>
                <span className="tracking-[0.2em] uppercase font-light text-white text-base sm:text-lg">
                  Wedding Invitation
                </span>
                <span>💛</span>
              </div>
              <button
                type="button"
                onClick={startCountdownScreen}
                className="mt-12 px-8 py-3.5 rounded-full bg-black/40 backdrop-blur-md border border-gold-500/80 text-gold-300 text-base font-medium flex items-center justify-center gap-2.5 transition-all transform active:scale-95 shadow-[0_0_22px_rgba(234,179,8,0.3)] hover:bg-black/60"
              >
                <span>👇</span>
                <span className="tracking-wide text-gold-200">Tap to Enter</span>
                <span>👇</span>
              </button>
            </div>
            <div className="relative z-10 pb-12 text-xs text-neutral-400 font-light tracking-widest uppercase">
              Hawassa, Ethiopia
            </div>
          </section>
        )}

        {/* ========== Transition ========== */}
        {screen === 'transition' && (
          <section
            className="fixed inset-0 z-40 w-full h-screen flex flex-col items-center justify-between text-center overflow-hidden transition-opacity duration-500 bg-black"
            style={{ opacity: transitionOpacity }}
          >
            <div className="absolute inset-0 z-0">
              <img
                alt="Dr Fikre & Eyerusalem Wedding"
                className="w-full h-full object-cover object-center filter brightness-[0.72]"
                // src="/assets/DSC04429.jpg"
                // onError={(e) => {
                //   e.currentTarget.src =
                //     'https://lh3.googleusercontent.com/aida-public/AB6AXuAiL2ldMf1yJEKQ6gEHc1YpB-YUC525k5lww7K8GBkgUVChoz27VyQn5S5sX6I3wBGvxvuB8VftNArX7-d7SUqrMA3CbLe8LJSdxRxsCqn2_6-qJhJhgRaDLG6LXMAHNaAbbNR_EEwAji81rHW_dXDYwmZ-kmq1dHZqha7uL5ZdXxbXdHOYPbibHlINw677sTYHEWtfBZJrj6szUegPW5zx9w-5CH0g6Q8QSu1yCMJSwsV_Z_i0tYc4';
                // }}
                src={heroImage2}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/85" />
            </div>
            <div className="relative z-10 pt-20 px-4 flex flex-col items-center">
              <h2 className="text-4xl sm:text-5xl font-semibold text-[#eed58a] gold-glow-text mb-3 tracking-wide">
                October 24, 2026
              </h2>
              <div className="inline-block px-6 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-neutral-200 text-base tracking-widest">
                Tikimt 14, 2019
              </div>
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center my-auto">
              <div className="text-7xl sm:text-8xl font-extrabold text-gold-400 gold-glow-text animate-pulse-soft transition-all duration-300">
                {countdownDigit}
              </div>
              <p className="text-xs tracking-widest text-gold-200/80 uppercase mt-2 font-medium">
                Entering Celebration
              </p>
            </div>
            <div className="relative z-10 pb-16 px-6 w-full max-w-xs">
              <button
                type="button"
                onClick={revealMainPage}
                className="w-full py-3.5 rounded-full bg-black/50 backdrop-blur-md border border-gold-500 text-gold-300 font-medium text-base tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(234,179,8,0.35)] hover:bg-black/70"
              >
                <span>✨</span>
                <span>Continue</span>
                <span>✨</span>
              </button>
            </div>
          </section>
        )}

        {/* ========== Main Content ========== */}
        {screen === 'main' && (
          <main className="relative z-20 w-full flex flex-col pb-24 text-neutral-200 bg-[#0d0d0f] animate-fade-in items-center">
            {/* Fixed background for Save The Date section */}
            <div className="fixed left-1/2 -translate-x-1/2 top-0 h-screen w-full max-w-6xl z-0 pointer-events-none">
              <img
                alt="Background"
                className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-[1.1]"
                src={pageBackground}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
            </div>
            {/* Hero */}
            <div className="p-4 pt-6 w-full max-w-6xl mx-auto relative z-10">
              <div className="relative w-full h-[600px] lg:h-[620px] rounded-[2.5rem] overflow-hidden border border-neutral-800/80 shadow-2xl">
                <img
                  alt="Dr Fikre & Eyerusalem"
                  className="w-full h-full object-cover object-center filter brightness-[0.92]"
                  src={heroImage}
                />
                <div className="absolute bottom-6 inset-x-6">
                  <div className="bg-black/75 backdrop-blur-md rounded-full py-3 px-6 border border-gold-500/30 text-center shadow-lg">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-gold-300 tracking-wide gold-glow-text">
                      Dr Fikre &amp; Eyerusalem
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Save The Date */}
            <section className="px-4 mt-2 w-full max-w-6xl mx-auto relative z-10">
              <div className="relative w-full min-h-[600px] rounded-[2.5rem] overflow-hidden border border-neutral-800/80 shadow-2xl p-6 text-center bg-transparent backdrop-blur-sm">
                <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-xl">💛</span>
                  <h3 className="text-2xl font-bold tracking-wide text-white font-serif">
                    Save the Date
                  </h3>
                  <span className="text-xl">💛</span>
                </div>
                <p className="text-sm text-gold-200 italic tracking-wide mb-6 font-serif">
                  October 24, 2026  | ጥቅምት 14, 2019
                </p>

                <div className="bg-black/50 backdrop-blur-sm rounded-3xl mx-20 p-5 lg:p-6 border border-gold-500/40 mb-6">
                  <div className="flex items-center justify-center gap-2 text-[#ecd68f] text-base font-semibold mb-4">
                    <span>📅</span>
                    <span>ጥቅምት 2019 (October 2026)</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-[11px] lg:text-xs font-bold text-gold-400 uppercase tracking-wider mb-3">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                      <div key={d}>{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-y-2.5 text-xs lg:text-sm text-neutral-300 font-medium items-center">
                    <div /><div /><div /><div />
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map(
                      (n) => (
                        <div key={n} className="py-1">
                          {n}
                        </div>
                      )
                    )}
                    <div className="flex items-center justify-center">
                      <span className="w-8 h-8 rounded-full bg-yellow-500 text-black font-extrabold flex items-center justify-center shadow-[0_0_12px_rgba(229,184,59,0.7)] text-sm">
                        24
                      </span>
                    </div>
                    {[25, 26, 27, 28, 29, 30].map((n) => (
                      <div key={n} className="py-1">
                        {n}
                      </div>
                    ))}
                    <div />
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider text-gold-300 uppercase mb-3">
                  <span>💛</span>
                  <span>COUNTDOWN TO OUR BLESSED DAY</span>
                  <span>💛</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
                  {['days', 'hours', 'mins', 'secs'].map((key, i) => (
                    <div
                      key={key}
                      className="bg-black/60 backdrop-blur-sm border border-gold-500/70 rounded-full py-2.5 px-4 text-center"
                    >
                      <span className="text-base lg:text-lg font-bold text-white tracking-wide">
                        {timer[key]} {['Days', 'Hrs', 'Min', 'Sec'][i]}
                      </span>
                    </div>
                  ))}
                </div>
                </div>
              </div>
            </section>

            {/* Event Timeline */}
            <section className="px-4 mt-10 w-full max-w-6xl mx-auto relative z-10">
              <div className="relative rounded-[2.5rem] overflow-hidden border border-gold-600/30 shadow-2xl bg-gradient-to-br from-[#1a1712] via-[#141416] to-[#0d0d0f] p-6 lg:p-10">
                <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[480px] h-[280px] rounded-full bg-gold-500/8 blur-3xl" />

                <div className="relative flex items-center justify-center gap-3 mb-10">
                  <span className="text-2xl">📅</span>
                  <h3 className="text-2xl lg:text-3xl font-bold tracking-wide gold-gradient-text">
                    Event Timeline
                  </h3>
                  <span className="text-2xl">✨</span>
                </div>

                <div className="relative pl-2 sm:pl-4">
                  <div className="absolute left-[22px] sm:left-[30px] top-3 bottom-6 w-[3px] timeline-line rounded-full opacity-80" />

                  <div className="space-y-8 lg:space-y-10">
                    {/* Morning */}
                    <div className="relative flex gap-5 sm:gap-7">
                      <div className="relative z-10 flex-shrink-0 mt-1">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full timeline-dot flex items-center justify-center text-black text-lg font-bold">
                          🌅
                        </div>
                      </div>
                      <div className="timeline-card flex-1 rounded-3xl p-5 lg:p-6 transition-all duration-300">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                          <span className="text-lg sm:text-xl font-bold text-gold-400 font-mono tracking-tight">
                            05:00 – 07:30
                          </span>
                          <span className="text-[10px] uppercase tracking-widest text-gold-600/90 font-semibold bg-gold-500/10 px-2.5 py-0.5 rounded-full border border-gold-500/20">
                            Morning
                          </span>
                        </div>
                        <h4 className="text-lg sm:text-xl font-semibold text-white mb-4">
                          Morning Program
                        </h4>
                        <div className="border-t border-gold-500/15 pt-3 space-y-2.5 text-sm text-neutral-300">
                          {[
                            ['04:00 – ', "ሙሽራው ቤት "],
                            ['04:30 – ', "ሙሽሪትን ከቤቷ መዉሰድ "],
                          ].map(([time, label]) => (
                            <div key={time} className="flex items-start gap-2.5">
                              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gold-400 flex-shrink-0 shadow-[0_0_6px_rgba(229,184,59,0.7)]" />
                              <span>
                                <strong className="text-gold-200">{time}</strong> {label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Ceremony */}
                    <div className="relative flex gap-5 sm:gap-7">
                      <div className="relative z-10 flex-shrink-0 mt-1">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full timeline-dot flex items-center justify-center text-black text-lg font-bold">
                          💍
                        </div>
                      </div>
                      <div className="timeline-card flex-1 rounded-3xl p-5 lg:p-6 transition-all duration-300">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                          <span className="text-lg sm:text-xl font-bold text-gold-400 font-mono tracking-tight">
                            08:00 – 10:00
                          </span>
                          <span className="text-[10px] uppercase tracking-widest text-gold-600/90 font-semibold bg-gold-500/10 px-2.5 py-0.5 rounded-full border border-gold-500/20">
                            Ceremony
                          </span>
                        </div>
                        <h4 className="text-lg sm:text-xl font-semibold text-white mb-4">
                          Wedding Ceremony
                        </h4>
                        <div className="border-t border-gold-500/15 pt-3 space-y-2.5 text-sm text-neutral-300">
                          <div className="flex items-start gap-2.5">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gold-400 flex-shrink-0 shadow-[0_0_6px_rgba(229,184,59,0.7)]" />
                            <span>
                              {/* <strong className="text-gold-200">08:00 – 10:00</strong> Wedding Vows &amp; Ceremony at Joshua Camp */}
                              <strong className="text-gold-200">05:30 – </strong>  በቤተ-ክርስቲያን የቃል ኪዳን ሥነ-ሥርዓት( ሐዋሣ ሙሉ ወንጌል ቤተክርቲያን)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Celebration */}
                    <div className="relative flex gap-5 sm:gap-7">
                      <div className="relative z-10 flex-shrink-0 mt-1">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full timeline-dot flex items-center justify-center text-black text-lg font-bold">
                          🎉
                        </div>
                      </div>
                      <div className="timeline-card flex-1 rounded-3xl p-5 lg:p-6 transition-all duration-300">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                          <span className="text-lg sm:text-xl font-bold text-gold-400 font-mono tracking-tight">
                            10:00 – 01:00
                          </span>
                          <span className="text-[10px] uppercase tracking-widest text-gold-600/90 font-semibold bg-gold-500/10 px-2.5 py-0.5 rounded-full border border-gold-500/20">
                            Celebration
                          </span>
                        </div>
                        <h4 className="text-lg sm:text-xl font-semibold text-white mb-4">
                          Celebration
                        </h4>
                        <div className="border-t border-gold-500/15 pt-3 space-y-2.5 text-sm text-neutral-300">
                          {[
                            ['7:00 – ', 'የምሳ ግብዣ(Joshua Campaign, Hawassa)'],
                            ['8:00 – ', 'የኬክ ቆረሳ እና የአምልኮ'],
                            ['9:00 – ', 'የphoto ፕሮግራም '],
                            ['10:00 – ', 'የእንግዶች ሽኝት'],
                          ].map(([time, label]) => (
                            <div key={time} className="flex items-start gap-2.5">
                              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gold-400 flex-shrink-0 shadow-[0_0_6px_rgba(229,184,59,0.7)]" />
                              <span>
                                <strong className="text-gold-200">{time}</strong> {label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Locations – Google Maps links */}
            <section className="px-4 mt-10 w-full max-w-6xl mx-auto relative z-10">
              <div className="bg-gradient-to-br from-[#1a1712] via-[#141416] to-[#0d0d0f] border border-gold-600/30 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden">
                <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[480px] h-[280px] rounded-full bg-gold-500/8 blur-3xl" />
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className="text-2xl">📍</span>
                  <h3 className="text-2xl font-bold tracking-wide text-white">Locations</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {LOCATIONS.map((loc) => (
                    <div key={loc.id} className="flex flex-col items-center">
                      <div className="w-full flex items-center gap-2 text-gold-400 font-bold text-base lg:text-sm mb-3">
                        <span>{loc.icon}</span>
                        <span>{loc.title}</span>
                      </div>
                      <div className="w-full h-56 lg:h-48 rounded-3xl overflow-hidden relative border border-gold-600/40 bg-[#0d0d0f]">
                        <iframe
                          className="w-full h-full filter invert-[0.9] hue-rotate-180 contrast-125 opacity-70 pointer-events-none"
                          src={loc.embedUrl}
                          title={`${loc.title} Map`}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                        {/* <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4 text-center">
                          <span className="w-8 h-8 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg mb-2 animate-bounce">
                            📍
                          </span>
                          <span className="text-white text-xs lg:text-[10px] font-semibold tracking-wide bg-black/60 px-3 py-1 rounded-full">
                            Use two fingers to move the map
                          </span>
                        </div> */}
                      </div>
                      <a
                        className="w-full mt-3 py-3 rounded-full bg-yellow-500 text-black font-semibold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
                        href={loc.mapsUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <span>📍</span>
                        <span>Open in Google Maps</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Photo Carousel – exactly 20 images from /assets */}
            <section className="px-4 mt-10 w-full max-w-6xl mx-auto relative z-10">
              <div className="bg-gradient-to-br from-[#1a1712] via-[#141416] to-[#0d0d0f] border border-gold-600/30 rounded-[2.5rem] p-5 lg:p-8 shadow-2xl relative overflow-hidden">
                <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[480px] h-[280px] rounded-full bg-gold-500/8 blur-3xl" />
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-xl">✨</span>
                  <h3 className="text-2xl font-bold tracking-wide text-white">
                    Our Wedding in Photos
                  </h3>
                  <span className="text-xl">✨</span>
                </div>
                <p className="text-center text-xs text-neutral-400 mb-4">
                  {currentSlide + 1} / {galleryImages.length}
                </p>
                <div className="relative w-full lg:max-w-3xl mx-auto rounded-3xl overflow-hidden border border-gold-600/40 bg-[#0d0d0f] aspect-[3/4] max-h-[70vh]">
                  <img
                    alt={`Wedding photo ${currentSlide + 1}`}
                    className="w-full h-full object-cover transition-all duration-500 filter contrast-[1.05]"
                    style={{ opacity: imgOpacity }}
                    src={galleryImages[currentSlide]}
                  />
                  <button
                    type="button"
                    aria-label="Previous photo"
                    onClick={prevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gold-500 text-black font-bold flex items-center justify-center shadow-xl active:scale-90 transition-transform z-10"
                  >
                    ❮
                  </button>
                  <button
                    type="button"
                    aria-label="Next photo"
                    onClick={nextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gold-500 text-black font-bold flex items-center justify-center shadow-xl active:scale-90 transition-transform z-10"
                  >
                    ❯
                  </button>
                  <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-1 z-10 px-3 overflow-x-auto">
                    {galleryImages.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        aria-label={`Go to photo ${idx + 1}`}
                        onClick={() => showSlide(idx)}
                        className={`h-2 rounded-full transition-all flex-shrink-0 ${
                          idx === currentSlide ? 'bg-gold-400 w-5' : 'bg-neutral-500/70 w-2'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-neutral-400 px-1">
                  <span>Captured with Love · {galleryImages.length} Photos</span>
                </div>
              </div>
            </section>

            {/* RSVP */}
            <section className="px-4 mt-10 w-full max-w-6xl mx-auto relative z-10">
              <div className="bg-gradient-to-br from-[#1a1712] via-[#141416] to-[#0d0d0f] border border-gold-600/30 rounded-[2.5rem] p-6 lg:p-8 shadow-2xl relative overflow-hidden">
                <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[480px] h-[280px] rounded-full bg-gold-500/8 blur-3xl" />
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-xl">💌</span>
                  <h3 className="text-2xl font-bold tracking-wide text-white">
                    Will you attend?
                  </h3>
                </div>
                <form className="space-y-4 lg:space-y-5 max-w-xl mx-auto" onSubmit={handleRsvpSubmit}>
                  <input
                    className="w-full bg-[#1a1712] text-neutral-100 placeholder-neutral-400 text-sm rounded-full px-5 py-3.5 border border-gold-600/40 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
                    placeholder="Your Full Name"
                    required
                    type="text"
                    value={rsvpForm.name}
                    onChange={(e) => setRsvpForm((f) => ({ ...f, name: e.target.value }))}
                  />
                  <select
                    className="w-full bg-[#1a1712] text-neutral-100 text-sm rounded-full px-5 py-3.5 border border-gold-600/40 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors appearance-none"
                    required
                    value={rsvpForm.attendance}
                    onChange={(e) => setRsvpForm((f) => ({ ...f, attendance: e.target.value }))}
                  >
                    <option disabled value="">
                      Will you attend?
                    </option>
                    <option className="bg-neutral-900" value="yes">
                      Yes, with immense joy I will attend!
                    </option>
                    <option className="bg-neutral-900" value="no">
                      Regretfully cannot attend
                    </option>
                  </select>
                  <select
                    className="w-full bg-[#1a1712] text-neutral-100 text-sm rounded-full px-5 py-3.5 border border-gold-600/40 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors appearance-none"
                    required
                    value={rsvpForm.relation}
                    onChange={(e) => setRsvpForm((f) => ({ ...f, relation: e.target.value }))}
                  >
                    <option disabled value="">
                      Relation to Bride/Groom
                    </option>
                    <option className="bg-neutral-900" value="family">
                      Family
                    </option>
                    <option className="bg-neutral-900" value="friend">
                      Close Friend
                    </option>
                    <option className="bg-neutral-900" value="colleague">
                      Colleague
                    </option>
                    <option className="bg-neutral-900" value="church">
                      Church Member / Fellowship
                    </option>
                  </select>
                  <textarea
                    className="w-full bg-[#1a1712] text-neutral-100 placeholder-neutral-400 text-sm rounded-3xl px-5 py-3 border border-gold-600/40 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors resize-none"
                    placeholder="Your warm wishes for Asnake & Dr. Tsion..."
                    rows={3}
                    value={rsvpForm.message}
                    onChange={(e) => setRsvpForm((f) => ({ ...f, message: e.target.value }))}
                  />
                  <button
                    className="w-full py-3.5 rounded-full bg-yellow-500 hover:bg-gold-400 text-black font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                    type="submit"
                  >
                    <span>Send RSVP</span>
                    <span>💐</span>
                  </button>
                </form>
                {rsvpSuccess && (
                  <div className="mt-4 p-4 rounded-2xl bg-gold-500/20 border border-gold-500 text-gold-300 text-xs text-center leading-relaxed max-w-xl mx-auto">
                    ✨ <strong>Thank you {rsvpSuccessName}!</strong> Your warm RSVP has been
                    recorded. We cannot wait to celebrate with you in Hawassa! 💛
                  </div>
                )}
              </div>
            </section>

            {/* Share Moments */}
            <section className="px-4 mt-10 w-full max-w-6xl mx-auto relative z-10">
              <div className="bg-gradient-to-br from-[#1a1712] via-[#141416] to-[#0d0d0f] border border-gold-600/30 rounded-[2.5rem] p-6 shadow-2xl text-center relative overflow-hidden">
                <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[480px] h-[280px] rounded-full bg-gold-500/8 blur-3xl" />
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className="text-2xl">📸</span>
                  <h3 className="text-2xl sm:text-3xl font-semibold text-gold-300 tracking-wide gold-glow-text">
                    Share Your Moments
                  </h3>
                </div>
                <div className="relative inline-block mx-auto p-4 bg-white rounded-3xl shadow-[0_0_35px_rgba(255,255,255,0.45)] mb-5">
                   <img
                alt="Dr Fikre & Eyerusalem"
                className="w-50 h-50 object-cover object-center filter brightness-[0.78] contrast-[1.05]"
                // src="/assets/DSC04429.jpg"
                // onError={(e) => {
                //   e.currentTarget.src =
                //     'https://lh3.googleusercontent.com/aida-public/AB6AXuCYJetjLcTIahBIAfpwYftYw15eodr93V6xT4j_aRfUIW8Q-ZgDj36bOj_I_BTsAJogXycJr5-5Sho-NuadU6wYHR_ear9N6N9jhAXoJb2suLtTDb980djqqX5fIG3z1wS0HZULNqd-OAUvM-5znJZA1wOj8U2498YU1wT4KlydVGABF5Vc99zSN0QNUipbH0T8jSdHEz62vqh3ve2TKaeaE7XUELche7InDIEurGjwXiVNxaMZ_cM9';
                // }}
                src={qrCode}
              />
                </div>
                <p className="text-sm text-neutral-300 font-medium mb-4">
                  Scan QR code to send photos &amp; videos
                </p>
                <a
                  className="w-full max-w-xs mx-auto py-3 rounded-full bg-[#1e96d3] hover:bg-[#1880b4] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                  href="https://t.me/jituandfikre"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span>📱</span>
                  <span>Open Telegram Bot</span>
                </a>
              </div>
            </section>

            <footer className="mt-12 text-center px-4 max-w-6xl mx-auto relative z-10">
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Dr Fikre &amp; Eyerusalem — Eternal Love | October 24, 2026 | Hawassa, Ethiopia
              </p>
              <p className="text-[10px] text-neutral-600 mt-2">
                Made with heartfelt prayers &amp; joy 💛
              </p>
            </footer>
          </main>
        )}
      </div>
    </div>
  );
}

export default WeddingInvitation;