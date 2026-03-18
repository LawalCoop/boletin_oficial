import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Try Vercel's geo headers first (works in production)
    const city = request.headers.get('x-vercel-ip-city');
    const latitude = request.headers.get('x-vercel-ip-latitude');
    const longitude = request.headers.get('x-vercel-ip-longitude');

    if (city && latitude && longitude) {
      return NextResponse.json({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        city: decodeURIComponent(city),
      });
    }

    // Fallback: use ipapi.co (works locally and as backup)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwardedFor?.split(',')[0].trim() || realIp || '';

    const isLocalIp = !ip || ip === '::1' || ip === '127.0.0.1';
    const url = isLocalIp ? 'https://ipapi.co/json/' : `https://ipapi.co/${ip}/json/`;

    const res = await fetch(url);
    if (res.ok) {
      const geoData = await res.json();
      if (geoData.latitude && geoData.longitude && !geoData.error) {
        return NextResponse.json({
          latitude: geoData.latitude,
          longitude: geoData.longitude,
          city: geoData.city || geoData.region || 'Tu ubicación',
        });
      }
    }

    // Default fallback
    return NextResponse.json({
      latitude: -34.61,
      longitude: -58.38,
      city: 'Buenos Aires',
    });
  } catch (error) {
    console.error('Error fetching geo:', error);
    return NextResponse.json({
      latitude: -34.61,
      longitude: -58.38,
      city: 'Buenos Aires',
    });
  }
}
