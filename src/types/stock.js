/**
 * @typedef {Object} Stock
 * @property {string} id - Unique identifier for the stock
 * @property {string} symbol - Stock symbol/ticker
 * @property {string} name - Company name
 * @property {number} price - Current stock price
 * @property {number} change - Price change from previous close
 * @property {number} changePercent - Percentage change from previous close
 * @property {string} volume - Trading volume
 * @property {string} marketCap - Market capitalization
 * @property {string} sector - Industry sector
 * @property {boolean} isActive - Whether the stock is currently active for trading
 */

/**
 * @typedef {Object} StockPrice
 * @property {string} symbol - Stock symbol/ticker
 * @property {number} price - Stock price at the timestamp
 * @property {Date} timestamp - When the price was recorded
 */

// Export the types for use in other files
export const StockSector = {
  TECHNOLOGY: 'Technology',
  HEALTHCARE: 'Healthcare',
  FINANCIAL: 'Financial',
  CONSUMER_DISCRETIONARY: 'Consumer Discretionary',
  CONSUMER_STAPLES: 'Consumer Staples',
  INDUSTRIALS: 'Industrials',
  ENERGY: 'Energy',
  MATERIALS: 'Materials',
  UTILITIES: 'Utilities',
  REAL_ESTATE: 'Real Estate',
  CRYPTO: 'Cryptocurrency',
  FOREX: 'Foreign Exchange',
  COMMODITIES: 'Commodities'
};
