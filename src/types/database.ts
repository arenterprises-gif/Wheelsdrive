// ============================================================================
// WHEELSDRIVE DATABASE TYPES
// ============================================================================
// File: src/types/database.ts
// Use these types throughout your app for type safety
// ============================================================================

// ============================================================================
// USERS
// ============================================================================
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  is_admin: boolean;
  role: 'user' | 'dealer' | 'admin';
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  total_listings: number;
  sold_cars: number;
  response_rate: number;
}

// ============================================================================
// CARS
// ============================================================================
export interface Car {
  id: string;
  
  // Basic Info
  brand: string;
  model: string;
  title: string;
  description: string | null;
  
  // Specifications
  year: number;
  segment: string; // 'Sedan', 'SUV', 'Hatchback', 'Pickup', 'Premium', 'Budget'
  fuel_type: string; // 'Petrol', 'Diesel', 'Electric', 'Hybrid'
  transmission: string; // 'Manual', 'Automatic'
  condition: string; // 'Excellent', 'Good', 'Fair', 'Poor'
  color: string;
  
  // Usage
  km_driven: number;
  owners: number;
  
  // Pricing
  price: number;
  estimated_value: number | null;
  valuation_date: string | null;
  
  // Images
  image_main: string | null;
  images_array: string[];
  
  // Seller
  seller_id: string | null;
  seller_name: string;
  seller_phone: string;
  seller_email: string;
  seller_location: string;
  
  // Status
  is_sold: boolean;
  is_featured: boolean;
  is_verified: boolean;
  views_count: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  sold_at: string | null;
}

export interface CarCreateInput {
  brand: string;
  model: string;
  title: string;
  description?: string;
  year: number;
  segment: string;
  fuel_type: string;
  transmission: string;
  condition: string;
  color: string;
  km_driven: number;
  owners: number;
  price: number;
  seller_name: string;
  seller_phone: string;
  seller_email: string;
  seller_location: string;
  image_main?: string;
  images_array?: string[];
}

export interface CarUpdateInput extends Partial<CarCreateInput> {
  id: string;
}

// ============================================================================
// VALUATIONS
// ============================================================================
export interface Valuation {
  id: string;
  
  car_id: string | null;
  user_id: string | null;
  
  brand: string;
  model: string;
  year: number;
  km_driven: number;
  condition: string;
  
  estimated_value: number;
  value_range_min: number;
  value_range_max: number;
  confidence_score: number; // 0.5 to 1.0
  
  factors: Record<string, any>;
  is_accepted: boolean;
  
  created_at: string;
}

export interface ValuationInput {
  brand: string;
  model: string;
  year: number;
  km_driven: number;
  condition: string;
}

// ============================================================================
// INQUIRIES
// ============================================================================
export interface Inquiry {
  id: string;
  
  car_id: string;
  buyer_name: string;
  buyer_email: string | null;
  buyer_phone: string | null;
  
  subject: string | null;
  message: string | null;
  
  is_read: boolean;
  is_responded: boolean;
  response_at: string | null;
  
  created_at: string;
}

export interface InquiryCreateInput {
  car_id: string;
  buyer_name: string;
  buyer_email?: string;
  buyer_phone?: string;
  subject?: string;
  message?: string;
}

// ============================================================================
// FAVORITES
// ============================================================================
export interface Favorite {
  id: string;
  user_id: string;
  car_id: string;
  created_at: string;
}

// ============================================================================
// ADMIN LOGS
// ============================================================================
export interface AdminLog {
  id: string;
  
  admin_id: string | null;
  admin_email: string;
  
  action: string; // 'verify_car', 'feature_car', 'delete_car', etc
  resource_type: string; // 'car', 'user', 'inquiry', etc
  resource_id: string;
  
  details: Record<string, any>;
  ip_address: string | null;
  user_agent: string | null;
  
  created_at: string;
}

// ============================================================================
// ANALYTICS
// ============================================================================
export interface Analytics {
  id: string;
  date: string;
  
  total_cars_listed: number;
  new_cars_today: number;
  cars_sold_today: number;
  
  new_users_today: number;
  total_registered_users: number;
  
  total_views: number;
  total_inquiries: number;
  
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  active_listings: number;
  sold_cars: number;
  total_users: number;
  unread_inquiries: number;
  total_inventory_value: number;
  last_updated: string;
}

// ============================================================================
// SETTINGS
// ============================================================================
export interface Settings {
  id: string;
  key: string;
  value: string;
  description: string | null;
  updated_at: string;
}

// ============================================================================
// SEARCH & FILTER
// ============================================================================
export interface SearchFilters {
  brand?: string;
  model?: string;
  segment?: string;
  fuel_type?: string;
  transmission?: string;
  condition?: string;
  color?: string;
  
  // Price range
  min_price?: number;
  max_price?: number;
  
  // Mileage
  max_km?: number;
  
  // Year
  min_year?: number;
  max_year?: number;
  
  // Sorting
  sort_by?: 'newest' | 'oldest' | 'price_low' | 'price_high' | 'most_viewed';
  
  // Pagination
  page?: number;
  limit?: number;
  
  // Search
  search_query?: string;
}

export interface CarSearchResult {
  cars: Car[];
  total: number;
  page: number;
  limit: number;
}

// ============================================================================
// API RESPONSES
// ============================================================================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// ============================================================================
// FORMS
// ============================================================================
export interface SellCarForm {
  // Valuation
  brand: string;
  model: string;
  year: number;
  km_driven: number;
  condition: string;
  
  // Details
  title: string;
  description?: string;
  fuel_type: string;
  transmission: string;
  segment: string;
  color: string;
  owners: number;
  
  // Pricing
  asking_price: number;
  
  // Seller
  seller_name: string;
  seller_phone: string;
  seller_email: string;
  seller_location: string;
  
  // Images
  images?: File[];
  image_urls?: string[];
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  email: string;
  password: string;
  confirm_password: string;
  full_name?: string;
  phone?: string;
  agree_to_terms: boolean;
}

// ============================================================================
// UI STATE
// ============================================================================
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface FormState<T> extends LoadingState {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
}

// ============================================================================
// SORTING OPTIONS
// ============================================================================
export const SORT_OPTIONS = {
  newest: { label: 'Newest', value: 'newest' },
  oldest: { label: 'Oldest', value: 'oldest' },
  price_low: { label: 'Price: Low to High', value: 'price_low' },
  price_high: { label: 'Price: High to Low', value: 'price_high' },
  most_viewed: { label: 'Most Viewed', value: 'most_viewed' },
} as const;

// ============================================================================
// FILTER OPTIONS (For dropdowns)
// ============================================================================
export const BRANDS = [
  'Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 'Toyota',
  'Skoda', 'Volkswagen', 'Renault', 'Kia', 'MG', 'Citroen', 'Other'
];

export const SEGMENTS = [
  'Budget', 'Sedan', 'SUV', 'Hatchback', 'Pickup', 'Premium', 'Luxury'
];

export const FUEL_TYPES = [
  'Petrol', 'Diesel', 'Electric', 'Hybrid'
];

export const TRANSMISSIONS = [
  'Manual', 'Automatic'
];

export const CONDITIONS = [
  'Excellent', 'Good', 'Fair', 'Poor'
];

export const COLORS = [
  'White', 'Black', 'Silver', 'Grey', 'Red', 'Blue', 'Brown', 'Green', 'Yellow', 'Orange'
];

// ============================================================================
// VALIDATION RULES
// ============================================================================
export const VALIDATION_RULES = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Invalid email address'
  },
  phone: {
    pattern: /^[\d\s\-\+\(\)]{10,15}$/,
    message: 'Invalid phone number'
  },
  password: {
    minLength: 8,
    message: 'Password must be at least 8 characters'
  },
  title: {
    minLength: 10,
    maxLength: 100,
    message: 'Title must be between 10 and 100 characters'
  },
  price: {
    min: 10000,
    max: 50000000,
    message: 'Price must be between 10,000 and 5 crore'
  },
};

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

export type {
  User,
  Car,
  Valuation,
  Inquiry,
  Favorite,
  AdminLog,
  Analytics,
  DashboardStats,
};

