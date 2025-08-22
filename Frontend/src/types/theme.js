/**
 * @typedef {Object} Theme
 * @property {string} id - Unique identifier for the theme
 * @property {string} name - Name of the theme
 * @property {string} description - Description of the theme
 * @property {string} className - CSS class name for the theme
 * @property {'light' | 'dark' | 'colorful'} category - Theme category
 * @property {AppType} appType - Associated application type
 */

/**
 * @typedef {Object} AppType
 * @property {string} id - Unique identifier for the app type
 * @property {string} name - Name of the app type
 * @property {string} description - Description of the app type
 * @property {string} icon - Icon identifier for the app type
 * @property {string[]} features - Array of features available in this app type
 */

/**
 * @typedef {Object} AdminPermissions
 * @property {boolean} canChangeTheme - Whether the admin can change themes
 * @property {boolean} canManageUsers - Whether the admin can manage users
 * @property {boolean} canManageContent - Whether the admin can manage content
 * @property {boolean} canViewAnalytics - Whether the admin can view analytics
 * @property {boolean} canManageSettings - Whether the admin can manage settings
 */

/**
 * @typedef {Object} AdminUser
 * @property {string} id - Unique identifier for the admin user
 * @property {string} name - Name of the admin user
 * @property {string} email - Email address of the admin user
 * @property {'super-admin' | 'admin' | 'moderator'} role - Role of the admin user
 * @property {AdminPermissions} permissions - Permissions granted to the admin user
 */

// Export the types for use in other files
export const ThemeCategory = {
  LIGHT: 'light',
  DARK: 'dark',
  COLORFUL: 'colorful'
};

export const AdminRole = {
  SUPER_ADMIN: 'super-admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
};
