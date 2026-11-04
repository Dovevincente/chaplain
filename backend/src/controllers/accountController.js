
import {
  getUserAccounts,
  getUserAccountById,
  getUserAccountBalance,
} from "../services/accountService.js";

/*
|--------------------------------------------------------------------------
| GET CUSTOMER ACCOUNTS
|--------------------------------------------------------------------------
| GET /api/accounts
|
| Return all accounts belonging to the authenticated customer.
*/

export const listAccounts = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const accounts = await getUserAccounts(req.user.id);

    if (!Array.isArray(accounts)) {
      throw new Error(
        "Account service returned an invalid accounts result.",
      );
    }

    return res.status(200).json({
      success: true,
      data: {
        accounts,
        count: accounts.length,
      },
    });
  } catch (error) {
    return next(error);
  }
};

/*
|--------------------------------------------------------------------------
| GET SINGLE ACCOUNT
|--------------------------------------------------------------------------
| GET /api/accounts/:accountId
|
| Return one account belonging to the authenticated customer.
*/

export const getAccount = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const accountId = req.params?.accountId;

    if (!accountId || !accountId.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid account ID is required.",
      });
    }

    const account = await getUserAccountById(
      req.user.id,
      accountId,
    );

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        account,
      },
    });
  } catch (error) {
    return next(error);
  }
};

/*
|--------------------------------------------------------------------------
| GET ACCOUNT BALANCE
|--------------------------------------------------------------------------
| GET /api/accounts/:accountId/balance
|
| Return balance information for an account belonging to
| the authenticated customer.
*/

export const getAccountBalance = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const accountId = req.params?.accountId;

    if (!accountId || !accountId.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid account ID is required.",
      });
    }

    const balance = await getUserAccountBalance(
      req.user.id,
      accountId,
    );

    if (balance === null || balance === undefined) {
      return res.status(404).json({
        success: false,
        message: "Account balance not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        balance,
      },
    });
  } catch (error) {
    return next(error);
  }
};