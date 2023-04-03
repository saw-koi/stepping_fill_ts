module.exports = {
  collectCoverage: true,

  coverageDirectory: "coverage",

  coverageProvider: "v8",

  roots: [
    "<rootDir>/src"
  ],

  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },

};
