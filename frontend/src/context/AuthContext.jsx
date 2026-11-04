import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  refreshSession,
  register as registerRequest,
} from "../services/authService.js";

const AuthContext = createContext(null);

/*
 * =========================================================
 * CONFIGURATION
 * =========================================================
 */

const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
  "click",
  "pointerdown",
];

const AUTH_PAGES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/two-factor",
];

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

const extractUser = (response) => {
  return response?.data?.user ?? null;
};

const getErrorMessage = (error, fallback) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
};

const isAuthPage = () => {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname;
  return AUTH_PAGES.some((page) => path.startsWith(page));
};

/*
 * =========================================================
 * AUTH PROVIDER
 * =========================================================
 */

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initializationPromiseRef = useRef(null);
  const idleTimerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const idleLogoutStartedRef = useRef(false);
  const mountedRef = useRef(false);

  /*
   * =======================================================
   * LOAD CURRENT USER
   * =======================================================
   */
  const loadUser = useCallback(async (options = {}) => {
    const response = await getCurrentUser(options);
    const currentUser = extractUser(response);

    if (!currentUser?.id) {
      throw new Error("The server did not return a valid authenticated user.");
    }

    if (mountedRef.current) {
      setUser(currentUser);
      setError(null);
    }

    return response;
  }, []);

  /*
   * =======================================================
   * INITIALIZE AUTHENTICATION
   * =======================================================
   */
  const initializeAuth = useCallback(async () => {
    if (initializationPromiseRef.current) {
      return initializationPromiseRef.current;
    }

    const initialization = (async () => {
      if (mountedRef.current) {
        setLoading(true);
        setError(null);
      }

      try {
        // Try current access token first
        try {
          return await loadUser({ skipAuthRefresh: true });
        } catch {
          // Access token expired → try refresh once
          try {
            await refreshSession();
            return await loadUser({ skipAuthRefresh: true });
          } catch (refreshError) {
            // Session is completely dead
            if (mountedRef.current) {
              setUser(null);
              setError(
                getErrorMessage(
                  refreshError,
                  "Your session has expired. Please sign in again.",
                ),
              );
            }
            return null;
          }
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    })();

    initializationPromiseRef.current = initialization;

    try {
      return await initialization;
    } finally {
      if (initializationPromiseRef.current === initialization) {
        initializationPromiseRef.current = null;
      }
    }
  }, [loadUser]);

  /*
   * =======================================================
   * INITIAL AUTH CHECK (runs once on mount)
   * =======================================================
   */
  useEffect(() => {
    mountedRef.current = true;

    initializeAuth().catch(() => {
      if (mountedRef.current) {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      mountedRef.current = false;

      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
    };
  }, [initializeAuth]);

  /*
   * =======================================================
   * LOGOUT
   * =======================================================
   */
  const logout = useCallback(async (redirect = true) => {
    idleLogoutStartedRef.current = true;

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }

    try {
      await logoutRequest();
    } catch (err) {
      // Ignore network errors on logout
      console.warn("Logout request failed:", err?.message);
    } finally {
      if (mountedRef.current) {
        setUser(null);
        setError(null);
        setLoading(false);
      }

      // Only redirect if we are NOT already on an auth page
      if (redirect && !isAuthPage()) {
        window.location.replace("/login");
      }
    }
  }, []);

  /*
   * =======================================================
   * INACTIVITY LOGOUT
   * =======================================================
   */
  useEffect(() => {
    if (loading || !user?.id) {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
      return;
    }

    let disposed = false;
    idleLogoutStartedRef.current = false;
    lastActivityRef.current = Date.now();

    const clearIdleTimer = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
    };

    const scheduleIdleTimer = () => {
      clearIdleTimer();
      if (disposed || idleLogoutStartedRef.current) return;

      const elapsed = Date.now() - lastActivityRef.current;
      const remaining = Math.max(IDLE_TIMEOUT_MS - elapsed, 0);

      idleTimerRef.current = setTimeout(handleIdleTimeout, remaining);
    };

    const handleIdleTimeout = async () => {
      if (disposed || idleLogoutStartedRef.current) return;

      const elapsed = Date.now() - lastActivityRef.current;
      if (elapsed < IDLE_TIMEOUT_MS) {
        scheduleIdleTimer();
        return;
      }

      idleLogoutStartedRef.current = true;
      clearIdleTimer();
      await logout(true); // will redirect to /login
    };

    const handleActivity = () => {
      if (disposed || idleLogoutStartedRef.current) return;
      lastActivityRef.current = Date.now();
      scheduleIdleTimer();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;

      const elapsed = Date.now() - lastActivityRef.current;
      if (elapsed >= IDLE_TIMEOUT_MS) {
        handleIdleTimeout();
      } else {
        scheduleIdleTimer();
      }
    };

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    document.addEventListener("visibilitychange", handleVisibilityChange);

    scheduleIdleTimer();

    return () => {
      disposed = true;
      clearIdleTimer();

      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user?.id, loading, logout]);

  /*
   * =======================================================
   * LOGIN
   * =======================================================
   */
  const login = useCallback(
    async (email, password) => {
      setLoading(true);
      setError(null);
      idleLogoutStartedRef.current = false;

      try {
        const response = await loginRequest(email, password);
        const authenticatedUser = extractUser(response);

        if (!authenticatedUser?.id) {
          throw new Error("Login succeeded, but no user was returned.");
        }

        setUser(authenticatedUser);

        // Optional: refresh full profile
        try {
          await loadUser();
        } catch {
          setUser(authenticatedUser);
        }

        return response;
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Unable to sign in. Please check your details.",
        );
        setUser(null);
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadUser],
  );

  /*
   * =======================================================
   * REGISTER
   * =======================================================
   */
  const register = useCallback(
    async (data) => {
      setLoading(true);
      setError(null);
      idleLogoutStartedRef.current = false;

      try {
        const response = await registerRequest(data);
        const registeredUser = extractUser(response);

        if (!registeredUser?.id) {
          throw new Error("Registration succeeded, but no user was returned.");
        }

        setUser(registeredUser);

        try {
          await loadUser();
        } catch {
          setUser(registeredUser);
        }

        return response;
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Unable to create your account. Please try again.",
        );
        setUser(null);
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadUser],
  );

  /*
   * =======================================================
   * CLEAR ERROR
   * =======================================================
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /*
   * =======================================================
   * DERIVED STATE
   * =======================================================
   */
  const isAuthenticated = Boolean(user?.id);
  const isAdmin = String(user?.role ?? "").toUpperCase() === "ADMIN";

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isAuthenticated,
      isAdmin,
      login,
      register,
      logout,
      loadUser,
      clearError,
    }),
    [
      user,
      loading,
      error,
      isAuthenticated,
      isAdmin,
      login,
      register,
      logout,
      loadUser,
      clearError,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/*
 * =========================================================
 * HOOK
 * =========================================================
 */

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
};