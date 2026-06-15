import { supabase } from '../lib/supabase';

export const inquiryService = {
  async create(inquiry) {
    const { data, error } = await supabase
      .from('inquiries')
      .insert([inquiry])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAll(limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('inquiries')
      .update({ status, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
