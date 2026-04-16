export enum MenuItemCategory {
  STARTERS = 'Starters',
  MAIN_DISHES = 'Main Dishes',
  GRILLS = 'Grills',
  DRINKS = 'Drinks',
  DESSERTS = 'Desserts'
}

export interface MenuItem {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: MenuItemCategory;
  image_url?: string;
  is_popular: boolean;
  created_at: string;
}

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled'
}

export interface Reservation {
  id?: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: ReservationStatus;
  created_at: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export enum ReviewSource {
  GOOGLE = 'google',
  MANUAL = 'manual'
}

export interface Review {
  id?: string;
  name: string;
  rating: number;
  comment: string;
  source: ReviewSource;
  created_at: string;
}

export interface OpeningHours {
  [day: string]: string; // e.g., "Mon-Fri": "9:00 AM - 10:00 PM"
}

export interface AppSettings {
  id?: string;
  restaurant_name: string;
  opening_hours: OpeningHours;
  address: string;
  phone: string;
  email: string;
  theme_color: string;
  font: string;
}

export enum PostStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft'
}

export interface Post {
  id?: string;
  title: string;
  content: string;
  image?: string;
  status: PostStatus;
  created_at: string;
}
