import { NextResponse } from 'next/server';

interface WikipediaGeoResult {
  pageid: number;
  title: string;
  lat: number;
  lon: number;
  dist: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  
  if (!lat || !lon) {
    return NextResponse.json({ error: 'Missing latitude or longitude' }, { status: 400 });
  }

  try {
    const headers = {
      'User-Agent': 'WeatherWeb/1.0 (https://weatherweb.local; contact@weatherweb.local)'
    };

    // 1. Search for landmarks near the coordinates (within 10km radius)
    const geoSearchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${lat}|${lon}&gsradius=10000&gslimit=8&format=json&origin=*`;
    const geoResponse = await fetch(geoSearchUrl, { headers });
    const geoText = await geoResponse.text();
    
    // Safety check in case it's still returning HTML
    if (geoText.startsWith('<')) throw new Error('Wikipedia returned HTML instead of JSON');
    const geoData = JSON.parse(geoText);
    
    const places = geoData.query?.geosearch as WikipediaGeoResult[] || [];
    
    if (places.length === 0) {
      return NextResponse.json({ attractions: [] });
    }

    const pageIds = places.map(p => p.pageid).join('|');

    // 2. Fetch detailed info, images, and descriptions for those page IDs
    const detailsUrl = `https://en.wikipedia.org/w/api.php?action=query&pageids=${pageIds}&prop=extracts|pageimages|coordinates&exintro=1&explaintext=1&piprop=original|thumbnail&pithumbsize=800&format=json&origin=*`;
    const detailsResponse = await fetch(detailsUrl, { headers });
    const detailsData = await detailsResponse.json();
    
    const pages = detailsData.query?.pages;
    
    if (!pages) {
      return NextResponse.json({ attractions: [] });
    }

    // 3. Format into a clean response
    const attractions = places.map(place => {
      const page = pages[place.pageid.toString()];
      if (!page) return null;

      // Extract description and truncate nicely
      let description = page.extract || 'Explore this beautiful local attraction.';
      if (description.length > 150) {
        description = description.substring(0, 147) + '...';
      }

      // Determine image URL
      const imageUrl = page.original?.source || page.thumbnail?.source || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop'; // Fallback travel image

      // Generate a mock realistic rating based on page ID (deterministic)
      const mockRating = ((place.pageid % 11) + 40) / 10; // Gives a rating between 4.0 and 5.0

      // Distance formatting
      const distanceText = place.dist > 1000 
        ? `${(place.dist / 1000).toFixed(1)} km` 
        : `${Math.round(place.dist)} m`;

      return {
        id: place.pageid.toString(),
        name: place.title,
        description,
        imageUrl,
        rating: mockRating,
        distance: distanceText,
        lat: place.lat,
        lon: place.lon,
        category: 'Landmark', // Default category since Wiki doesn't easily expose this
        openingHours: '9:00 AM - 6:00 PM', // Mock
      };
    }).filter(Boolean); // Remove nulls

    // Cache the response for 24 hours in the browser
    return NextResponse.json({ attractions }, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200'
      }
    });

  } catch (error) {
    console.error('Error fetching attractions from Wikipedia:', error);
    return NextResponse.json({ error: 'Failed to fetch attractions' }, { status: 500 });
  }
}
