/**
 * Custom hook for managing properties
 */

'use client';

import { useState, useCallback } from 'react';
import { propertyService } from '../services/properties';

export const useProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProperties = useCallback(async (limit = 12, offset = 0) => {
    try {
      setLoading(true);
      const data = await propertyService.getAll(limit, offset);
      setProperties(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchProperties = useCallback(async (filters) => {
    try {
      setLoading(true);
      const data = await propertyService.search(filters);
      setProperties(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { properties, loading, error, fetchProperties, searchProperties };
};
