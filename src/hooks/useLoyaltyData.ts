import { useState, useEffect } from 'react';
import { getLoyaltyDataByEmail, type LoyaltyData } from '../lib/loyaltyService';

interface UseLoyaltyDataState {
  data: LoyaltyData | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch loyalty data for a customer.
 * Handles loading/error states automatically.
 */
export function useLoyaltyData(email: string | null): UseLoyaltyDataState {
  const [state, setState] = useState<UseLoyaltyDataState>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!email) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    let isMounted = true;
    setState({ data: null, loading: true, error: null });

    (async () => {
      try {
        const loyaltyData = await getLoyaltyDataByEmail(email);
        if (isMounted) {
          setState({ data: loyaltyData, loading: false, error: null });
        }
      } catch (err) {
        if (isMounted) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Failed to fetch loyalty data',
          });
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [email]);

  return state;
}
