import { z } from 'zod';

export const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  listing_type: z.enum(['sale', 'rent'], { required_error: 'Select a listing type' }),
  property_type: z.enum(['apartment', 'house', 'villa', 'commercial', 'land'], { required_error: 'Select a property type' }),
  price: z.number({ invalid_type_error: 'Enter a valid price' }).positive('Price must be greater than 0'),
  bedrooms: z.number({ invalid_type_error: 'Enter a valid number' }).int().min(0),
  bathrooms: z.number({ invalid_type_error: 'Enter a valid number' }).int().min(0),
  area: z.number({ invalid_type_error: 'Enter a valid area' }).positive('Area must be greater than 0'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  status: z.enum(['available', 'sold', 'rented']),
  featured: z.boolean().default(false),
  availability_date: z.string().optional().nullable(),
});

export const inquirySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is invalid'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  property_id: z.string().uuid('Invalid property ID'),
});

export const scheduleVisitSchema = z.object({
  visitor_name: z.string().min(2, 'Name is required'),
  visitor_email: z.string().email('Invalid email address'),
  visitor_phone: z.string().min(10, 'Phone number is invalid'),
  date: z.string().refine(
    (date) => new Date(date) > new Date(),
    'Date must be in the future'
  ),
  time: z.string().refine(
    (time) => /^\d{2}:\d{2}$/.test(time),
    'Invalid time format (HH:MM)'
  ),
  property_id: z.string().uuid('Invalid property ID'),
});

export const testimonialSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  rating: z.number({ invalid_type_error: 'Select a rating' }).int().min(1).max(5, 'Rating must be 1–5'),
  review: z.string().min(10, 'Review must be at least 10 characters'),
  image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  approved: z.boolean().default(false),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  full_name: z.string().min(2, 'Full name is required'),
});
