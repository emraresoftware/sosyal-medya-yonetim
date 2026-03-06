# Sosyal Medya Yönetim Aracı — Tasarım Rehberi (Design System)

> Otomatik oluşturuldu: emarework Dervishi — Çeyiz Sistemi
> Ana Renk: `#8b5cf6`
> Tarih: 06 March 2026

---

## 1. RENK PALETİ (Brand Colors)

| Token | HEX | Kullanım |
|-------|-----|----------|
| `brand-50` | `#f6f4fa` | Çok açık arka plan, hover bg |
| `brand-100` | `#ede8f6` | Açık arka plan |
| `brand-200` | `#d3c6f0` | Border (secondary buton) |
| `brand-300` | `#aa8dec` | İkon accent |
| `brand-400` | `#7f50ec` | Hover accent |
| `brand-500` | `#530df1` | **Ana marka rengi (Primary)** |
| `brand-600` | `#450bca` | Hover/active primary |
| `brand-700` | `#3605a8` | Koyu primary |
| `brand-800` | `#2a0380` | Koyu bg accent |
| `brand-900` | `#1d0456` | Çok koyu bg |
| `brand-950` | `#11032f` | En koyu bg (hero, footer) |

---

## 2. GRİ TONLARI

| Token | Kullanım |
|-------|----------|
| `white` | Sayfa arka planı, kart arka planı |
| `gray-100` | Border, divider |
| `gray-300` | Footer body text |
| `gray-500` | Kart açıklamaları |
| `gray-600` | Body paragraph text |
| `gray-800` | Varsayılan metin |
| `gray-900` | Başlıklar |
| `gray-950` | Footer arka plan |

---

## 3. EK RENKLER

| Renk | HEX | Kullanım |
|------|-----|----------|
| Success | `#22c55e` | Başarı, onay |
| Warning | `#f59e0b` | Uyarı |
| Error | `#ef4444` | Hata |
| Info | `#3b82f6` | Bilgi |

---

## 4. GRADYANLAR

### Primary Buton
```css
background: linear-gradient(to right, #530df1, #3605a8);
```

### Gradient Text
```css
background: linear-gradient(135deg, #450bca, #7f50ec);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

### Hero Koyu Arka Plan
```css
background: linear-gradient(-45deg, #11032f, #1d0456, #2a0380);
```

---

## 5. TİPOGRAFİ

| Element | Font | Size | Weight |
|---------|------|------|--------|
| H1 | Inter | 3rem (48px) | 800 (ExtraBold) |
| H2 | Inter | 2.25rem (36px) | 700 (Bold) |
| H3 | Inter | 1.5rem (24px) | 600 (SemiBold) |
| Body | Inter | 1rem (16px) | 400 (Regular) |
| Small | Inter | 0.875rem (14px) | 400 |
| Button | Inter | 0.875rem (14px) | 600 |

---

## 6. SPACING

| Token | Değer | Kullanım |
|-------|-------|----------|
| xs | 4px | İkon-metin arası |
| sm | 8px | Küçük aralık |
| md | 16px | Kart padding |
| lg | 24px | Bölüm arası |
| xl | 48px | Büyük bölüm arası |
| 2xl | 96px | Hero section padding |

---

## 7. TAILWIND CONFIG

```javascript
tailwind.config = {
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        brand: {
          50: '#f6f4fa',
          100: '#ede8f6',
          200: '#d3c6f0',
          300: '#aa8dec',
          400: '#7f50ec',
          500: '#530df1',
          600: '#450bca',
          700: '#3605a8',
          800: '#2a0380',
          900: '#1d0456',
          950: '#11032f',
        }
      }
    }
  }
}
```

---

*Otomatik oluşturuldu — emarework Dervishi Çeyiz Sistemi*
