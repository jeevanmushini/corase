# Project Knowledge

## 1. Project Overview
CORASE is a modern, design-forward e-commerce web application focused on premium streetwear. It features a heavily animated, dark-mode aesthetic aimed at showcasing "limited-drop" clothing. The application emphasizes visual excellence, smooth user experience, and responsive design.

## 2. Folder Structure Explanation
- `corase/src/app/`: Contains the Next.js App Router endpoints, including routes for about, account, admin, checkout, login, register, and shop.
- `corase/src/components/`: Reusable UI components categorized by feature (`cart`, `home`, `layout`, `products`, `ui`).
- `corase/src/context/`: React context providers for managing global frontend state (`CartContext`, `WishlistContext`).
- `corase/src/data/`: Houses mock data and static constants (e.g., `products.ts`).
- `corase/src/lib/`: Core utilities and database connection logic (`mongoose.ts`, `auth.ts`, `utils.ts`).
- `corase/src/models/`: Mongoose schemas and database models (`Product.ts`, `User.ts`, `Order.ts`).
- `corase/public/`: Static public assets.

## 3. Tech Stack Details
- **Framework**: Next.js 16.2.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion (animations), Radix UI, and Shadcn UI components.
- **Database**: MongoDB (via Mongoose ORM)
- **Authentication**: NextAuth.js (Credentials and Google OAuth 2.0)
- **Payments**: Razorpay SDK (Standard Checkout)
- **Image Delivery**: Cloudinary (optimized for high-performance asset loading)
- **Linting & Formatting**: ESLint

## 4. Feature Breakdown
- **Landing Page (Home)**: High-impact animated hero section, trust badges, dynamic product rotation, categorized shopping, new arrivals, and testimonials.
- **Shop & Filtering**: Product discovery with filtering functionality for various streetwear categories (Oversized, Graphic, Acid Wash, etc.).
- **Product Management**: Detailed product viewing capabilities, including a quick-view modal system and "Buy It Now" direct checkout.
- **Cart & Wishlist**: Persistent global state management with MongoDB sync for authenticated users and `localStorage` fallback for guests.
- **Authentication**: Secure Login and Registration with bcrypt password hashing and social login support.
- **Checkout & Payments**: Integrated Razorpay checkout flow with backend order creation and cryptographic signature verification.
- **Admin Dashboard**: Comprehensive control center for managing inventory, viewing detailed stock analytics, tracking orders, and customizing site settings.
- **In-place Editing**: Live management of Hero sections and product details (including stock) directly on the storefront pages for admins.
- **Account Management**: User dashboard to manage profile, view order history, and manage saved wishlist items.

## 5. Important Files and Their Roles
- `src/app/layout.tsx`: The root layout defining global styles, typography (Inter, Syne fonts), and wrapping the app in necessary context providers.
- `src/lib/auth.ts`: Centralized NextAuth configuration, including providers and session/JWT callbacks.
- `src/lib/mongoose.ts`: Handles connecting to MongoDB with connection caching for serverless environments.
- `src/models/User.ts`: User schema storing profile data, hashed passwords, and embedded cart/wishlist references.
- `src/models/Order.ts`: Order schema tracking transaction status, payment IDs, and shipping addresses.
- `src/app/api/orders/`: Endpoints for initiating and verifying payments via Razorpay.

## 6. Data Flow
1. **Frontend**: React components trigger requests to API routes. User interactions update global state via React Context (Cart/Wishlist), which automatically syncs to the DB if the user is logged in.
2. **Authentication**: Handled via NextAuth.js. Sessions are persisted in JWTs and mapped to MongoDB User IDs.
3. **Payments**:
    - Frontend calls `/api/orders/create` to get a Razorpay order ID.
    - Razorpay widget handles payment and returns a signature.
    - Frontend calls `/api/orders/verify` to validate the signature against the server-side secret before confirming the order.
4. **Resilience Pattern**: Frontend components use loading states and error boundaries. Products fall back to a hardcoded data set if the database is unreachable during the initial fetch.

## 7. External Services / APIs used
- **MongoDB Atlas**: The primary database for user data, carts, wishlists, and orders.
- **Google Cloud Console**: OAuth 2.0 provider for social login.
- **Razorpay**: Payment gateway for processing INR/USD transactions.
- **Cloudinary**: High-performance image hosting and optimization.

## 8. Known Issues / Limitations
- **Email Notifications**: Automated order confirmation emails are not yet integrated.
- **Live Chat**: Customer support integration is pending.

---

## Future Improvements & Roadmap

### Performance: Optimistic UI Updates
- **Description**: Enhance the Cart and Wishlist contexts to use optimistic UI updates, ensuring the UI reacts instantly while backend operations resolve in the background.
- **Files affected**: `src/context/CartContext.tsx`, `src/context/WishlistContext.tsx`
- **Estimated complexity**: Medium

### Product Reviews & Ratings
- **Description**: Allow customers to leave reviews and rate products.
- **Estimated complexity**: Medium

---

## Premium Streetwear UI/UX Requirements
- **Aesthetic**: Dark, minimal, premium (monochrome with high-contrast text).
- **Typography**: Strong, bold headings (Syncopate font) with clean font hierarchy.
- **UX**: Smooth transitions, "Buy It Now" direct actions, and a focus on product visibility.

---

## Changelog

### 2026-04-24 — Full-Stack Integration & Payment Infrastructure
- **Auth**: Integrated **NextAuth.js** with Credentials and **Google OAuth**.
- **Database**: Established `User` and `Order` models.
- **Persistence**: Refactored `CartContext` and `WishlistContext` to sync with MongoDB in real-time for logged-in users.
- **Payments**: Integrated **Razorpay** SDK for secure checkout and payment verification.
- **Features**: Added **"Buy It Now"** functionality for direct checkout from product pages.
- **Bug Fixes**: Resolved naming inconsistencies (`productId` vs `id`), fixed Product Modal visibility (white-on-white bug), and restored broken Login/Register pages.
- **Architecture**: Centralized auth configuration in `src/lib/auth.ts` and moved database connection to named exports for better reliability.

### 2026-04-25 — Admin Infrastructure & UI Refinement
- **Admin Panel**: Developed a **premium Admin Dashboard** with real-time stock analytics, detailed order management, and inventory tracking.
- **In-place Editing**: Implemented **live content management** for Hero sections and product cards, allowing admins to edit title, price, and stock directly on the storefront.
- **Image Upload**: Integrated **Cloudinary file uploads**, enabling admins to upload product and hero images directly from their device.
- **Content Expansion**: Seeded the database with **18 premium products** across 5 categories to fill out the shop.
- **UI/UX Refinement**: 
    - Fixed **text visibility issues** by increasing contrast and opacity across the Navbar, Footer, and Shop pages.
    - Standardized **button and card designs** for a more cohesive brand feel.
    - Implemented **role-based access control (RBAC)** to protect admin routes and features.
- **Bug Fixes**: Resolved Next.js 15+ async params issues in admin APIs and fixed product field mapping (name -> title) for database updates.

### 2026-04-25 — Final Polish & End-to-End Reliability
- **Currency Standardization**: Replaced all `$` symbols with `₹` (Rupee) across the entire platform (Shop, Products, Cart, Checkout, Account, Admin) for regional consistency.
- **Navbar Logic**: Fixed a bug where the "DASHBOARD" link was visible to non-admins; it now strictly requires `role === 'admin'`.
- **Accessibility & Contrast**: 
    - Significantly improved readability in the **Quick View (Product Modal)** by increasing text opacity from `white/60` to `white/90` and `white`.
    - Enhanced **Cart Drawer** visibility by bumping price and label contrast.
    - Improved **Admin Dashboard** legibility for table headers and sidebar navigation.
- **Data Expansion**: 
    - Added 2 more premium products to the mock dataset, bringing the total to **20 unique items**.
    - Re-seeded the MongoDB database with the full 20-product list.
- **TypeScript Reliability**: 
    - Fixed naming collisions between `Product` types and state variables.
    - Resolved all remaining implicit `any` type errors in `ProductModal` and `seed` route.
    - Standardized `WishlistItem` and `CartItem` field mapping to consistently use `productId`.
- **Testing**: Conducted a comprehensive **end-to-end browser verification** of the user journey from landing page to cart/checkout and admin management.

### 2026-04-26 — Inventory Management & API Expansion
- **Inventory Overhaul**: Fully restored functionality to the **Inventory management page**, resolving issues with broken buttons and missing modals.
- **Admin Product Modal**: Developed a **dedicated management modal** for administrators to add and edit products, featuring image uploads, description editing, and dynamic variant (size/stock) management.
- **Safe Deletion**: Implemented a **premium custom confirmation modal** for product deletion, replacing native browser dialogs with a more secure and brand-consistent experience.
- **API Expansion**: 
    - Created a new `POST` endpoint for product creation in `/api/admin/products`.
    - Enhanced existing `PATCH` and `DELETE` endpoints to ensure robust mapping between frontend fields and Mongoose models.
- **Stability & Verification**: 
    - Resolved state management bugs where edited products weren't immediately reflected in the UI.
    - Conducted **rigorous browser testing** to verify the complete lifecycle of product management: creation -> editing -> deletion.
