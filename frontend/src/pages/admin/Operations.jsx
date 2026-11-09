
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  CircleDollarSign,
  Lock,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  Unlock,
  WalletCards,
  X,
} from "lucide-react";

import api from "../../services/api.js";

const initialForm = {
  amount: "",
  description: "",
};

const getCustomerName = (customer) => {
  const profile = customer?.profile;

  if (!profile) {
    return customer?.email || "Unknown customer";
  }

  return [
    profile.firstName,
    profile.middleName,
    profile.lastName,
  ]
    .filter(Boolean)
    .join(" ") || customer?.email || "Unknown customer";
};

const formatMoney = (value, currency = "USD") => {
  const amount = Number(value ?? 0);

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number.isFinite(amount) ? amount : 0);
  } catch {
    return `${currency} ${
      Number.isFinite(amount) ? amount.toFixed(2) : "0.00"
    }`;
  }
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString();
};

const getInitials = (customer) => {
  const name = getCustomerName(customer);

  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "CU"
  );
};

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "The operation could not be completed."
  );
};

const getAccountCurrency = (account) =>
  account?.currency?.code || "USD";

const getTotalBalance = (account) => {
  const total = Number(account?.balance);

  if (Number.isFinite(total)) {
    return total;
  }

  return (
    Number(account?.availableBalance ?? 0) +
    Number(account?.ledgerBalance ?? 0)
  );
};

const getAvailableBalance = (account) =>
  Number(account?.availableBalance ?? 0);

const getLedgerBalance = (account) =>
  Number(account?.ledgerBalance ?? 0);

const statusClass = (status) => {
  switch (String(status || "").toUpperCase()) {
    case "ACTIVE":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "FROZEN":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "SUSPENDED":
      return "bg-orange-50 text-orange-700 border-orange-200";

    case "BLOCKED":
      return "bg-red-50 text-red-700 border-red-200";

    case "CLOSED":
      return "bg-slate-100 text-slate-600 border-slate-200";

    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
};

const Operations = () => {
  const [customers, setCustomers] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const [detailsLoading, setDetailsLoading] = useState(false);

  const [operation, setOperation] = useState("credit");
  const [form, setForm] = useState(initialForm);

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [operationError, setOperationError] = useState("");

  const [statusSubmitting, setStatusSubmitting] = useState(false);
  const [customerStatusSubmitting, setCustomerStatusSubmitting] =
    useState(false);

  const [showCustomerList, setShowCustomerList] = useState(true);

  const fetchCustomers = useCallback(
    async ({
      showLoader = true,
      requestedPage = 1,
      requestedSearch = search,
    } = {}) => {
      try {
        if (showLoader) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        setError("");

        const response = await api.get("/admin/customers", {
          params: {
            page: requestedPage,
            limit: 20,
            search: requestedSearch.trim(),
          },
        });

        const data = response?.data?.data || {};

        setCustomers(data.customers || []);

        setPagination(
          data.pagination || {
            page: requestedPage,
            limit: 20,
            total: data.customers?.length || 0,
            totalPages: 1,
          },
        );
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [search],
  );

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const loadCustomer = useCallback(async (customer) => {
    if (!customer?.id) return;

    try {
      setDetailsLoading(true);
      setOperationError("");
      setSuccessMessage("");

      const response = await api.get(
        `/admin/customers/${customer.id}`,
      );

      const data =
        response?.data?.data?.customer ||
        response?.data?.customer ||
        null;

      if (!data) {
        throw new Error("Customer information could not be loaded.");
      }

      setSelectedCustomer(data);
      setCustomerDetails(data);

      setSelectedAccount(data?.accounts?.[0] || null);
      setShowCustomerList(false);
      setForm(initialForm);
      setOperation("credit");
    } catch (requestError) {
      setOperationError(getErrorMessage(requestError));
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  const refreshCustomer = useCallback(async () => {
    if (!selectedCustomer?.id) return;

    try {
      setDetailsLoading(true);

      const response = await api.get(
        `/admin/customers/${selectedCustomer.id}`,
      );

      const customer =
        response?.data?.data?.customer ||
        response?.data?.customer ||
        null;

      if (!customer) {
        throw new Error("Customer information could not be refreshed.");
      }

      setCustomerDetails(customer);
      setSelectedCustomer(customer);

      if (selectedAccount?.id) {
        const refreshedAccount = customer?.accounts?.find(
          (account) => account.id === selectedAccount.id,
        );

        setSelectedAccount(
          refreshedAccount || customer?.accounts?.[0] || null,
        );
      } else {
        setSelectedAccount(customer?.accounts?.[0] || null);
      }
    } catch (requestError) {
      setOperationError(getErrorMessage(requestError));
    } finally {
      setDetailsLoading(false);
    }
  }, [selectedCustomer, selectedAccount]);

  const accounts = useMemo(
    () => customerDetails?.accounts || [],
    [customerDetails],
  );

  const currency =
    getAccountCurrency(selectedAccount) ||
    customerDetails?.accounts?.[0]?.currency?.code ||
    "USD";

  const selectedTotalBalance = getTotalBalance(selectedAccount);
  const selectedAvailableBalance = getAvailableBalance(selectedAccount);
  const selectedLedgerBalance = getLedgerBalance(selectedAccount);

  const handleInput = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleOperation = async (event) => {
    event.preventDefault();

    if (!selectedCustomer?.id || !selectedAccount?.id) {
      setOperationError("Select a customer account first.");
      return;
    }

    const amount = Number(form.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setOperationError("Enter a valid amount greater than zero.");
      return;
    }

    if (!form.description.trim()) {
      setOperationError(
        "Enter a reason or description for this operation.",
      );
      return;
    }

    if (
      operation === "release" &&
      amount > selectedLedgerBalance
    ) {
      setOperationError(
        `The release amount cannot exceed the ledger balance of ${formatMoney(
          selectedLedgerBalance,
          currency,
        )}.`,
      );
      return;
    }

    if (
      operation === "debit" &&
      amount > selectedAvailableBalance
    ) {
      setOperationError(
        `The debit amount cannot exceed the available balance of ${formatMoney(
          selectedAvailableBalance,
          currency,
        )}.`,
      );
      return;
    }

    try {
      setSubmitting(true);
      setOperationError("");
      setSuccessMessage("");

      let endpoint;

      if (operation === "credit") {
        endpoint = `/admin/customers/${selectedCustomer.id}/accounts/${selectedAccount.id}/credit`;
      } else if (operation === "debit") {
        endpoint = `/admin/customers/${selectedCustomer.id}/accounts/${selectedAccount.id}/debit`;
      } else {
        endpoint = `/admin/customers/${selectedCustomer.id}/accounts/${selectedAccount.id}/release-ledger`;
      }

      const response = await api.post(endpoint, {
        amount,
        description: form.description.trim(),
      });

      const operationLabel =
        operation === "credit"
          ? "Credit"
          : operation === "debit"
            ? "Debit"
            : "Ledger release";

      setSuccessMessage(
        response?.data?.message ||
          `${operationLabel} completed successfully.`,
      );

      setForm(initialForm);

      await refreshCustomer();

      await fetchCustomers({
        showLoader: false,
        requestedPage: pagination.page,
        requestedSearch: search,
      });
    } catch (requestError) {
      setOperationError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  const updateAccountStatus = async (status) => {
    if (!selectedCustomer?.id || !selectedAccount?.id) return;

    try {
      setStatusSubmitting(true);
      setOperationError("");
      setSuccessMessage("");

      const response = await api.patch(
        `/admin/customers/${selectedCustomer.id}/accounts/${selectedAccount.id}/status`,
        { status },
      );

      setSuccessMessage(
        response?.data?.message ||
          "Account status updated successfully.",
      );

      await refreshCustomer();

      await fetchCustomers({
        showLoader: false,
        requestedPage: pagination.page,
        requestedSearch: search,
      });
    } catch (requestError) {
      setOperationError(getErrorMessage(requestError));
    } finally {
      setStatusSubmitting(false);
    }
  };

  const updateCustomerStatus = async (status) => {
    if (!selectedCustomer?.id) return;

    try {
      setCustomerStatusSubmitting(true);
      setOperationError("");
      setSuccessMessage("");

      const response = await api.patch(
        `/admin/customers/${selectedCustomer.id}/status`,
        { status },
      );

      setSuccessMessage(
        response?.data?.message ||
          "Customer status updated successfully.",
      );

      await refreshCustomer();

      await fetchCustomers({
        showLoader: false,
        requestedPage: pagination.page,
        requestedSearch: search,
      });
    } catch (requestError) {
      setOperationError(getErrorMessage(requestError));
    } finally {
      setCustomerStatusSubmitting(false);
    }
  };

  const goBack = () => {
    setShowCustomerList(true);
    setSelectedCustomer(null);
    setCustomerDetails(null);
    setSelectedAccount(null);
    setSuccessMessage("");
    setOperationError("");
    setForm(initialForm);
    setOperation("credit");
  };

  const customerFullName = getCustomerName(
    customerDetails || selectedCustomer,
  );

  const operationConfig = {
    credit: {
      title: "Credit account",
      description:
        "Adds funds to the total and ledger balances. Available balance remains unchanged.",
      color: "emerald",
      button: "Credit Account",
      icon: ArrowDownLeft,
    },
    debit: {
      title: "Debit account",
      description:
        "Deducts funds from the total and available balances. Ledger balance remains unchanged.",
      color: "red",
      button: "Debit Account",
      icon: ArrowUpRight,
    },
    release: {
      title: "Release ledger balance",
      description:
        "Moves funds from ledger balance into available balance. Total account balance remains unchanged.",
      color: "blue",
      button: "Release Ledger Funds",
      icon: Unlock,
    },
  };

  const currentOperation = operationConfig[operation];
  const OperationIcon = currentOperation.icon;

  return (
    <div className="min-h-full bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-700">
              <ShieldCheck size={17} />
              Admin Operations
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Banking Operations Center
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Manage customer accounts, available funds, ledger balances,
              account status, and customer access using controlled
              administrative operations.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              fetchCustomers({
                showLoader: false,
                requestedPage: pagination.page,
                requestedSearch: search,
              })
            }
            disabled={refreshing || loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* NOTIFICATIONS */}

        {successMessage && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <CheckCircle2 className="mt-0.5 shrink-0" size={19} />

            <div className="flex-1">
              <p className="font-semibold">Operation completed</p>
              <p className="mt-1">{successMessage}</p>
            </div>

            <button
              type="button"
              onClick={() => setSuccessMessage("")}
              className="rounded-lg p-1 transition hover:bg-emerald-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {(error || operationError) && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertTriangle className="mt-0.5 shrink-0" size={19} />

            <div className="flex-1">
              <p className="font-semibold">Operation error</p>
              <p className="mt-1">{operationError || error}</p>
            </div>

            <button
              type="button"
              onClick={() => {
                setError("");
                setOperationError("");
              }}
              className="rounded-lg p-1 transition hover:bg-red-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* CUSTOMER LIST */}

        {showCustomerList ? (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Select Customer
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Choose a customer to manage their account and
                    financial operations.
                  </p>
                </div>

                <div className="relative w-full lg:max-w-sm">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        fetchCustomers({
                          requestedPage: 1,
                          requestedSearch: search,
                        });
                      }
                    }}
                    placeholder="Search name, email or phone"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-72 items-center justify-center">
                <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                  <RefreshCw size={18} className="animate-spin" />
                  Loading customers...
                </div>
              </div>
            ) : customers.length === 0 ? (
              <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 rounded-2xl bg-slate-100 p-4 text-slate-500">
                  <UserRound size={26} />
                </div>

                <h3 className="font-semibold text-slate-900">
                  No customers found
                </h3>

                <p className="mt-1 max-w-md text-sm text-slate-500">
                  Try another search term or refresh the customer list.
                </p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-slate-100">
                  {customers.map((customer) => (
                    <button
                      key={customer.id}
                      type="button"
                      onClick={() => loadCustomer(customer)}
                      className="flex w-full items-center gap-4 p-4 text-left transition hover:bg-slate-50 sm:p-5"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
                        {getInitials(customer)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate font-semibold text-slate-900">
                            {getCustomerName(customer)}
                          </p>

                          <span
                            className={`rounded-full border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${statusClass(
                              customer.status,
                            )}`}
                          >
                            {customer.status}
                          </span>
                        </div>

                        <p className="mt-1 truncate text-sm text-slate-500">
                          {customer.email}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {customer._count?.accounts ?? 0} account
                          {customer._count?.accounts === 1 ? "" : "s"} ·
                          Joined {formatDate(customer.createdAt)}
                        </p>
                      </div>

                      <span className="hidden text-sm font-semibold text-blue-700 sm:block">
                        Manage
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-slate-500">
                    Showing {customers.length} of {pagination.total} customers
                  </p>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={pagination.page <= 1 || loading}
                      onClick={() =>
                        fetchCustomers({
                          requestedPage: pagination.page - 1,
                          requestedSearch: search,
                        })
                      }
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>

                    <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                      Page {pagination.page} of{" "}
                      {Math.max(pagination.totalPages || 1, 1)}
                    </span>

                    <button
                      type="button"
                      disabled={
                        pagination.page >= pagination.totalPages ||
                        loading
                      }
                      onClick={() =>
                        fetchCustomers({
                          requestedPage: pagination.page + 1,
                          requestedSearch: search,
                        })
                      }
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        ) : (
          /* CUSTOMER OPERATIONS */

          <div className="space-y-5">
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-700"
            >
              ← Back to customers
            </button>

            {detailsLoading && !customerDetails ? (
              <div className="flex min-h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                  <RefreshCw size={18} className="animate-spin" />
                  Loading customer...
                </div>
              </div>
            ) : (
              <>
                {/* CUSTOMER HEADER */}

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white">
                        {getInitials(customerDetails || selectedCustomer)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-xl font-bold text-slate-950">
                            {customerFullName}
                          </h2>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${statusClass(
                              customerDetails?.status,
                            )}`}
                          >
                            {customerDetails?.status || "UNKNOWN"}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          {customerDetails?.email}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Customer ID: {customerDetails?.id}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={
                          customerStatusSubmitting ||
                          customerDetails?.status === "ACTIVE"
                        }
                        onClick={() => updateCustomerStatus("ACTIVE")}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <CheckCircle2 size={15} />
                        Activate
                      </button>

                      <button
                        type="button"
                        disabled={
                          customerStatusSubmitting ||
                          customerDetails?.status === "SUSPENDED"
                        }
                        onClick={() => updateCustomerStatus("SUSPENDED")}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 text-xs font-bold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Suspend
                      </button>

                      <button
                        type="button"
                        disabled={
                          customerStatusSubmitting ||
                          customerDetails?.status === "BLOCKED"
                        }
                        onClick={() => updateCustomerStatus("BLOCKED")}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Block
                      </button>
                    </div>
                  </div>
                </section>

                {/* ACCOUNT SELECTOR */}

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-950">
                        Customer Accounts
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Select an account to manage its balances and
                        administrative operations.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={refreshCustomer}
                      disabled={detailsLoading}
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
                    >
                      <RefreshCw
                        size={17}
                        className={detailsLoading ? "animate-spin" : ""}
                      />
                    </button>
                  </div>

                  {accounts.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                      <WalletCards
                        className="mx-auto mb-3 text-slate-400"
                        size={28}
                      />

                      <p className="font-semibold text-slate-700">
                        No accounts available
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        This customer does not have an account available
                        for administrative operations.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2">
                      {accounts.map((account) => {
                        const isSelected =
                          selectedAccount?.id === account.id;

                        const accountCurrency =
                          getAccountCurrency(account);

                        return (
                          <button
                            key={account.id}
                            type="button"
                            onClick={() => {
                              setSelectedAccount(account);
                              setForm(initialForm);
                              setOperationError("");
                              setSuccessMessage("");
                            }}
                            className={`rounded-2xl border p-4 text-left transition ${
                              isSelected
                                ? "border-blue-500 bg-blue-50/70 ring-4 ring-blue-500/10"
                                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                  {account.type}
                                </p>

                                <p className="mt-1 font-bold tracking-wide text-slate-900">
                                  {account.accountNumber}
                                </p>
                              </div>

                              <span
                                className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase ${statusClass(
                                  account.status,
                                )}`}
                              >
                                {account.status}
                              </span>
                            </div>

                            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                              <div>
                                <p className="text-[11px] text-slate-400">
                                  Total
                                </p>
                                <p className="mt-1 break-words text-sm font-bold text-slate-950">
                                  {formatMoney(
                                    getTotalBalance(account),
                                    accountCurrency,
                                  )}
                                </p>
                              </div>

                              <div>
                                <p className="text-[11px] text-slate-400">
                                  Available
                                </p>
                                <p className="mt-1 break-words text-sm font-bold text-emerald-700">
                                  {formatMoney(
                                    getAvailableBalance(account),
                                    accountCurrency,
                                  )}
                                </p>
                              </div>

                              <div>
                                <p className="text-[11px] text-slate-400">
                                  Ledger
                                </p>
                                <p className="mt-1 break-words text-sm font-bold text-amber-700">
                                  {formatMoney(
                                    getLedgerBalance(account),
                                    accountCurrency,
                                  )}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </section>

                {/* OPERATION PANEL */}

                {selectedAccount && (
                  <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                      <div className="mb-6">
                        <div className="flex items-center gap-2">
                          <CircleDollarSign
                            size={20}
                            className="text-blue-600"
                          />

                          <h3 className="text-lg font-bold text-slate-950">
                            Account Operation
                          </h3>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          Perform a controlled financial adjustment on{" "}
                          <span className="font-semibold text-slate-700">
                            {selectedAccount.accountNumber}
                          </span>
                          .
                        </p>
                      </div>

                      {/* OPERATION TABS */}

                      <div className="mb-6 grid grid-cols-3 gap-2 rounded-xl bg-slate-100 p-1">
                        <button
                          type="button"
                          onClick={() => {
                            setOperation("credit");
                            setForm(initialForm);
                            setOperationError("");
                          }}
                          className={`flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-bold transition sm:gap-2 sm:text-sm ${
                            operation === "credit"
                              ? "bg-white text-emerald-700 shadow-sm"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          <ArrowDownLeft size={16} />
                          Credit
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setOperation("debit");
                            setForm(initialForm);
                            setOperationError("");
                          }}
                          className={`flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-bold transition sm:gap-2 sm:text-sm ${
                            operation === "debit"
                              ? "bg-white text-red-700 shadow-sm"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          <ArrowUpRight size={16} />
                          Debit
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setOperation("release");
                            setForm(initialForm);
                            setOperationError("");
                          }}
                          className={`flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-bold transition sm:gap-2 sm:text-sm ${
                            operation === "release"
                              ? "bg-white text-blue-700 shadow-sm"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          <Unlock size={16} />
                          Release
                        </button>
                      </div>

                      {/* BALANCE REFERENCE */}

                      <div className="mb-6 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                          <p className="text-xs font-medium text-slate-500">
                            Total balance
                          </p>
                          <p className="mt-1 break-words text-sm font-bold text-slate-950">
                            {formatMoney(
                              selectedTotalBalance,
                              currency,
                            )}
                          </p>
                        </div>

                        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                          <p className="text-xs font-medium text-emerald-700">
                            Available balance
                          </p>
                          <p className="mt-1 break-words text-sm font-bold text-emerald-800">
                            {formatMoney(
                              selectedAvailableBalance,
                              currency,
                            )}
                          </p>
                        </div>

                        <div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
                          <p className="text-xs font-medium text-amber-700">
                            Ledger balance
                          </p>
                          <p className="mt-1 break-words text-sm font-bold text-amber-800">
                            {formatMoney(
                              selectedLedgerBalance,
                              currency,
                            )}
                          </p>
                        </div>
                      </div>

                      <form
                        onSubmit={handleOperation}
                        className="space-y-5"
                      >
                        <div>
                          <label
                            htmlFor="amount"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                          >
                            Amount
                          </label>

                          <div className="relative">
                            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                              {selectedAccount.currency?.symbol || currency}
                            </span>

                            <input
                              id="amount"
                              name="amount"
                              type="number"
                              min="0.01"
                              step="0.01"
                              max={
                                operation === "release"
                                  ? selectedLedgerBalance
                                  : operation === "debit"
                                    ? selectedAvailableBalance
                                    : undefined
                              }
                              inputMode="decimal"
                              value={form.amount}
                              onChange={handleInput}
                              placeholder="0.00"
                              required
                              className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-lg font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                            />
                          </div>

                          {operation === "release" && (
                            <p className="mt-2 text-xs text-slate-500">
                              Maximum release:{" "}
                              <span className="font-semibold text-amber-700">
                                {formatMoney(
                                  selectedLedgerBalance,
                                  currency,
                                )}
                              </span>
                            </p>
                          )}

                          {operation === "debit" && (
                            <p className="mt-2 text-xs text-slate-500">
                              Maximum debit:{" "}
                              <span className="font-semibold text-emerald-700">
                                {formatMoney(
                                  selectedAvailableBalance,
                                  currency,
                                )}
                              </span>
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="description"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                          >
                            Reason / Description
                          </label>

                          <textarea
                            id="description"
                            name="description"
                            rows={4}
                            value={form.description}
                            onChange={handleInput}
                            placeholder={
                              operation === "credit"
                                ? "Why is this account being credited?"
                                : operation === "debit"
                                  ? "Why is this account being debited?"
                                  : "Why are these ledger funds being released?"
                            }
                            required
                            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                          />
                        </div>

                        <div
                          className={`rounded-xl border p-4 ${
                            operation === "credit"
                              ? "border-emerald-100 bg-emerald-50"
                              : operation === "debit"
                                ? "border-red-100 bg-red-50"
                                : "border-blue-100 bg-blue-50"
                          }`}
                        >
                          <p
                            className={`text-sm font-bold ${
                              operation === "credit"
                                ? "text-emerald-800"
                                : operation === "debit"
                                  ? "text-red-800"
                                  : "text-blue-800"
                            }`}
                          >
                            {currentOperation.title}
                          </p>

                          <p
                            className={`mt-1 text-xs leading-5 ${
                              operation === "credit"
                                ? "text-emerald-700"
                                : operation === "debit"
                                  ? "text-red-700"
                                  : "text-blue-700"
                            }`}
                          >
                            {currentOperation.description}
                          </p>
                        </div>

                        <button
                          type="submit"
                          disabled={
                            submitting ||
                            selectedAccount.status !== "ACTIVE" ||
                            (operation === "release" &&
                              selectedLedgerBalance <= 0) ||
                            (operation === "debit" &&
                              selectedAvailableBalance <= 0)
                          }
                          className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            operation === "credit"
                              ? "bg-emerald-600 hover:bg-emerald-700"
                              : operation === "debit"
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          {submitting ? (
                            <>
                              <RefreshCw
                                size={17}
                                className="animate-spin"
                              />
                              Processing...
                            </>
                          ) : (
                            <>
                              <OperationIcon size={18} />
                              {currentOperation.button}
                            </>
                          )}
                        </button>

                        {selectedAccount.status !== "ACTIVE" && (
                          <p className="text-center text-xs font-medium text-red-600">
                            This account is {selectedAccount.status}.
                            Financial operations require an active account.
                          </p>
                        )}

                        {operation === "release" &&
                          selectedLedgerBalance <= 0 && (
                            <p className="text-center text-xs font-medium text-amber-700">
                              There are no ledger funds available to release.
                            </p>
                          )}
                      </form>
                    </section>

                    {/* ACCOUNT CONTROLS */}

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                      <div className="mb-5">
                        <h3 className="text-lg font-bold text-slate-950">
                          Account Controls
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Review account balances and change its
                          operational status.
                        </p>
                      </div>

                      <div className="mb-5 rounded-2xl bg-slate-950 p-5 text-white">
                        <p className="text-xs font-medium text-slate-400">
                          Total account balance
                        </p>

                        <p className="mt-2 break-words text-2xl font-bold">
                          {formatMoney(
                            selectedTotalBalance,
                            currency,
                          )}
                        </p>

                        <div className="mt-5 space-y-3 border-t border-white/10 pt-4">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-xs text-slate-400">
                              Available balance
                            </span>
                            <span className="text-sm font-semibold text-emerald-300">
                              {formatMoney(
                                selectedAvailableBalance,
                                currency,
                              )}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <span className="text-xs text-slate-400">
                              Ledger balance
                            </span>
                            <span className="text-sm font-semibold text-amber-300">
                              {formatMoney(
                                selectedLedgerBalance,
                                currency,
                              )}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-xs">
                            <span className="text-slate-400">
                              Account number
                            </span>
                            <span className="font-semibold">
                              {selectedAccount.accountNumber}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <button
                          type="button"
                          disabled={
                            statusSubmitting ||
                            selectedAccount.status === "FROZEN"
                          }
                          onClick={() => updateAccountStatus("FROZEN")}
                          className="flex min-h-11 w-full items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 text-sm font-bold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Lock size={17} />
                          Freeze Account
                        </button>

                        <button
                          type="button"
                          disabled={
                            statusSubmitting ||
                            selectedAccount.status === "ACTIVE"
                          }
                          onClick={() => updateAccountStatus("ACTIVE")}
                          className="flex min-h-11 w-full items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Unlock size={17} />
                          Unfreeze / Activate
                        </button>

                        <button
                          type="button"
                          disabled={
                            statusSubmitting ||
                            selectedAccount.status === "SUSPENDED"
                          }
                          onClick={() => updateAccountStatus("SUSPENDED")}
                          className="flex min-h-11 w-full items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 px-4 text-sm font-bold text-orange-700 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <ShieldCheck size={17} />
                          Suspend Account
                        </button>

                        <button
                          type="button"
                          disabled={
                            statusSubmitting ||
                            selectedAccount.status === "CLOSED"
                          }
                          onClick={() => updateAccountStatus("CLOSED")}
                          className="flex min-h-11 w-full items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Lock size={17} />
                          Close Account
                        </button>
                      </div>

                      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-medium text-slate-500">
                            Current status
                          </span>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${statusClass(
                              selectedAccount.status,
                            )}`}
                          >
                            {selectedAccount.status}
                          </span>
                        </div>
                      </div>
                    </section>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Operations;