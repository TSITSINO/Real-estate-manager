export interface Region {
  id: number;
  name: string;
}
export interface Cities {
  id: number;
  name: string;
  region_id: number;
}

export interface Agent {
  id: number;
  name: string;
  surname: string;
  avatar: string;
}

export interface RealEstate {
  id: number;
  address: string;
  image: string;
  region_id: number;
  description: string;
  city_id: number;
  zip_code: string;
  price: number;
  area: number;
  bedrooms: number;
  is_rental: number;
  city: {
    id: number;
    name: string;
    region_id: number;
    region: Region;
  };
}
