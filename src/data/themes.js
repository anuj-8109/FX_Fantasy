export const appTypes = [
  {
    id: 'trading',
    name: 'Dream Trading',
    description: 'Fantasy stock trading contest platform',
    icon: '📈',
    features: ['Contest Management', 'Live Leaderboards', 'Virtual Portfolio', 'Real Rewards']
  },
  {
    id: 'gaming',
    name: 'Game Arena',
    description: 'Multi-game tournament platform',  
    icon: '🎮',
    features: ['Tournament Brackets', 'Player Rankings', 'Prize Pools', 'Live Streaming']
  },
  {
    id: 'sports',
    name: 'Sports Fantasy',
    description: 'Fantasy sports league management',
    icon: '⚽',
    features: ['Team Building', 'Match Predictions', 'Season Leagues', 'Player Statistics']
  },
  {
    id: 'crypto',
    name: 'Crypto Wars',
    description: 'Cryptocurrency trading battles',
    icon: '₿',
    features: ['Crypto Portfolios', 'Market Simulation', 'Trading Bots', 'DeFi Integration']
  },
  {
    id: 'ecommerce',
    name: 'Shop Master',
    description: 'E-commerce management system',
    icon: '🛒',
    features: ['Product Catalog', 'Order Processing', 'Inventory Control', 'Customer Analytics']
  }
];

export const themes = [
  // Trading Themes
  {
    id: 'trading-pro',
    name: 'Trading Pro Dark',
    description: 'Professional dark trading interface',
    className: 'theme-trading-pro',
    category: 'dark',
    appType: appTypes[0]
  },
  {
    id: 'trading-light',
    name: 'Trading Light',
    description: 'Clean light trading interface',
    className: 'theme-trading-light',
    category: 'light',
    appType: appTypes[0]
  },
  {
    id: 'wall-street',
    name: 'Wall Street Elite',
    description: 'Premium gold and black trading theme',
    className: 'theme-wall-street',
    category: 'dark',
    appType: appTypes[0]
  },
  {
    id: 'bull-market',
    name: 'Bull Market Green',
    description: 'Green-focused bullish trading theme',
    className: 'theme-bull-market',
    category: 'colorful',
    appType: appTypes[0]
  },
  {
    id: 'bear-market',
    name: 'Bear Market Red',
    description: 'Red-focused bearish trading theme',
    className: 'theme-bear-market',
    category: 'colorful',
    appType: appTypes[0]
  },

  // Gaming Themes
  {
    id: 'gaming-neon',
    name: 'Gaming Neon',
    description: 'Vibrant neon colors for gaming platforms',
    className: 'theme-gaming-neon',
    category: 'colorful',
    appType: appTypes[1]
  },
  {
    id: 'cyber-arena',
    name: 'Cyber Arena',
    description: 'Futuristic cyber gaming theme',
    className: 'theme-cyber-arena',
    category: 'dark',
    appType: appTypes[1]
  },
  {
    id: 'retro-arcade',
    name: 'Retro Arcade',
    description: '80s retro gaming aesthetic',
    className: 'theme-retro-arcade',
    category: 'colorful',
    appType: appTypes[1]
  },
  {
    id: 'esports-pro',
    name: 'eSports Pro',
    description: 'Professional esports tournament theme',
    className: 'theme-esports-pro',
    category: 'dark',
    appType: appTypes[1]
  },

  // Sports Themes
  {
    id: 'sports-green',
    name: 'Sports Field',
    description: 'Fresh green theme inspired by sports fields',
    className: 'theme-sports-green',
    category: 'colorful',
    appType: appTypes[2]
  },
  {
    id: 'champion-gold',
    name: 'Champion Gold',
    description: 'Golden championship theme',
    className: 'theme-champion-gold',
    category: 'colorful',
    appType: appTypes[2]
  },
  {
    id: 'stadium-night',
    name: 'Stadium Night',
    description: 'Dark stadium atmosphere theme',
    className: 'theme-stadium-night',
    category: 'dark',
    appType: appTypes[2]
  },

  // Crypto Themes
  {
    id: 'crypto-gold',
    name: 'Crypto Gold',
    description: 'Golden theme for cryptocurrency platforms',
    className: 'theme-crypto-gold',
    category: 'colorful',
    appType: appTypes[3]
  },
  {
    id: 'bitcoin-orange',
    name: 'Bitcoin Orange',
    description: 'Bitcoin-inspired orange theme',
    className: 'theme-bitcoin-orange',
    category: 'colorful',
    appType: appTypes[3]
  },
  {
    id: 'ethereum-blue',
    name: 'Ethereum Blue',
    description: 'Ethereum-inspired blue theme',
    className: 'theme-ethereum-blue',
    category: 'colorful',
    appType: appTypes[3]
  },
  {
    id: 'defi-purple',
    name: 'DeFi Purple',
    description: 'DeFi protocol purple theme',
    className: 'theme-defi-purple',
    category: 'colorful',
    appType: appTypes[3]
  },

  // E-commerce Themes
  {
    id: 'shop-blue',
    name: 'Shop Ocean',
    description: 'Trust-building blue for e-commerce',
    className: 'theme-shop-blue',
    category: 'light',
    appType: appTypes[4]
  },
  {
    id: 'luxury-black',
    name: 'Luxury Black',
    description: 'Premium luxury shopping theme',
    className: 'theme-luxury-black',
    category: 'dark',
    appType: appTypes[4]
  },
  {
    id: 'marketplace-multi',
    name: 'Marketplace Multi',
    description: 'Colorful marketplace theme',
    className: 'theme-marketplace-multi',
    category: 'colorful',
    appType: appTypes[4]
  }
];
