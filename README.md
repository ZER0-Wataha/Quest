# Zer0_Code Trading Platform 📈

Profesjonalna, elegancka strona landing page dla platformy tradingowej Zer0_Code.

## ✨ Funkcje

- **Ciemny, elegancki design** - profesjonalny motyw tradingowy
- **Live Market Ticker** - animowany pasek z cenami kryptowalut i akcji
- **Interaktywne wykresy świecowe** - Canvas API z animowanymi candlestick charts
- **Trading Signals** - karty sygnałów BUY/SELL/HOLD z wskaźnikami
- **Portfolio Dashboard** - statystyki z animowanymi licznikami
- **Mini wykresy** - sparklines dla metryk portfolio
- **Progress Ring** - animowany SVG dla win rate
- **Responsywny design** - działa na wszystkich urządzeniach
- **Animowane liczniki** - count-up effect dla statystyk
- **Złote akcenty** - elegancka kolorystyka bull/bear market

## 🚀 Jak uruchomić lokalnie

Wystarczy otworzyć plik `index.html` w przeglądarce!

```bash
# W terminalu:
open index.html
# lub po prostu kliknij dwukrotnie na plik
```

## 🌐 Darmowy hosting

### GitHub Pages (Zalecane - całkowicie za darmo!)

1. Upewnij się, że twoje repozytorium jest publiczne
2. Przejdź do Settings → Pages
3. W sekcji "Source" wybierz branch (np. `main` lub `claude/setup-zer0-code-site-011CUhsjPNFp2rdfg8TuF2q4`)
4. Kliknij Save
5. Twoja strona będzie dostępna pod adresem: `https://zer0-wataha.github.io/Quest/`

### Netlify

1. Zaloguj się na [netlify.com](https://netlify.com)
2. Kliknij "Add new site" → "Import an existing project"
3. Wybierz GitHub i połącz repozytorium
4. Deploy! Dostaniesz darmową subdomenę typu `nazwa.netlify.app`
5. Możesz dodać własną domenę w ustawieniach

### Vercel

1. Zaloguj się na [vercel.com](https://vercel.com)
2. Kliknij "Add New Project"
3. Import z GitHub
4. Deploy! Dostaniesz subdomenę `nazwa.vercel.app`

## 🌍 Darmowe domeny

Jeśli chcesz własną domenę (zamiast subdomeny):

### Całkowicie darmowe:

- **Freenom** - domeny .tk, .ml, .ga, .cf, .gq (za darmo na rok)
- **InfinityFree** - domena z subdomeną .rf.gd, .epizy.com
- **eu.org** - darmowa subdomena .eu.org

### Tanie opcje (10-15 zł/rok):

- **Namecheap** - domeny .xyz, .online
- **OVH** - domeny .pl około 20 zł/rok
- **Cloudflare** - domeny po cenie hurtowej

## 📁 Struktura projektu

```
Quest/
├── index.html      # Główny plik HTML
├── style.css       # Style CSS
├── script.js       # JavaScript z animacjami
└── README.md       # Ten plik
```

## 🎨 Personalizacja

### Kolory
Edytuj zmienne CSS w `style.css`:
```css
:root {
    --bull-green: #00ff88;    /* Kolor wzrostów */
    --bear-red: #ff4757;      /* Kolor spadków */
    --gold: #ffd700;          /* Akcent złoty */
    --gold-dark: #cc9c00;     /* Ciemniejszy złoty */
    --dark-bg: #0a0e1a;       /* Tło ciemne */
    --darker-bg: #050812;     /* Tło najciemniejsze */
}
```

### Treść
Edytuj plik `index.html` aby zmienić:
- Ceny i symbole w tickerze
- Trading signals (BUY/SELL/HOLD)
- Statystyki portfolio
- Wskaźniki techniczne (RSI, MACD)
- Informacje kontaktowe

### Wykresy
W `script.js` możesz dostosować:
- Liczbę świec na wykresie (domyślnie 30)
- Zakres cen
- Częstotliwość odświeżania (domyślnie co 5s)
- Kolory wykresów

## 📱 Responsywność

Strona automatycznie dostosowuje się do:
- Komputerów (desktop)
- Tabletów
- Telefonów komórkowych

## 🛠️ Technologie

- **HTML5** - semantyczna struktura
- **CSS3** - Flexbox, Grid, animacje, transitions
- **Canvas API** - interaktywne wykresy świecowe
- **Vanilla JavaScript (ES6+)** - bez zależności
- **Intersection Observer API** - optymalizowane animacje
- **SVG** - skalowalna grafika wektorowa (progress ring)
- **Bez frameworków** - ultra szybka i lekka!

## 📊 Główne komponenty

### 1. Market Ticker
- Nieskończona animacja scroll
- Live update cen co 3 sekundy
- Wskaźniki ▲/▼ dla zmian

### 2. Candlestick Chart
- Rysowany w czasie rzeczywistym
- 30 świec z losowymi danymi OHLC
- Volume bars na dole
- Auto-refresh co 5 sekund
- Responsywny (reaguje na resize)

### 3. Trading Signals
- Bull (zielone), Bear (czerwone), Neutral (szare)
- Wskaźniki RSI i MACD
- Hover effects z złotymi akcentami

### 4. Portfolio Dashboard
- Animowane liczniki (count-up)
- Mini sparkline charts
- SVG progress ring z animacją
- Real-time statystyki

## ⚡ Performance

- Zero external dependencies
- Lazy loading animations (Intersection Observer)
- Optimized canvas rendering
- CSS transforms dla smooth animations
- Minimalny JavaScript footprint

## 📝 Licencja

MIT License - możesz używać i modyfikować jak chcesz!

## 🤝 Kontakt

- GitHub: [@ZER0-Wataha](https://github.com/ZER0-Wataha)
- Email: trading@zer0code.dev

## ⚠️ Disclaimer

Ten projekt to demonstracyjna strona landing page. Nie jest to prawdziwa platforma tradingowa.
Trading wiąże się z ryzykiem - zawsze inwestuj odpowiedzialnie.

---

**Made with 📈 and code by Zer0_Code**

*Professional Trading Platform for Modern Investors* 💎
