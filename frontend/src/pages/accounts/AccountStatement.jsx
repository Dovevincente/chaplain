import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  FileText,
  RefreshCw,
  WalletCards,
  XCircle,
} from "lucide-react";

import api from "../../services/api.js";

// --------------------------------------------------
// FORMATTERS
// --------------------------------------------------

const formatMoney = (value, currency = "USD") => {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount)) {
    return `${currency} 0.00`;
  }

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  } catch {
    return `${currency} ${Math.abs(amount).toFixed(2)}`;
  }
};

const formatDate = (value) => {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

// --------------------------------------------------
// TRANSACTION HELPERS
// --------------------------------------------------

const getStatusIcon = (status) => {
  const normalized = String(status ?? "").toUpperCase();

  if (
    ["COMPLETED", "SUCCESS", "POSTED"].includes(normalized)
  ) {
    return CheckCircle2;
  }

  if (
    ["FAILED", "REVERSED", "CANCELLED"].includes(normalized)
  ) {
    return XCircle;
  }

  return Clock3;
};

const getStatusClasses = (status) => {
  const normalized = String(status ?? "").toUpperCase();

  if (
    ["COMPLETED", "SUCCESS", "POSTED"].includes(normalized)
  ) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }

  if (
    ["FAILED", "REVERSED", "CANCELLED"].includes(normalized)
  ) {
    return "bg-rose-50 text-rose-700 ring-rose-200";
  }

  return "bg-amber-50 text-amber-700 ring-amber-200";
};

const getTransactionType = (transaction) =>
  transaction?.type ||
  transaction?.transactionType ||
  transaction?.category ||
  "Transaction";

const getTransactionDescription = (transaction) =>
  transaction?.description ||
  transaction?.narration ||
  transaction?.memo ||
  transaction?.reference ||
  "Banking transaction";

const getTransactionDate = (transaction) =>
  transaction?.createdAt ||
  transaction?.processedAt ||
  transaction?.transactionDate ||
  transaction?.date ||
  transaction?.postedAt;

const getTransactionAmount = (transaction) => {
  return Number(
    transaction?.amount ??
      transaction?.value ??
      transaction?.total ??
      0,
  );
};

const isCreditTransaction = (transaction) => {
  if (typeof transaction?.isCredit === "boolean") {
    return transaction.isCredit;
  }

  if (typeof transaction?.credit === "boolean") {
    return transaction.credit;
  }

  const type = String(
    transaction?.type ||
      transaction?.transactionType ||
      transaction?.direction ||
      "",
  ).toUpperCase();

  if (
    type.includes("CREDIT") ||
    type.includes("DEPOSIT") ||
    type.includes("RECEIVED") ||
    type.includes("REFUND")
  ) {
    return true;
  }

  if (
    type.includes("DEBIT") ||
    type.includes("WITHDRAW") ||
    type.includes("PAYMENT") ||
    type.includes("TRANSFER_OUT")
  ) {
    return false;
  }

  return Number(transaction?.amount ?? 0) >= 0;
};

// --------------------------------------------------
// API RESPONSE HELPERS
// --------------------------------------------------

const extractAccount = (data) => {
  if (!data) return null;

  if (data.id) return data;
  if (data.account?.id) return data.account;
  if (data.data?.id) return data.data;
  if (data.data?.account?.id) return data.data.account;

  return null;
};

const extractTransactions = (data) => {
  if (!data) return [];

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.transactions)) return data.transactions;
  if (Array.isArray(data.data)) return data.data;

  if (Array.isArray(data.data?.transactions)) {
    return data.data.transactions;
  }

  return [];
};

// --------------------------------------------------
// LOADING SKELETON
// --------------------------------------------------

const StatementSkeleton = () => (
  <main className="min-h-screen bg-slate-50">
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-8">
        <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-9 w-64 animate-pulse rounded bg-slate-200" />
        <div className="mt-2 h-5 w-96 max-w-full animate-pulse rounded bg-slate-200" />
      </div>

      <div className="h-64 animate-pulse rounded-3xl bg-slate-950" />

      <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="h-16 animate-pulse border-b border-slate-100 bg-slate-100" />

        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-20 animate-pulse border-b border-slate-100"
          />
        ))}
      </div>
    </div>
  </main>
);

// --------------------------------------------------
// ACCOUNT STATEMENT
// --------------------------------------------------

const AccountStatement = () => {
  const navigate = useNavigate();
  const { accountId } = useParams();

  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [accountError, setAccountError] = useState("");
  const [transactionsError, setTransactionsError] = useState("");

  // ------------------------------------------------
  // LOAD ACCOUNT AND TRANSACTIONS
  // ------------------------------------------------

  const loadStatement = useCallback(
    async ({ silent = false } = {}) => {
      if (!accountId) {
        setAccountError("No account was specified.");
        setTransactions([]);
        setLoading(false);
        return;
      }

      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setAccountError("");
      setTransactionsError("");

      try {
        const [accountResponse, transactionResponse] =
          await Promise.all([
            api.get(`/accounts/${accountId}`),
            api.get(`/accounts/${accountId}/transactions`),
          ]);

        const nextAccount = extractAccount(accountResponse?.data);

        if (!nextAccount) {
          throw new Error(
            "The account information could not be read from the server.",
          );
        }

        setAccount(nextAccount);

        setTransactions(
          extractTransactions(transactionResponse?.data),
        );
      } catch (requestError) {
        const responseMessage =
          requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to load the account statement.";

        if (
          requestError?.config?.url?.includes(
            `/accounts/${accountId}/transactions`,
          )
        ) {
          setTransactionsError(responseMessage);
        } else {
          setAccountError(responseMessage);
        }

        // Retry each resource separately so that a transaction
        // failure does not hide successfully loaded account data.

        try {
          const accountResponse = await api.get(
            `/accounts/${accountId}`,
          );

          const nextAccount = extractAccount(accountResponse?.data);

          if (nextAccount) {
            setAccount(nextAccount);
            setAccountError("");
          }
        } catch {
          // Account error is already stored.
        }

        try {
          const transactionResponse = await api.get(
            `/accounts/${accountId}/transactions`,
          );

          setTransactions(
            extractTransactions(transactionResponse?.data),
          );

          setTransactionsError("");
        } catch (transactionError) {
          setTransactionsError(
            transactionError?.response?.data?.message ||
              transactionError?.message ||
              "Unable to load account transactions.",
          );
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [accountId],
  );

  useEffect(() => {
    loadStatement();
  }, [loadStatement]);

  // ------------------------------------------------
  // THREE-BALANCE ACCOUNT STRUCTURE
  // ------------------------------------------------

  const currencyCode = account?.currency?.code || "USD";

  const availableBalance = Number(
    account?.availableBalance ?? 0,
  );

  const ledgerBalance = Number(
    account?.ledgerBalance ?? 0,
  );

  // The backend's total balance is authoritative.
  // Fallback supports responses that do not yet include balance.

  const accountBalance = Number(account?.balance);

  const totalBalance = Number.isFinite(accountBalance)
    ? accountBalance
    : availableBalance + ledgerBalance;

  // ------------------------------------------------
  // TRANSACTION SUMMARIES
  // ------------------------------------------------

  const totalCredits = useMemo(() => {
    return transactions.reduce((total, transaction) => {
      if (!isCreditTransaction(transaction)) {
        return total;
      }

      const amount = Math.abs(
        getTransactionAmount(transaction),
      );

      return total + (Number.isFinite(amount) ? amount : 0);
    }, 0);
  }, [transactions]);

  const totalDebits = useMemo(() => {
    return transactions.reduce((total, transaction) => {
      if (isCreditTransaction(transaction)) {
        return total;
      }

      const amount = Math.abs(
        getTransactionAmount(transaction),
      );

      return total + (Number.isFinite(amount) ? amount : 0);
    }, 0);
  }, [transactions]);

  // ------------------------------------------------
  // LOADING STATE
  // ------------------------------------------------

  if (loading) {
    return <StatementSkeleton />;
  }

  // ------------------------------------------------
  // ACCOUNT ERROR STATE
  // ------------------------------------------------

  if (accountError || !account) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          <button
            type="button"
            onClick={() => navigate("/accounts")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to accounts
          </button>

          <section className="rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <FileText className="h-7 w-7" />
            </div>

            <h1 className="mt-5 text-xl font-bold text-slate-950">
              Unable to load statement
            </h1>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
              {accountError ||
                "The requested account could not be found."}
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => loadStatement()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </button>

              <button
                type="button"
                onClick={() => navigate("/accounts")}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Back to accounts
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  // ------------------------------------------------
  // MAIN STATEMENT PAGE
  // ------------------------------------------------

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* HEADER */}

        <header className="mb-6">
          <button
            type="button"
            onClick={() => navigate(`/accounts/${account.id}`)}
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to account
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                The Chaplaincy Savings and Credit Union (TCSCU)
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Account Statement
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Review the transaction activity and balances for this account.
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadStatement({ silent: true })}
              disabled={refreshing}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>
          </div>
        </header>

        {/* THREE ACCOUNT BALANCES */}

        <section className="overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl">
          <div className="relative p-6 sm:p-8">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/5 blur-3xl" />

            <div className="relative">

              {/* TOTAL BALANCE */}

              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Total Account Balance
                  </p>

                  <p className="mt-2 break-words text-4xl font-bold tracking-tight sm:text-5xl">
                    {formatMoney(totalBalance, currencyCode)}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Account {account.accountNumber || "Not available"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 sm:min-w-44">
                  <p className="text-xs uppercase tracking-wider text-slate-400">
                    Account Type
                  </p>

                  <p className="mt-2 text-base font-semibold text-white">
                    {String(account.type || "ACCOUNT")
                      .replaceAll("_", " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (character) =>
                        character.toUpperCase(),
                      )}
                  </p>
                </div>
              </div>

              {/* AVAILABLE AND LEDGER BALANCES */}

              <div className="mt-8 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-2">

                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
                    Available Balance
                  </p>

                  <p className="mt-2 break-words text-2xl font-bold text-white">
                    {formatMoney(availableBalance, currencyCode)}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-emerald-100/75">
                    Funds currently available for eligible spending and transfers.
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-200">
                    Ledger Balance
                  </p>

                  <p className="mt-2 break-words text-2xl font-bold text-white">
                    {formatMoney(ledgerBalance, currencyCode)}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-amber-100/75">
                    Funds currently held and unavailable until released.
                  </p>
                </div>

              </div>

              <p className="mt-5 text-xs leading-5 text-slate-400">
                Total balance represents all account funds. Available balance
                and ledger balance are shown separately so held funds are not
                mistaken for spendable funds.
              </p>
            </div>
          </div>
        </section>

        {/* TRANSACTION SUMMARY */}

        <section className="mt-6 grid gap-4 sm:grid-cols-3">

          {/* CREDITS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <ArrowDownLeft className="h-5 w-5" />
            </div>

            <p className="mt-4 text-xs font-medium uppercase tracking-wider text-slate-400">
              Credits
            </p>

            <p className="mt-2 text-xl font-bold text-slate-950">
              {formatMoney(totalCredits, currencyCode)}
            </p>
          </div>

          {/* DEBITS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
              <ArrowUpRight className="h-5 w-5" />
            </div>

            <p className="mt-4 text-xs font-medium uppercase tracking-wider text-slate-400">
              Debits
            </p>

            <p className="mt-2 text-xl font-bold text-slate-950">
              {formatMoney(totalDebits, currencyCode)}
            </p>
          </div>

          {/* TRANSACTION COUNT */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <FileText className="h-5 w-5" />
            </div>

            <p className="mt-4 text-xs font-medium uppercase tracking-wider text-slate-400">
              Transactions
            </p>

            <p className="mt-2 text-xl font-bold text-slate-950">
              {transactions.length}
            </p>
          </div>

        </section>

        {/* TRANSACTION ERROR */}

        {transactionsError && (
          <section className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-rose-900">
                  Unable to load transactions
                </h2>

                <p className="mt-1 text-sm leading-6 text-rose-700">
                  {transactionsError}
                </p>
              </div>

              <button
                type="button"
                onClick={() => loadStatement({ silent: true })}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-800"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </button>
            </div>
          </section>
        )}

        {/* TRANSACTION HISTORY */}

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Transaction Activity
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your account transaction history.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/transactions")}
              className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950"
            >
              View all transactions
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          {transactions.length === 0 ? (
            <div className="p-10 text-center sm:p-14">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <FileText className="h-6 w-6" />
              </div>

              <h3 className="mt-4 font-semibold text-slate-950">
                No transactions yet
              </h3>

              <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
                There are no transactions available for this account at the
                moment.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {transactions.map((transaction, index) => {
                const credit = isCreditTransaction(transaction);
                const amount = getTransactionAmount(transaction);
                const status = transaction?.status || "POSTED";
                const StatusIcon = getStatusIcon(status);
                const transactionId = transaction?.id;

                return (
                  <div
                    key={
                      transactionId ||
                      `${getTransactionDate(transaction)}-${index}`
                    }
                    className="group p-5 transition hover:bg-slate-50 sm:p-6"
                  >
                    <div className="flex items-start gap-4">

                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          credit
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {credit ? (
                          <ArrowDownLeft className="h-5 w-5" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <h3 className="truncate font-semibold text-slate-950">
                              {getTransactionType(transaction)}
                            </h3>

                            <p className="mt-1 text-sm leading-5 text-slate-500">
                              {getTransactionDescription(transaction)}
                            </p>
                          </div>

                          <p
                            className={`shrink-0 text-base font-bold ${
                              credit
                                ? "text-emerald-700"
                                : "text-slate-950"
                            }`}
                          >
                            {credit ? "+" : "-"}
                            {formatMoney(amount, currencyCode)}
                          </p>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">

                          <span>
                            {formatDate(getTransactionDate(transaction))}
                          </span>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium ring-1 ${getStatusClasses(
                              status,
                            )}`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {String(status)}
                          </span>

                          {transaction?.reference && (
                            <span className="font-mono">
                              Ref: {transaction.reference}
                            </span>
                          )}

                          {transactionId && (
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/transactions/${transactionId}`)
                              }
                              className="font-semibold text-slate-600 underline-offset-4 hover:text-slate-950 hover:underline"
                            >
                              View details
                            </button>
                          )}

                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* STATEMENT INFORMATION */}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <WalletCards className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-950">
                Statement information
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                This statement displays transaction activity returned by your
                The Chaplaincy Savings and Credit Union (TCSCU) account service.
                For complete transaction information, open the individual
                transaction details.
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}

        <footer className="mt-10 border-t border-slate-200 pt-5">
          <div className="flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              The Chaplaincy Savings and Credit Union (TCSCU) · Secure digital
              banking
            </p>

            <p>Account statement · {currencyCode}</p>
          </div>
        </footer>

      </div>
    </main>
  );
};

export default AccountStatement;