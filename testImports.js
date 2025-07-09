// Simple test to verify imports work
const authReducer = require('./src/redux/authSlice.ts');
console.log('Auth reducer imported successfully:', typeof authReducer.default);

const store = require('./src/redux/store.ts');
console.log('Store imported successfully:', typeof store.default);
