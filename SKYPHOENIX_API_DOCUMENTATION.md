# SkyPhoenix API Integration Documentation

## Overview

This document describes the implemented SkyPhoenix API integration in our backend. All functions are available through the Edge Function deployed at `/skyphoenix-api`.

## Base URL

```
https://[your-supabase-url]/functions/v1/skyphoenix-api
```

## Authentication

All endpoints (except `/callback`) require:
- **Authorization Header**: `Bearer <your-jwt-token>`
- **Hash Signature**: Automatically generated using SHA256 HMAC

The system automatically generates hash signatures using:
- Unix timestamp
- Merchant email
- API secret key

## Available Functions

### 1. Create PayIn Order

Create a payment collection order (customer pays you).

**Endpoint**: `POST /payin`

**Request Body**:
```json
{
  "merchantId": "uuid",
  "amount": 100.50,
  "currency": "USD",
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "paymentMethod": "card",
  "callbackUrl": "https://your-domain.com/api/callback",
  "returnUrl": "https://your-domain.com/payment/success"
}
```

**Response**:
```json
{
  "orderId": "sky_12345678",
  "status": "pending",
  "paymentUrl": "https://pay.skyphoenix.net/checkout/12345678",
  "amount": 100.50,
  "currency": "USD"
}
```

**Transaction Flow**:
1. System creates transaction record with status `pending`
2. Generates hash signature automatically
3. Sends request to SkyPhoenix API
4. Updates transaction with `processing` or `failed` status
5. Returns response to client

---

### 2. Create PayOut Order

Create a payment disbursement order (you pay someone).

**Endpoint**: `POST /payout`

**Request Body**:
```json
{
  "merchantId": "uuid",
  "amount": 50.00,
  "currency": "USD",
  "beneficiaryEmail": "recipient@example.com",
  "beneficiaryName": "Jane Smith",
  "beneficiaryAccount": "1234567890",
  "callbackUrl": "https://your-domain.com/api/callback"
}
```

**Response**:
```json
{
  "orderId": "sky_87654321",
  "status": "processing",
  "amount": 50.00,
  "currency": "USD"
}
```

**Transaction Flow**:
1. System creates transaction record with status `pending`
2. Generates hash signature automatically
3. Sends request to SkyPhoenix API
4. Updates transaction with `processing` or `failed` status
5. Returns response to client

---

### 3. Cancel PayIn Order

Cancel an existing payment collection order.

**Endpoint**: `POST /cancel-payin`

**Request Body**:
```json
{
  "orderId": "sky_12345678",
  "merchantId": "uuid"
}
```

**Response**:
```json
{
  "success": true,
  "orderId": "sky_12345678",
  "status": "cancelled"
}
```

**Notes**:
- Can only cancel orders in `pending` or `processing` status
- Updates transaction status to `cancelled`
- Hash signature generated automatically

---

### 4. Cancel PayOut Order

Cancel an existing payment disbursement order.

**Endpoint**: `POST /cancel-payout`

**Request Body**:
```json
{
  "orderId": "sky_87654321",
  "merchantId": "uuid"
}
```

**Response**:
```json
{
  "success": true,
  "orderId": "sky_87654321",
  "status": "cancelled"
}
```

**Notes**:
- Can only cancel orders in `pending` or `processing` status
- Updates transaction status to `cancelled`
- Hash signature generated automatically

---

### 5. Callback Handler

Receives webhook callbacks from SkyPhoenix for payment status updates.

**Endpoint**: `POST /callback`

**Authentication**: None (public endpoint with signature verification)

**Request Body** (from SkyPhoenix):
```json
{
  "orderId": "sky_12345678",
  "status": "completed",
  "amount": 100.50,
  "currency": "USD",
  "transactionId": "txn_98765432",
  "timestamp": 1710000000,
  "signature": "hash_signature_from_skyphoenix"
}
```

**Security**:
- Verifies hash signature before processing
- Signature verification prevents unauthorized updates
- Only processes callbacks with valid signatures

**Status Mapping**:
- `success`, `completed` → `completed`
- `failed` → `failed`
- `cancelled` → `cancelled`
- `pending`, `processing` → `processing`

---

## Hash Signature Generation

The system automatically generates hash signatures using:

**Algorithm**: HMAC-SHA256

**Signature String**:
```
timestamp + email
```

**Example**:
```javascript
const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp
const signatureString = `${timestamp}${merchantEmail}`;
const signature = HMAC_SHA256(signatureString, apiSecret);
```

**Headers Sent to SkyPhoenix**:
```
X-App-Access-Time: 1710000000
X-App-Access-Email: merchant@example.com
X-App-Access-Sig: a1b2c3d4e5f6...
```

---

## Database Schema

### Transactions Table

All API calls create or update records in the `transactions` table:

```sql
- id: uuid (primary key)
- merchant_id: uuid (foreign key to merchants)
- transaction_type: 'payin' | 'payout'
- skyphoenix_order_id: text
- amount: decimal(15,2)
- currency: text
- status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
- payment_method: text
- customer_email: text
- customer_name: text
- callback_url: text
- return_url: text
- request_data: jsonb (full request payload)
- response_data: jsonb (full SkyPhoenix response)
- error_message: text
- created_at: timestamptz
- updated_at: timestamptz
- completed_at: timestamptz
```

---

## Error Handling

All endpoints return errors in this format:

```json
{
  "error": "Error message description"
}
```

**Common Errors**:

| Status Code | Error | Description |
|------------|-------|-------------|
| 400 | Bad Request | Invalid request body or missing parameters |
| 401 | Unauthorized | Missing or invalid authorization token |
| 404 | Not Found | Merchant credentials or transaction not found |
| 500 | Internal Server Error | Server-side processing error |

**Error Example**:
```json
{
  "error": "Merchant credentials not found"
}
```

---

## Usage Examples

### JavaScript/TypeScript Example

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Get JWT token from authenticated session
const { data: { session } } = await supabase.auth.getSession();

// Create PayIn Order
const response = await fetch(
  `${SUPABASE_URL}/functions/v1/skyphoenix-api/payin`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      merchantId: 'merchant-uuid',
      amount: 100.50,
      currency: 'USD',
      customerEmail: 'customer@example.com',
      customerName: 'John Doe',
      paymentMethod: 'card',
      callbackUrl: 'https://your-domain.com/api/callback',
      returnUrl: 'https://your-domain.com/payment/success',
    }),
  }
);

const data = await response.json();
console.log(data);
```

### Cancel Transaction Example

```typescript
// Cancel PayIn Order
const response = await fetch(
  `${SUPABASE_URL}/functions/v1/skyphoenix-api/cancel-payin`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      orderId: 'sky_12345678',
      merchantId: 'merchant-uuid',
    }),
  }
);

const data = await response.json();
console.log(data);
```

---

## Security Best Practices

1. **Never expose API secrets in client-side code**
   - All API calls go through the Edge Function
   - Secrets are stored securely in the database

2. **Always verify callback signatures**
   - The system automatically verifies all callback signatures
   - Invalid signatures are rejected

3. **Use HTTPS for all requests**
   - All communication is encrypted
   - Callback URLs must use HTTPS

4. **Monitor transaction logs**
   - All requests and responses are logged
   - Check `transactions` table for audit trail

5. **Implement rate limiting**
   - Consider implementing rate limiting on your application layer
   - Monitor for unusual transaction patterns

---

## Testing

### Test Mode

The system is configured for development/test mode:
- Uses `dev` environment credentials
- Connects to SkyPhoenix dev API: `https://dev-api.skyphoenix.net/api/v3`

### Production Mode

To switch to production:
1. Update merchant credentials with `environment: 'production'`
2. Change `SKYPHOENIX_BASE_URL` in the Edge Function
3. Redeploy the Edge Function

---

## Support

For issues or questions:
1. Check transaction logs in the `transactions` table
2. Review `error_message` field for failed transactions
3. Verify merchant credentials are active and valid
4. Check `response_data` for SkyPhoenix error details
