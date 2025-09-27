import { Toaster, toast } from "sonner";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useEffect, useState } from "react";

interface ServerStatus {
  online: boolean;
  players: {
    online: number;
    max: number;
  };
  version: string;
  motd: string;
  lastUpdated: number;
  error?: string;
}

export default function App() {
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const backgroundVideo = useQuery(api.videos.getBackgroundVideo);
  const logoUrl = useQuery(api.videos.getLogo);

  // Function to copy server IP to clipboard
  const copyServerIP = async () => {
    const serverIP = "play.skylandsmc.com";
    try {
      await navigator.clipboard.writeText(serverIP);
      toast.success("Server IP copied to clipboard!", {
        duration: 2000,
        style: {
          background: '#10b981',
          color: 'white',
          border: 'none',
        },
      });
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = serverIP;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success("Server IP copied to clipboard!", {
        duration: 2000,
        style: {
          background: '#10b981',
          color: 'white',
          border: 'none',
        },
      });
    }
  };

  // Fetch server status on component mount and every 30 seconds
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('https://api.mcsrvstat.us/3/play.skylandsmc.com');
        const data = await response.json();
        
        setServerStatus({
          online: data.online || false,
          players: {
            online: data.players?.online || 0,
            max: data.players?.max || 0,
          },
          version: data.version || "Unknown",
          motd: data.motd?.clean?.[0] || "SkyLandsMC",
          lastUpdated: Date.now(),
        });
      } catch (error) {
        console.error("Failed to fetch server status:", error);
        setServerStatus({
          online: false,
          players: {
            online: 0,
            max: 0,
          },
          version: "Unknown",
          motd: "SkyLandsMC",
          lastUpdated: Date.now(),
          error: "Failed to fetch server status",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Video Background */}
      {backgroundVideo?.url && (
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            crossOrigin="anonymous"
            className="w-full h-full object-cover opacity-40"
            style={{
              willChange: 'auto',
              transform: 'translateZ(0)',
            }}
            onLoadStart={() => {
              const video = document.querySelector('video');
              if (video) {
                video.playbackRate = 1.0;
                video.defaultPlaybackRate = 1.0;
              }
            }}
          >
            <source src={backgroundVideo.url} type={backgroundVideo.type} />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70"></div>
        </div>
      )}

      {/* Main Container */}
      <div className="relative z-10 min-h-screen">
        {/* Header Section */}
        <header className="pt-8 pb-4">
          <div className="container mx-auto px-6">


            {/* Logo/Title Section */}
            <div className="text-center mb-12 relative">
              {logoUrl ? (
                <div className="mb-6 relative">
                  <img 
                    src={logoUrl} 
                    alt="SkyLandsMC Logo" 
                    className="h-40 md:h-64 w-auto mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                  />

                </div>
              ) : (
                <div className="relative">
                  <h1 className="text-6xl md:text-9xl lg:text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-6 drop-shadow-2xl leading-tight">
                    SkyLands<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">MC</span>
                  </h1>

                </div>
              )}
              
              <h2 className="text-xl md:text-3xl text-white font-bold mb-4 drop-shadow-lg">
                The Ultimate Skyblock Experience
              </h2>
              <p className="text-base md:text-lg text-blue-100/80 max-w-2xl mx-auto leading-relaxed mb-6">
                Build your island empire in the clouds. Trade, compete, and conquer the skies with friends.
              </p>
              
              {/* Beta Badge centered below description */}
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-xl animate-pulse">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  🎉 BETA NOW LIVE 🎉
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <main className="container mx-auto px-6 pb-8">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            
            {/* Left Column - Server Info */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Server IP Card */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-4 text-center">Connect Now</h3>
                <div className="text-center">
                  <p className="text-blue-100 mb-3">Server IP:</p>
                  <button
                    onClick={copyServerIP}
                    className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-mono font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 flex items-center gap-3 mx-auto"
                    title="Click to copy server IP"
                  >
                    play.skylandsmc.com
                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Server Status Card */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Server Status</h3>
                
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500/30 border-t-blue-500"></div>
                      <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-4 border-blue-500/20"></div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center justify-center mb-2">
                        <div className={`w-3 h-3 rounded-full mr-2 ${serverStatus?.online ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                        <div className="text-lg font-bold text-white">
                          {serverStatus?.online ? 'Online' : 'Offline'}
                        </div>
                      </div>
                      <div className="text-blue-200 text-sm">Status</div>
                    </div>
                    
                    <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
                        {serverStatus?.players.online || 0}
                      </div>
                      <div className="text-blue-200 text-sm">Players</div>
                    </div>
                    
                    <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                        {serverStatus?.players.max || 0}
                      </div>
                      <div className="text-blue-200 text-sm">Max</div>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column - Action Buttons */}
            <div className="space-y-6">
              
              {/* Store Button */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
                <h4 className="text-xl font-bold text-white mb-4 text-center">Store</h4>
                <button
                  onClick={() => window.open('https://shop.skylandsmc.com', '_blank')}
                  className="w-full group relative bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg relative z-10">Visit Store</span>
                </button>
                <p className="text-blue-200/80 text-sm text-center mt-3">
                  Get ranks, items, and more!
                </p>
              </div>

              {/* Discord Button */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
                <h4 className="text-xl font-bold text-white mb-4 text-center">Community</h4>
                <button
                  onClick={() => window.open('https://discord.gg/ZYCE37UfhQ', '_blank')}
                  className="w-full group relative bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <svg className="w-6 h-6 group-hover:bounce relative z-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  <span className="text-lg relative z-10">Join Discord</span>
                </button>
                <p className="text-blue-200/80 text-sm text-center mt-3">
                  Chat with players & get support
                </p>
              </div>





            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 pb-6">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 max-w-md mx-auto">
                <p className="text-blue-200/80 text-sm">© 2025 SkyLandsMC. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
      
      <Toaster />
    </div>
  );
}
