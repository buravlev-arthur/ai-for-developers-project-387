module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run server:start',
      url: [
        'http://localhost:3001/',
        'http://localhost:3001/booking',
        'http://localhost:3001/owner',
        'http://localhost:3001/owner/event-types',
      ],
      numberOfRuns: 1,
      settings: {
        chromeFlags: '--no-sandbox',
      },
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['warn', { minScore: 0.5 }],
        'categories:accessibility': ['warn', { minScore: 0.7 }],
        'categories:best-practices': ['warn', { minScore: 0.7 }],
        'categories:seo': ['warn', { minScore: 0.7 }],
      },
    },
  },
};
