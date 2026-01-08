// PWA Install Banner - Shows install prompt on mobile browsers
import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

const PWAInstallBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    const dismissed = localStorage.getItem('pwa_banner_dismissed');
    if (dismissed) return;

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // Detect iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    // Show banner on mobile devices
    const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // On Android, wait for beforeinstallprompt event
      if (!ios) {
        const handler = (e) => {
          e.preventDefault();
          setDeferredPrompt(e);
          setShowBanner(true);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
      } else {
        // On iOS, show instructions banner after a delay
        const timer = setTimeout(() => setShowBanner(true), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa_banner_dismissed', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-300"
      data-testid="pwa-install-banner"
    >
      <div className="max-w-lg mx-auto bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl shadow-2xl shadow-violet-500/25 p-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-white font-semibold text-lg">Install GAAIUS AI</h3>
            {isIOS ? (
              <p className="text-white/80 text-sm mt-1">
                Tap <span className="inline-flex items-center px-1.5 py-0.5 bg-white/20 rounded text-xs font-medium">
                  <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L12 15M12 15L7 10M12 15L17 10M5 20H19" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Share
                </span> then <span className="font-medium">"Add to Home Screen"</span>
              </p>
            ) : (
              <p className="text-white/80 text-sm mt-1">
                Get the full app experience with offline access
              </p>
            )}
          </div>
          
          <button 
            onClick={handleDismiss}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5 text-white/80" />
          </button>
        </div>
        
        {!isIOS && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleDismiss}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              Not now
            </button>
            <button
              onClick={handleInstall}
              className="flex-1 px-4 py-2.5 text-sm font-medium bg-white text-violet-600 rounded-xl hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
              data-testid="pwa-install-btn"
            >
              <Download className="w-4 h-4" />
              Install App
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PWAInstallBanner;
