export interface LocationData {
  country: string;
  city: string;
}

export const getApproximateLocation = async (): Promise<LocationData> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    return {
      country: data.country_name || 'Unknown',
      city: data.city || 'Unknown',
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return {
      country: 'Unknown',
      city: 'Unknown',
    };
  }
};
