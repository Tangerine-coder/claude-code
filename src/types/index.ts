// ========== Database entity types ==========

export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  phone: string;
  avatar: string;
  role: 'customer' | 'admin';
  status: 'active' | 'disabled';
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export type UserPublic = Omit<User, 'password_hash'>;

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  description: string;
  image: string;
  sort_order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
  children?: Category[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price: number | null;
  cost_price: number | null;
  stock: number;
  category_id: string | null;
  brand: string;
  images: string;
  specs: string;
  tags: string;
  is_featured: number;
  is_new: number;
  is_recommended: number;
  weight: number;
  sales_count: number;
  status: 'active' | 'inactive' | 'draft';
  created_at: string;
  updated_at: string;
}

export interface ProductSku {
  id: string;
  product_id: string;
  spec_info: string;
  price: number | null;
  stock: number;
  sku_code: string;
  created_at: string;
}

export interface Order {
  id: string;
  order_no: string;
  user_id: string | null;
  status: OrderStatus;
  total_amount: number;
  discount_amount: number;
  shipping_fee: number;
  payment_method: string;
  shipping_address: string;
  remark: string;
  paid_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export type OrderStatus = 'pending_payment' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string;
  spec_info: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CartItem {
  id: string;
  user_id: string | null;
  session_id: string | null;
  product_id: string;
  sku_id: string | null;
  spec_info: string;
  quantity: number;
  created_at: string;
  // Joined fields
  product_name?: string;
  product_image?: string;
  price?: number;
  original_price?: number | null;
  stock?: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  link_url: string;
  sort_order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string | null;
  order_id: string | null;
  rating: number;
  content: string;
  images: string;
  is_approved: number;
  created_at: string;
  // Joined fields
  username?: string;
  avatar?: string;
}

export interface Address {
  id: string;
  user_id: string;
  receiver_name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  zip_code: string;
  is_default: number;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface BrowseHistory {
  id: string;
  user_id: string | null;
  session_id: string | null;
  product_id: string;
  created_at: string;
}

export interface Announcement {
  id: string;
  content: string;
  link_url: string;
  is_active: number;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

// ========== API types ==========

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ========== Auth types ==========

export interface AuthPayload {
  userId: string;
  role: 'customer' | 'admin';
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

// ========== Product query params ==========

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating';
  min_price?: number;
  max_price?: number;
  featured?: number;
  recommended?: number;
  is_new?: number;
  search?: string;
  brand?: string;
  status?: string;
}

// ========== Component prop types ==========

export interface NavCategory {
  id: string;
  name: string;
  slug: string;
  children?: NavCategory[];
}
