import { Toaster } from "sonner";
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
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="text-center max-w-4xl mx-auto">
        {/* Main Logo/Title */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-2xl">
            SkyLands<span className="text-yellow-300">MC</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 font-medium drop-shadow-lg">
            The Ultimate Skyblock Experience
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="mb-12">
          <div className="flex justify-center items-center space-x-4 mb-6">
            <div className="w-16 h-1 bg-yellow-300 rounded"></div>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            </div>
            <div className="w-16 h-1 bg-yellow-300 rounded"></div>
          </div>
          <p className="text-lg text-blue-50 max-w-2xl mx-auto leading-relaxed">
            Build your island empire in the clouds. Trade, compete, and conquer the skies with friends in our premium Skyblock server.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <button
            onClick={() => window.open('https://shop.skylandsmc.com', '_blank')}
            className="group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 min-w-[200px]"
          >
            <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z" clipRule="evenodd" />
            </svg>
            <span className="text-lg">Visit Store</span>
          </button>

          <button
            onClick={() => window.open('https://discord.gg/ZYCE37UfhQ', '_blank')}
            className="group bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold py-4 px-8 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 min-w-[200px]"
          >
            <svg className="w-6 h-6 group-hover:bounce" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span className="text-lg">Join Discord</span>
          </button>
        </div>

        {/* Server Status */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-white mb-2">Server Status</h3>
            <p className="text-blue-100 text-sm">play.skylandsmc.com</p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="flex items-center justify-center mb-2">
                  <div className={`w-3 h-3 rounded-full mr-2 ${serverStatus?.online ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <div className="text-2xl font-bold text-white">
                    {serverStatus?.online ? 'Online' : 'Offline'}
                  </div>
                </div>
                <div className="text-blue-100">Server Status</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-yellow-300 mb-2">
                  {serverStatus?.players.online || 0}
                </div>
                <div className="text-blue-100">Players Online</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-yellow-300 mb-2">
                  {serverStatus?.players.max || 0}
                </div>
                <div className="text-blue-100">Max Players</div>
              </div>
            </div>
          )}
          
          {serverStatus?.lastUpdated && (
            <div className="mt-4 text-xs text-blue-200">
              Last updated: {new Date(serverStatus.lastUpdated).toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-blue-200 text-sm">
          <p>© 2025 SkyLandsMC. All rights reserved.</p>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
