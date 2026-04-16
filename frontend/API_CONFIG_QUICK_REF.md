# API Config Quick Reference

## Setup (One-time)

```bash
# 1. Create .env.local in frontend/
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > frontend/.env.local

# 2. Restart dev server
npm run dev
```

## Usage (In Components)

```typescript
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/apiConfig';

// GET
const response = await apiGet('/api/admin/users');

// POST
const response = await apiPost('/api/admin/approve-payment', { paymentId: '123' });

// PUT
const response = await apiPut('/api/admin/ban-user/userId', {});

// DELETE
const response = await apiDelete('/api/admin/something');

// Handle response
if (response.ok) {
  const data = await response.json();
} else {
  const error = await response.json();
}
```

## Environment Variables

| Platform | Location | Steps |
|----------|----------|-------|
| Local Dev | `.env.local` | Create file in `frontend/` |
| Vercel | Dashboard Settings | Settings → Environment Variables |
| Netlify | Site Settings | Build & deploy → Environment |
| Railway | Variables | Service variables section |

## Changing Backend URL

**Development**: Edit `.env.local` and restart `npm run dev`

**Production (Vercel)**:
1. Go to Vercel dashboard
2. Settings → Environment Variables
3. Change `NEXT_PUBLIC_API_URL` value
4. Redeploy from Deployments tab

## Example: Full API Flow

```typescript
import { apiPost } from '../utils/apiConfig';

// Make request (token auto-added from localStorage)
const response = await apiPost('/api/admin/approve-payment', { 
  paymentId: paymentId 
});

// Check status
if (response.ok) {
  const result = await response.json();
  alert('✅ Payment approved!');
  window.location.reload();
} else {
  const error = await response.json();
  alert('❌ Error: ' + error.message);
}
```

## Notes

- ✅ Token automatically added from localStorage
- ✅ All headers properly formatted
- ✅ Works with any backend URL
- ❌ Don't use for sensitive data in URLs
- ❌ Don't commit `.env.local` to git

---

See **API_CONFIG_GUIDE.md** for full documentation
