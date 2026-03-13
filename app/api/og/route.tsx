import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const destination = searchParams.get('destination') || 'Explore Luxury';
    const duration = searchParams.get('duration') || 'Handpicked Collection';
    const logo = searchParams.get('logo');

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
            backgroundColor: '#fff',
            backgroundImage: 'radial-gradient(circle at 25% 25%, #f8fafc 0%, #fff 100%)',
          }}
        >
          {/* Decorative Elements */}
          <div
            style={{
              position: 'absolute',
              top: 40,
              left: 40,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div style={{ width: 40, height: 2, backgroundColor: '#ea580c', marginRight: 10 }} />
            <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: '0.4em', color: '#ea580c' }}>
              YOUTHCAMPING
            </span>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 80px',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5em',
                marginBottom: 20,
              }}
            >
              Exclusive Travel Proposal
            </span>
            <h1
              style={{
                fontSize: 100,
                fontWeight: 900,
                color: '#0f172a',
                lineHeight: 1,
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '-0.05em',
              }}
            >
              {destination}
            </h1>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: 40,
              }}
            >
              <div style={{ width: 60, height: 2, backgroundColor: '#ea580c' }} />
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 600,
                  color: '#0f172a',
                  margin: '0 20px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                }}
              >
                {duration}
              </span>
              <div style={{ width: 60, height: 2, backgroundColor: '#ea580c' }} />
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: 40,
              right: 40,
              display: 'flex',
              alignItems: 'center',
              color: '#94a3b8',
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: '0.1em',
            }}
          >
            youthcamping.in
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
