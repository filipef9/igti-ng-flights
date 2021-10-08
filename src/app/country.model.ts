export interface City {
  id: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface Country {
  id: string;
  country: string;
  cities: City[];
}

