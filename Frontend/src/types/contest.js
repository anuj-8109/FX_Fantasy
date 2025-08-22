/**
 * @typedef {Object} Contest
 * @property {string} id - Unique identifier for the contest
 * @property {string} name - Name of the contest
 * @property {string} description - Description of the contest
 * @property {number} entryFee - Entry fee amount
 * @property {number} prizePool - Total prize pool amount
 * @property {number} participants - Current number of participants
 * @property {number} maxParticipants - Maximum allowed participants
 * @property {string} startDate - Start date and time
 * @property {string} endDate - End date and time
 * @property {'upcoming' | 'active' | 'completed'} status - Current status of the contest
 * @property {string} createdAt - Creation timestamp
 * @property {string[]} selectedStocks - Array of selected stock IDs
 * @property {'stock_trading' | 'crypto_trading' | 'forex_trading' | 'mixed_trading'} contestType - Type of trading contest
 * @property {Object} rules - Contest rules
 * @property {number} rules.maxStockSelection - Maximum number of stocks a participant can select
 * @property {number} rules.initialBudget - Starting budget for participants
 * @property {string} rules.tradingHours - Trading hours for the contest
 * @property {boolean} rules.allowShortSelling - Whether short selling is allowed
 */

/**
 * @typedef {Object} GameAnalytics
 * @property {string} id - Unique identifier for the analytics record
 * @property {string} date - Date of the analytics data
 * @property {number} activeUsers - Number of active users
 * @property {number} newUsers - Number of new users
 * @property {number} revenue - Revenue generated
 * @property {number} contestsPlayed - Number of contests played
 * @property {number} avgSessionTime - Average session time in minutes
 */

/**
 * @typedef {Object} WalletTransaction
 * @property {string} id - Unique identifier for the transaction
 * @property {string} userId - ID of the user making the transaction
 * @property {'deposit' | 'withdrawal' | 'contest_entry' | 'prize_payout'} type - Type of transaction
 * @property {number} amount - Transaction amount
 * @property {'pending' | 'completed' | 'failed'} status - Status of the transaction
 * @property {string} date - Transaction timestamp
 * @property {string} description - Description of the transaction
 */

// Export the types for use in other files
export const ContestType = {
  STOCK_TRADING: 'stock_trading',
  CRYPTO_TRADING: 'crypto_trading',
  FOREX_TRADING: 'forex_trading',
  MIXED_TRADING: 'mixed_trading'
};

export const ContestStatus = {
  UPCOMING: 'upcoming',
  ACTIVE: 'active',
  COMPLETED: 'completed'
};

export const TransactionType = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  CONTEST_ENTRY: 'contest_entry',
  PRIZE_PAYOUT: 'prize_payout'
};

export const TransactionStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed'
};
