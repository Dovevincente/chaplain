
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import api from "../services/api.js";

const getErrorMessage = (error) => {
  if (error?.response?.status === 401) {
    return "Your session has expired. Please sign in again.";
  }

  if (error?.response?.status === 403) {
    return (
      error?.response?.data?.message ||
      "You do not have permission to access these accounts."
    );
  }

  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Unable to load your accounts. Please try again."
  );
};

/*
 * Normalize the account response returned by the API.
 *
 * Expected backend response:
 * {
 *   success: true,
 *   data: {
 *     accounts: [],
 *     count: 0
 *   }
 * }
 */
const normalizeAccounts = (response) => {
  const payload = response?.data ?? response;

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.accounts)) {
    return payload.accounts;
  }

  if (Array.isArray(payload?.data?.accounts)) {
    return payload.data.accounts;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
};

const useAccounts = (options = {}) => {
  const {
    autoFetch = true,
    enabled = true,
  } = options;

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(
    Boolean(autoFetch && enabled),
  );
  const [error, setError] = useState("");

  // Prevent older requests from overwriting newer results.
  const requestIdRef = useRef(0);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      requestIdRef.current += 1;
    };
  }, []);

  const fetchAccounts = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    if (!enabled) {
      if (mountedRef.current) {
        setAccounts([]);
        setError("");
        setLoading(false);
      }

      return [];
    }

    if (mountedRef.current) {
      setLoading(true);
      setError("");
    }

    try {
      const response = await api.get("/accounts");

      const nextAccounts = normalizeAccounts(response?.data);

      if (!Array.isArray(nextAccounts)) {
        throw new Error(
          "The accounts API returned an invalid response.",
        );
      }

      if (
        mountedRef.current &&
        requestId === requestIdRef.current
      ) {
        setAccounts(nextAccounts);
        setError("");
      }

      return nextAccounts;
    } catch (requestError) {
      if (
        mountedRef.current &&
        requestId === requestIdRef.current
      ) {
        setError(getErrorMessage(requestError));
        setAccounts([]);
      }

      throw requestError;
    } finally {
      if (
        mountedRef.current &&
        requestId === requestIdRef.current
      ) {
        setLoading(false);
      }
    }
  }, [enabled]);

  const refresh = useCallback(async () => {
    try {
      return await fetchAccounts();
    } catch {
      // fetchAccounts has already stored the error in state.
      // Keeping refresh errors handled prevents unhandled
      // promise rejections from UI button click handlers.
      return [];
    }
  }, [fetchAccounts]);

  useEffect(() => {
    if (!autoFetch || !enabled) {
      setLoading(false);

      if (!enabled) {
        setAccounts([]);
        setError("");
      }

      return undefined;
    }

    fetchAccounts().catch(() => {
      // The request error is already reflected in state.
    });
  }, [autoFetch, enabled, fetchAccounts]);

  const primaryAccount = useMemo(() => {
    if (!accounts.length) {
      return null;
    }

    return (
      accounts.find(
        (account) =>
          String(account?.status ?? "").toUpperCase() ===
          "ACTIVE",
      ) || accounts[0]
    );
  }, [accounts]);

  const totalAvailableBalance = useMemo(() => {
    return accounts.reduce((total, account) => {
      const balance = Number(
        account?.availableBalance ?? 0,
      );

      return total + (
        Number.isFinite(balance) ? balance : 0
      );
    }, 0);
  }, [accounts]);

  const totalLedgerBalance = useMemo(() => {
    return accounts.reduce((total, account) => {
      const balance = Number(
        account?.ledgerBalance ?? 0,
      );

      return total + (
        Number.isFinite(balance) ? balance : 0
      );
    }, 0);
  }, [accounts]);

  const getAccountById = useCallback(
    (accountId) => {
      if (!accountId) {
        return null;
      }

      return (
        accounts.find(
          (account) =>
            String(account?.id) === String(accountId),
        ) || null
      );
    },
    [accounts],
  );

  const getAccountByNumber = useCallback(
    (accountNumber) => {
      if (!accountNumber) {
        return null;
      }

      return (
        accounts.find(
          (account) =>
            String(account?.accountNumber) ===
            String(accountNumber),
        ) || null
      );
    },
    [accounts],
  );

  const clearAccounts = useCallback(() => {
    requestIdRef.current += 1;
    setAccounts([]);
    setError("");
    setLoading(false);
  }, []);

  return {
    accounts,
    primaryAccount,

    loading,
    error,

    totalAvailableBalance,
    totalLedgerBalance,

    fetchAccounts,
    refresh,

    getAccountById,
    getAccountByNumber,

    clearAccounts,

    hasAccounts: accounts.length > 0,
  };
};

export default useAccounts;