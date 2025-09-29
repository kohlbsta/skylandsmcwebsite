import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

interface VotePageProps {
  onNavigateHome: () => void;
}

export default function VotePage({ onNavigateHome }: VotePageProps) {
  const voteLinks = useQuery(api.voteLinks.list) || [];
  const backgroundVideo = useQuery(api.videos.getBackgroundVideo);

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
            className="w-full h-full object-cover"
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
        </div>
      )}

      {/* Background Pattern (fallback if no video) */}
      {!backgroundVideo?.url && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        </div>
      )}

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="pt-8 pb-6">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <button
                onClick={onNavigateHome}
                className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-6 group"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </button>
              
              <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-4">
                Vote for SkyLandsMC
              </h1>
              <p className="text-lg text-blue-100/80 max-w-2xl mx-auto">
                Support our server by voting on these platforms. Your votes help us grow and improve!
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 pb-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Vote Links Grid */}
            {voteLinks.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {voteLinks.map((link, index) => (
                  <div
                    key={link._id}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors">
                        {link.name}
                      </h3>
                    </div>
                    
                    {link.description && (
                      <p className="text-blue-200/80 text-sm mb-4">
                        {link.description}
                      </p>
                    )}
                    
                    <button
                      onClick={() => window.open(link.url, '_blank')}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Vote Now
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl max-w-md mx-auto">
                  <svg className="w-16 h-16 text-blue-200/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="text-xl font-bold text-white mb-2">No Vote Links Yet</h3>
                  <p className="text-blue-200/80 mb-4">
                    Check back soon for voting opportunities!
                  </p>
                </div>
              </div>
            )}
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
    </div>
  );
}
