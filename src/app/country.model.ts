export interface City {
  city: string;
  latitude: number;
  longitude: number;
}

export interface Country {
  id: string;
  country: string;
  cities: City[];
}