# API Configuration Guide

## Overview

The application now uses a centralized API configuration system that reads the backend URL from environment variables. This allows you to easily change the backend URL without modifying code.

## File Structure

```
frontend/
├── utils/
│   └── apiConfig.ts          ← Central API configuration
├── .env.example              ← Template for environment variables
└── .env.local (not committed) ← Local development settings
```

## Setup Instructions

### 1. Local Development

Create a `.env.local` file in the `frontend/` directory:

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Then restart your development server:
```bash
npm run dev
```

### 2. Vercel Deployment

In your Vercel dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add a new variable:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://rs-10-convert-one-million-production.up.railway.app`
   - **Environments**: Select all (or Production)
3. Click **Save**
4. Go to **Deployments** and redeploy to apply changes

### 3. Other Deployment Platforms

Set the `NEXT_PUBLIC_API_URL` environment variable to your backend URL:

**Netlify**:
- Site settings → Build & deploy → Environment

**AWS Amplify**:
- App settings → Environment variables

**Railway**:
- Variables section in your service

## API Configuration File

The `apiConfig.ts` file exports:

### Base URL
```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://rs-10-convert-one-million.onrender.com';
```

### Helper Functions

#### Generic Fetch Wrapper
```typescript
apiFetch(endpoint: string, options?: RequestInit)
```
- Automatically adds Authorization header if token exists
- Converts body objects to JSON
- Returns fetch Response object

#### Convenience Methods
```typescript
apiGet(endpoint: string)              // GET request
apiPost(endpoint: string, body: any)  // POST request
apiPut(endpoint: string, body: any)   // PUT request
apiDelete(endpoint: string)            // DELETE request
```

## Usage Examples

### Before (Old Way - Hardcoded URL)
```typescript
const response = await fetch('', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Cache-Control': 'no-cache'
  }
});
```

### After (New Way - Using apiConfig)
```typescript
import { apiGet } from '../utils/apiConfig';

const response = await apiGet('/api/admin/users');
```

## Common Scenarios

### GET Request with Error Handling
```typescript
import { apiGet } from '../utils/apiConfig';

try {
  const response = await apiGet('/api/admin/users');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  console.log(data);
} catch (err) {
  console.error('Failed to fetch users:', err);
}
```

### POST Request with Body
```typescript
import { apiPost } from '../utils/apiConfig';

try {
  const response = await apiPost('/api/admin/approve-payment', { 
    paymentId: '123' 
  });
  const result = await response.json();
  if (response.ok) {
    alert('Payment approved!');
  }
} catch (err) {
  console.error('Error:', err);
}
```

### PUT Request
```typescript
import { apiPut } from '../utils/apiConfig';

try {
  const response = await apiPut('/api/admin/ban-user/userId', {});
  if (response.ok) {
    console.log('User banned');
  }
} catch (err) {
  console.error('Error:', err);
}
```

## Important Notes

⚠️ **Environment Variable Naming**
- Must start with `NEXT_PUBLIC_` to be exposed to browser
- Without this prefix, the variable is only available on the server
- Never expose sensitive tokens in env variable names

⚠️ **Token Handling**
- Tokens are automatically read from `localStorage.getItem('token')`
- Added to every request as `Authorization: Bearer <token>`
- Works only in browser context (useEffect hooks, event handlers)

⚠️ **Changes Take Effect**
- Local development: Automatic with `npm run dev`
- Vercel: Requires redeploy after changing env variables
- Other platforms: May require rebuild/redeploy

## Migrating Existing Code

When updating existing files, follow this pattern:

1. **Add import**:
```typescript
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/apiConfig';
```

2. **Replace fetch calls**:
```typescript
// Old
const response = await fetch(`${baseUrl}/api/admin/users`, { headers });

// New
const response = await apiGet('/api/admin/users');
```

3. **Remove manual token/header setup**:
```typescript
// Old - Remove these
const token = localStorage.getItem('token');
const headers = { 'Authorization': `Bearer ${token}` };

// New - Already handled by apiConfig
```

## Troubleshooting

### API calls still hitting old URL?
- Check `.env.local` or Vercel env vars
- Restart development server: `npm run dev`
- Clear browser cache and localStorage
- Verify `NEXT_PUBLIC_API_URL` is set correctly

### 401 Unauthorized errors?
- Token may have expired: User needs to login again
- Check that token is stored in localStorage
- Verify backend accepts the token format

### CORS errors?
- Backend URL must allow requests from frontend domain
- Check backend CORS configuration
- In development, ensure backend is running on correct port

## Files Updated

The following files have been updated to use `apiConfig`:

- ✅ `frontend/pages/admin.tsx` - All API calls converted
- 📝 Other files (dashboard.tsx, etc.) - Can be updated incrementally

## Next Steps

1. Create `.env.local` in frontend directory
2. Set `NEXT_PUBLIC_API_URL` for your environment
3. Test that API calls work correctly
4. Update remaining files to use the new configuration
5. Deploy with environment variables configured

---

**Last Updated**: April 2026
