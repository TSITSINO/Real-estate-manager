import { FormControl } from '@angular/forms';

export interface Region {
  id: string | null;
  name: string | null;
}
export interface City {
  id: string | null;
  name: string | null;
  region_id: string | null;
}

export interface Agent {
  id: string;
  name: string;
  surname: string;
  avatar: string;
}

export interface NewAgena {
  name: string | undefined | null;
  surname: string | undefined | null;
  phone: string | undefined | null;
  email: string | undefined | null;
  avatar: File | undefined | null;
}
export interface AgenrForm {
  name: FormControl<string | null>;
  surname: FormControl<string | null>;
  email: FormControl<string | null>;
  phone: FormControl<string | null>;
  avatar: FormControl<File | null>;
}

export interface RealEstate {
  id?: number | null;
  address: string | null;
  image: string | null;
  region_id: number | null;
  description: string | null;
  city_id: string | null;
  zip_code: string | null;
  price: number | null;
  area: number | null;
  bedrooms: number | null;
  is_rental: string | null;
  city: {
    id: number | null;
    name: string | null;
    region_id: number | null;
    region: Region | null;
  };
}

export interface NewRealEstate {
  address: string | null | undefined;
  image: File | null | undefined;
  region_id: string | null | undefined;
  description: string | null | undefined;
  city_id: string | null | undefined;
  zip_code: string | null | undefined;
  price: number | null | undefined;
  area: number | null | undefined;
  bedrooms: number | null | undefined;
  is_rental: string | null | undefined;
  agent_id: string | null | undefined;
}

export interface RealEstateForm {
  address: FormControl<string | null>;
  image: FormControl<File | null>;
  region: FormControl<Region | null>;
  description: FormControl<string | null>;
  city: FormControl<City | null>;
  zip_code: FormControl<string | null>;
  price: FormControl<string | null>;
  area: FormControl<string | null>;
  bedrooms: FormControl<string | null>;
  is_rental: FormControl<string | null>;
  agent: FormControl<Agent | null>;
}
