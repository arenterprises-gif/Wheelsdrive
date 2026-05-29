// ============================================================================
// SUPABASE SERVICE LAYER
// ============================================================================
// File: src/services/supabaseService.ts
// All database operations go here
// ============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type {
  Car,
  CarCreateInput,
  CarUpdateInput,
  User,
  Valuation,
  ValuationInput,
  Inquiry,
  InquiryCreateInput,
  Analytics,
  DashboardStats,
  SearchFilters,
  CarSearchResult,
  Favorite,
  AdminLog,
} from '../types/database';

// ============================================================================
// INITIALIZE SUPABASE
// ============================================================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================================
// AUTHENTICATION
// ============================================================================

export const authService = {
  // Sign up
  async signup(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;
    return data;
  },

  // Login
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Logout
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  async getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  },

  // Get session
  async getSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  },

  // Reset password
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${import.meta.env.VITE_APP_URL}/reset-password`,
    });
    if (error) throw error;
  },

  // Update password
  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  },
};

// ============================================================================
// USERS
// ============================================================================

export const userService = {
  // Get user profile
  async getUserProfile(userId: string): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  // Upload avatar
  async uploadAvatar(userId: string, file: File) {
    const filename = `${userId}-${Date.now()}`;
    const { data, error } = await supabase.storage
      .from('user-avatars')
      .upload(filename, file, { upsert: true });

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from('user-avatars')
      .getPublicUrl(filename);

    await userService.updateUserProfile(userId, {
      avatar_url: publicUrl.publicUrl,
    });

    return publicUrl.publicUrl;
  },
};

// ============================================================================
// CARS
// ============================================================================

export const carService = {
  // Get all cars (with filters)
  async searchCars(filters?: SearchFilters): Promise<CarSearchResult> {
    let query = supabase.from('cars').select('*', { count: 'exact' });

    // Apply filters
    if (filters) {
      if (filters.brand) query = query.eq('brand', filters.brand);
      if (filters.model) query = query.eq('model', filters.model);
      if (filters.segment) query = query.eq('segment', filters.segment);
      if (filters.fuel_type) query = query.eq('fuel_type', filters.fuel_type);
      if (filters.transmission) query = query.eq('transmission', filters.transmission);
      if (filters.condition) query = query.eq('condition', filters.condition);
      if (filters.color) query = query.eq('color', filters.color);
      if (filters.min_price) query = query.gte('price', filters.min_price);
      if (filters.max_price) query = query.lte('price', filters.max_price);
      if (filters.max_km) query = query.lte('km_driven', filters.max_km);
      if (filters.min_year) query = query.gte('year', filters.min_year);
      if (filters.max_year) query = query.lte('year', filters.max_year);

      // Search query
      if (filters.search_query) {
        const q = filters.search_query;
        query = query.or(
          `brand.ilike.%${q}%,model.ilike.%${q}%,title.ilike.%${q}%,color.ilike.%${q}%`
        );
      }

      // Sorting
      if (filters.sort_by) {
        switch (filters.sort_by) {
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
          case 'oldest':
            query = query.order('created_at', { ascending: true });
            break;
          case 'price_low':
            query = query.order('price', { ascending: true });
            break;
          case 'price_high':
            query = query.order('price', { ascending: false });
            break;
          case 'most_viewed':
            query = query.order('views_count', { ascending: false });
            break;
        }
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Pagination
      const page = filters.page || 1;
      const limit = filters.limit || 12;
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);
    }

    // Only show unsold cars to public
    query = query.eq('is_sold', false);

    const { data, count, error } = await query;
    if (error) throw error;

    return {
      cars: data || [],
      total: count || 0,
      page: filters?.page || 1,
      limit: filters?.limit || 12,
    };
  },

  // Get single car
  async getCarById(carId: string): Promise<Car> {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', carId)
      .single();

    if (error) throw error;

    // Increment view count
    await supabase
      .from('cars')
      .update({ views_count: (data.views_count || 0) + 1 })
      .eq('id', carId);

    return data;
  },

  // Create car listing
  async createCar(userId: string, input: CarCreateInput): Promise<Car> {
    const { data, error } = await supabase
      .from('cars')
      .insert({
        ...input,
        seller_id: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update car listing
  async updateCar(carId: string, updates: CarUpdateInput): Promise<Car> {
    const { data, error } = await supabase
      .from('cars')
      .update(updates)
      .eq('id', carId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete car listing
  async deleteCar(carId: string) {
    const { error } = await supabase.from('cars').delete().eq('id', carId);
    if (error) throw error;
  },

  // Get user's cars
  async getUserCars(userId: string): Promise<Car[]> {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('seller_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Upload car image
  async uploadCarImage(carId: string, file: File): Promise<string> {
    const filename = `${carId}-${Date.now()}`;
    const { data, error } = await supabase.storage
      .from('car-images')
      .upload(filename, file);

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from('car-images')
      .getPublicUrl(filename);

    return publicUrl.publicUrl;
  },

  // Feature car (admin only)
  async featureCar(carId: string, featured: boolean) {
    const { error } = await supabase
      .from('cars')
      .update({ is_featured: featured })
      .eq('id', carId);

    if (error) throw error;
  },

  // Verify car (admin only)
  async verifyCar(carId: string, verified: boolean) {
    const { error } = await supabase
      .from('cars')
      .update({ is_verified: verified })
      .eq('id', carId);

    if (error) throw error;
  },

  // Mark car as sold
  async markCarAsSold(carId: string) {
    const { error } = await supabase
      .from('cars')
      .update({ is_sold: true, sold_at: new Date().toISOString() })
      .eq('id', carId);

    if (error) throw error;
  },
};

// ============================================================================
// VALUATIONS
// ============================================================================

export const valuationService = {
  // Get valuation
  async getValuation(valuationId: string): Promise<Valuation> {
    const { data, error } = await supabase
      .from('valuations')
      .select('*')
      .eq('id', valuationId)
      .single();

    if (error) throw error;
    return data;
  },

  // Create valuation
  async createValuation(userId: string, input: ValuationInput): Promise<Valuation> {
    // TODO: Call AI valuation API here
    const estimatedValue = calculateValuation(input);

    const { data, error } = await supabase
      .from('valuations')
      .insert({
        user_id: userId,
        ...input,
        estimated_value: estimatedValue,
        value_range_min: estimatedValue * 0.9,
        value_range_max: estimatedValue * 1.1,
        confidence_score: 0.85,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user valuations
  async getUserValuations(userId: string): Promise<Valuation[]> {
    const { data, error } = await supabase
      .from('valuations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};

// ============================================================================
// INQUIRIES
// ============================================================================

export const inquiryService = {
  // Create inquiry
  async createInquiry(input: InquiryCreateInput) {
    const { data, error } = await supabase
      .from('inquiries')
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get car inquiries
  async getCarInquiries(carId: string): Promise<Inquiry[]> {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .eq('car_id', carId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Mark inquiry as read
  async markAsRead(inquiryId: string) {
    const { error } = await supabase
      .from('inquiries')
      .update({ is_read: true })
      .eq('id', inquiryId);

    if (error) throw error;
  },

  // Get unread inquiry count
  async getUnreadCount(): Promise<number> {
    const { count, error } = await supabase
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  },
};

// ============================================================================
// FAVORITES
// ============================================================================

export const favoriteService = {
  // Add to favorites
  async addFavorite(userId: string, carId: string) {
    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, car_id: carId });

    if (error && error.code !== '23505') throw error; // 23505 = duplicate key
  },

  // Remove from favorites
  async removeFavorite(userId: string, carId: string) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('car_id', carId);

    if (error) throw error;
  },

  // Get user favorites
  async getUserFavorites(userId: string): Promise<Car[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('cars(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return data?.map((f: any) => f.cars) || [];
  },

  // Check if favorite
  async isFavorite(userId: string, carId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('car_id', carId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  },
};

// ============================================================================
// ADMIN
// ============================================================================

export const adminService = {
  // Get dashboard stats
  async getDashboardStats(): Promise<DashboardStats> {
    const { data, error } = await supabase
      .from('cars')
      .select('id,is_sold,price', { count: 'exact' });

    if (error) throw error;

    const activeListing = data?.filter(c => !c.is_sold).length || 0;
    const soldCars = data?.filter(c => c.is_sold).length || 0;
    const totalValue = data?.reduce((sum: number, c: any) => sum + (c.price || 0), 0) || 0;

    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { count: unreadInquiries } = await supabase
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false);

    return {
      active_listings: activeListing,
      sold_cars: soldCars,
      total_users: totalUsers || 0,
      unread_inquiries: unreadInquiries || 0,
      total_inventory_value: totalValue,
      last_updated: new Date().toISOString(),
    };
  },

  // Get all cars (admin view)
  async getAllCars(): Promise<Car[]> {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get all users
  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Log action
  async logAction(
    adminId: string,
    action: string,
    resourceType: string,
    resourceId: string,
    details?: Record<string, any>
  ) {
    const { error } = await supabase.from('admin_logs').insert({
      admin_id: adminId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details,
    });

    if (error) throw error;
  },
};

// ============================================================================
// ANALYTICS
// ============================================================================

export const analyticsService = {
  // Get analytics for date
  async getAnalytics(date: string): Promise<Analytics | null> {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('date', date)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  // Update analytics
  async updateAnalytics(date: string, updates: Partial<Analytics>) {
    const { data, error } = await supabase
      .from('analytics')
      .upsert(
        {
          date,
          ...updates,
        },
        { onConflict: 'date' }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Simple valuation calculation (replace with AI API call)
function calculateValuation(input: ValuationInput): number {
  const basePrice: Record<string, number> = {
    'Maruti Suzuki': 500000,
    'Hyundai': 700000,
    'Tata': 600000,
    'Mahindra': 800000,
    'Honda': 900000,
    'Toyota': 1200000,
  };

  const yearDepreciation = (new Date().getFullYear() - input.year) * 0.1; // 10% per year
  const kmDepreciation = input.km_driven / 1000000; // per million km
  const conditionMultiplier: Record<string, number> = {
    'Excellent': 1.0,
    'Good': 0.85,
    'Fair': 0.7,
    'Poor': 0.5,
  };

  let baseValue = basePrice[input.brand] || 600000;
  baseValue *= 1 - yearDepreciation;
  baseValue *= 1 - kmDepreciation;
  baseValue *= conditionMultiplier[input.condition] || 0.7;

  return Math.round(baseValue);
}

// ============================================================================
// EXPORT
// ============================================================================

export default {
  authService,
  userService,
  carService,
  valuationService,
  inquiryService,
  favoriteService,
  adminService,
  analyticsService,
  supabase,
};

