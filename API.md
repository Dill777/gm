# API Endpoints

## Auth

- **`nextAuth`**  
  `GET /api/auth/[...nextauth]`  
  `POST /api/auth/[...nextauth]`  
  _Authentication endpoints (NextAuth.js)_

---

## Resolve Domain

- **`resolveDomain`**  
  `GET /api/resolveDomain?domain=example&chain=123`  
  _Resolve a domain to an address. Requires `domain` and `chain` as query parameters._

---

## Resolve Address

- **`resolveAddress`**  
  `GET /api/resolveAddress?address=0x...&chain=123`  
  _Resolve an address to a primary domain and all owned domains. Requires `address` and `chain` as query parameters._

---

## Recent Minted Domains

- **`recentMintedDomains`**  
  `GET /api/recent-minted-domains?mainnetOnly=true|false`  
  \_Get recently minted domains.  
  Optional query parameter `mainnetOnly` (boolean):
  - If `true`, returns only domains minted on mainnet chains.
  - If `false` or omitted, returns domains from all chains.\_

---

## Sync

- **`syncReferral`**  
  `POST /api/sync/referral`  
  _Sync referral data. Requires chainId in the request (detected from request context)._

- **`syncDomains`**  
  `POST /api/sync/domains`  
  _Sync domains data. Requires chainId in the request (detected from request context)._

---

## Domain

- **`findDomain`**  
  `GET /api/domain?domainName=example.zns&chainId=1`  
  _Find an existing domain by name and chain ID. Returns 404 if domain not found. Read-only operation with no side effects._

- **`getDomain`**  
  `POST /api/domain`  
  _Get or create a domain. If domain exists, returns it; if not, creates a new domain entry. Requires `domain` object with `domainName` and `chainId`, and `dId` number in request body._

---

## Domain Category

- **`fetchDomainCategories`**  
  `GET /api/domain/category`  
  _Fetch all domain categories_

- **`updateDomainCategories`**  
  `POST /api/domain/category`  
  _Create or update domain categories_

---

## Domain Create

- **`createDomainWithoutAuth`**  
  `POST /api/domain/create`  
  _Creates multiple domains from an array of domain objects_

---

## Domain Followers

- **`fetchFollowersByDomain`**  
  `POST /api/domain/followers`  
  _Fetch followers for multiple domains by providing `domainIds` array_

- **`fetchFollowByDomainId`**  
  `GET /api/domain/followers?domainId=...`  
  _Fetch follow data for a specific domain_

---

## Domain Follow

- **`followDomainWithAddress`**  
  `POST /api/domain/follow`  
  _Follow domain_

---

## Domain Fetch

- **`fetchDomain`**  
  `POST /api/domain/fetch`

---

## Domain Sync

- **`syncOnchainDomainId`**  
  `POST /api/domain/sync`

---

## Domain Update Profile

- **`updateDomainProfile`**  
  `POST /api/domain/update`

---

## Domain Verify Account

- **`verifyAccount`**  
  `POST /api/domain/verify-account`

---

## Domain Delete Verified Account

- **`deleteVerifedAccount`**  
  `POST /api/domain/delete-verified-account`

---

## Domain Burn

- **`burnDomainWithAddress`**  
  `POST /api/domain/burn`

---

## Domain Avatar Upload

- **Upload Avatar**  
  `POST /api/upload/photo`  
  _Body: `photo`, `userId`, `type: avatar`_

---

## Domain Banner Upload

- **Upload Banner**  
  `POST /api/upload/photo`  
  _Body: `photo`, `userId`, `type: banner`_

---

## Referral

- **`getReferrals`**  
  `GET /api/referral?chain=123&address=0x...`  
  _Get referrals by chain ID and optional address_

- **`updateRefer`**  
  `POST /api/referral`  
  _Update referral information, requires `refer` and `chainId` in the request body_

---

## User

- **`getOrCreateUserIdByAddress`**  
  `POST /api/user/id`  
  _Get or create user ID by wallet address_

- **`findUserByAddress`**  
  `GET /api/user/lookup?address=0x...`  
  _Find user by wallet address_

- **`getUser`**  
  `POST /api/user`  
  _Create or get a user by wallet address_

---

## User Badge

- **`claimBadgeById`**  
  `POST /api/user/badge`  
  _Claim a badge for a user by providing `userId`_

---

## HIP

- **`GET /api/hip`**
- **`PUT /api/hip`**
- **`getHIPByAddress`**  
  `GET /api/hip/address?address=0xYourWalletAddress`

- **`mintHIP`**  
  `POST /api/hip/mint`

- **`updateHIPReferral`**  
  `PUT /api/hip/referral`

- **`updateHIPProfile`**  
  `PUT /api/hip/profile`

- **`updateHIPImage`**  
  `POST /api/upload/photo`  
  _Body: `photo`, `userId`, `type: hip`_

---

## OTP (One-Time Password)

- **`sendOTPUnauthenticated`**  
  `POST /api/otp/send`  
  _Send OTP to email. Requires `email` in the request body._

- **`verifyOTPUnauthenticated`**  
  `POST /api/otp/verify`  
  _Verify OTP for email. Requires `email`, `otp`, and `userId` in the request body._
