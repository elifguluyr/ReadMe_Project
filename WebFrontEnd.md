# Web Frontend Görev Dağılımı

**Web Frontend Adresi:** [frontend.ReadMe.com](https://read-me-gamma.vercel.app)

Bu dokümanda, web uygulamasının kullanıcı arayüzü (UI) ve kullanıcı deneyimi (UX) görevleri listelenmektedir. Her grup üyesi, kendisine atanan sayfaların tasarımı, implementasyonu ve kullanıcı etkileşimlerinden sorumludur.

---

## Grup Üyelerinin Web Frontend Görevleri

1. [Efsa Nur Bölükbaş Web Frontend Görevleri](Efsa-Nur-Bolukbas/Efsa-Nur-Bolukbas-Web-Frontend-Gorevleri.md)
2. [Verda Er Web Frontend Görevleri](Verda-Er/Verda-Er-Web-Frontend-Gorevleri.md)
3. [Elif Gül Uyar Web Frontend Görevleri](Elif-Gül-Uyar/Elif-Gül-Uyar-Web-Frontend-Görevleri.md)


---

## Genel Web Frontend Prensipleri

### 1. Responsive Tasarım
- **Mobile-First Approach:** Önce mobil tasarım, sonra desktop (Tailwind CSS ile)
- **Breakpoints:** 
  - Mobile: < 768px (sm)
  - Tablet: 768px - 1024px (md)
  - Desktop: > 1024px (lg, xl)
- **Flexible Layouts:** Tailwind CSS Flexbox ve Grid kullanımı
- **Responsive Images:** Next.js Image component veya srcset (gelecekte)
- **Touch-Friendly:** Minimum 44x44px touch targets, kitap kartları ve butonlar için

### 2. Tasarım Sistemi
- **CSS Framework:** Tailwind CSS 
- **Renk Paleti:** Tailwind varsayılan paleti, kitap temalı renkler (mavi tonları)
- **Tipografi:** Tailwind font ailesi, Google Fonts entegrasyonu
- **Spacing:** Tailwind spacing scale (4px grid sistemi)
- **Iconography:** Heroicons veya Lucide React icons
- **Component Library:** Reusable React components (BookCard, RatingSystem, Modal'lar)

### 3. Performans Optimizasyonu
- **Code Splitting:** Vite ile route-based ve component-based splitting
- **Lazy Loading:** React.lazy ile components ve routes
- **Minification:** Vite build ile otomatik minification
- **Compression:** Vercel/Netlify hosting ile Gzip/Brotli
- **Caching:** Browser caching, service worker (PWA için gelecekte)
- **Bundle Size:** Tree shaking, unused CSS elimination (Tailwind Purge)

### 4. SEO (Search Engine Optimization)
- **Meta Tags:** React Helmet ile dinamik title, description
- **Structured Data:** Kitap şemaları için JSON-LD (gelecekte)
- **Semantic HTML:** React semantic elements (main, article, section)
- **Alt Text:** Kitap kapakları için alt attributes
- **Sitemap:** Dinamik sitemap generation (kitap sayfaları için)
- **Robots.txt:** Search engine crawling kuralları

### 5. Erişilebilirlik (Accessibility)
- **WCAG 2.1 AA Compliance:** Minimum accessibility standard
- **Keyboard Navigation:** Tab order, focus management (React focus hooks)
- **Screen Reader Support:** ARIA labels, roles (rating sisteminde)
- **Color Contrast:** Tailwind renklerinde minimum 4.5:1 ratio
- **Focus Indicators:** Visible focus states (Tailwind focus classes)
- **Skip Links:** Ana içeriğe atlama linki

### 6. Browser Compatibility
- **Modern Browsers:** Chrome, Firefox, Safari, Edge 
- **Polyfills:** React ve Vite ile ES6+ native support
- **CSS Prefixes:** Autoprefixer (Tailwind içinde)
- **Feature Detection:** Native feature detection
- **Graceful Degradation:** Eski tarayıcılar için fallback (progressive enhancement)

### 7. State Management
- **Global State:** React Context API (AuthContext için)
- **Local State:** useState, useReducer hooks
- **Server State:** Axios ile manuel, React Query (gelecekte)
- **Form State:** Controlled components, validation hooks

### 8. Routing
- **Client-Side Routing:** React Router DOM 
- **Deep Linking:** URL-based navigation (/books, /profile, /social)
- **Protected Routes:** Authentication guards (AuthContext ile)
- **404 Handling:** Custom 404 page
- **History Management:** React Router history API

### 9. API Entegrasyonu
- **HTTP Client:** Axios 
- **Request Interceptors:** JWT token injection (AuthContext'ten)
- **Response Interceptors:** Error handling, token refresh
- **Error Handling:** Centralized error handling (Toast notifications)
- **Loading States:** Global loading indicator (skeleton loaders)

### 10. Testing
- **Unit Tests:** Jest, Vitest (henüz implement edilmedi)
- **Integration Tests:** React Testing Library (gelecekte)
- **E2E Tests:** Playwright (demo için)
- **Visual Regression:** Chromatic (gelecekte)
- **Accessibility Tests:** axe-core, Lighthouse CI

### 11. Build ve Deployment
- **Build Tool:** Vite 
- **Module Bundler:** ES modules
- **Environment Variables:** .env files (VITE_ prefix)
- **CI/CD:** Vercel deployment (vercel.json)
- **Hosting:** Vercel, Netlify