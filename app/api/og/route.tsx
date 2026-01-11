
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const score = searchParams.get('score') ?? 'PLAY NOW';
    const difficulty = searchParams.get('diff') ?? 'Geometry Dash';
    const mode = searchParams.get('mode') ?? 'Spam Test';

    // Map difficulties to their signature neon colors
    const colorMap: Record<string, string> = {
      'Easy': '#22c55e',
      'Hard': '#eab308',
      'Insane': '#f97316',
      'Easy Demon': '#ef4444',
      'Extreme Demon': '#a855f7'
    };
    
    const accentColor = colorMap[difficulty] || '#3b82f6';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#020617',
            color: 'white',
            fontFamily: 'sans-serif',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background Gradient */}
          <div style={{
             position: 'absolute',
             top: 0, left: 0, right: 0, bottom: 0,
             background: `radial-gradient(circle at 50% 50%, ${accentColor}30 0%, #020617 80%)`,
          }} />

          {/* Grid Pattern Overlay */}
          <div style={{
             position: 'absolute',
             top: 0, left: 0, right: 0, bottom: 0,
             backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
             backgroundSize: '50px 50px',
          }}/>
          
          {/* Decorative Border */}
          <div style={{
            position: 'absolute',
            top: 40, left: 40, right: 40, bottom: 40,
            border: `4px solid ${accentColor}60`,
            borderRadius: 30,
            boxShadow: `0 0 50px ${accentColor}40`
          }} />

          {/* Logo / Branding */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 30 }}>
             <img src="https://geometrydashspam.cc/logo.svg" width="60" height="60" style={{ marginRight: 20, borderRadius: 12, boxShadow: `0 0 20px ${accentColor}60` }} />
             <div style={{ 
               fontSize: 32, 
               fontWeight: 700, 
               color: '#cbd5e1', 
               textTransform: 'uppercase',
               letterSpacing: '3px'
             }}>
               Geometry Dash Spam
             </div>
          </div>

          {/* The Main Score */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 30
          }}>
            <div style={{
              fontSize: 140,
              fontWeight: 900,
              color: 'white',
              textShadow: `0 0 60px ${accentColor}`,
              lineHeight: 1,
              marginBottom: 10
            }}>
              {score}
            </div>
            <div style={{ fontSize: 24, color: accentColor, textTransform: 'uppercase', letterSpacing: '4px', fontWeight: 600 }}>
                {score.includes('s') ? 'SURVIVED' : score.includes('%') ? 'COMPLETED' : 'SCORE'}
            </div>
          </div>

          {/* Badges */}
          <div style={{
             display: 'flex',
             gap: '20px',
             marginTop: 10
          }}>
             <div style={{
               backgroundColor: accentColor,
               color: '#000',
               padding: '12px 36px',
               borderRadius: 50,
               fontSize: 32,
               fontWeight: 800,
               textTransform: 'uppercase'
             }}>
               {difficulty}
             </div>
             {mode && mode !== 'Level' && (
               <div style={{
                 border: `3px solid ${accentColor}`,
                 color: accentColor,
                 padding: '12px 36px',
                 borderRadius: 50,
                 fontSize: 32,
                 fontWeight: 800,
                 textTransform: 'uppercase',
                 backgroundColor: 'rgba(0,0,0,0.4)'
               }}>
                 {mode}
               </div>
             )}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
