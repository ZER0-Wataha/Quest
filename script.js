// ========== SMOOTH SCROLLING ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== CANDLESTICK CHART ==========
const canvas = document.getElementById('mainChart');
if (canvas) {
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawChart();
    }

    function generateCandlestick() {
        const open = 42000 + Math.random() * 8000;
        const close = open + (Math.random() - 0.5) * 4000;
        const high = Math.max(open, close) + Math.random() * 1000;
        const low = Math.min(open, close) - Math.random() * 1000;
        return { open, high, low, close };
    }

    function drawChart() {
        if (!ctx || canvas.width === 0) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const candles = Array.from({ length: 30 }, generateCandlestick);
        const candleWidth = canvas.width / candles.length - 2;
        const padding = 20;

        const allPrices = candles.flatMap(c => [c.high, c.low]);
        const maxPrice = Math.max(...allPrices);
        const minPrice = Math.min(...allPrices);
        const priceRange = maxPrice - minPrice;

        // Grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            const y = padding + (canvas.height - 2 * padding) * i / 4;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Draw candlesticks
        candles.forEach((candle, i) => {
            const x = i * (candleWidth + 2) + candleWidth / 2;
            const yHigh = padding + ((maxPrice - candle.high) / priceRange) * (canvas.height - 2 * padding);
            const yLow = padding + ((maxPrice - candle.low) / priceRange) * (canvas.height - 2 * padding);
            const yOpen = padding + ((maxPrice - candle.open) / priceRange) * (canvas.height - 2 * padding);
            const yClose = padding + ((maxPrice - candle.close) / priceRange) * (canvas.height - 2 * padding);

            const isBullish = candle.close > candle.open;
            ctx.strokeStyle = isBullish ? '#00ff88' : '#ff4757';
            ctx.fillStyle = isBullish ? '#00ff88' : '#ff4757';

            // Wick
            ctx.beginPath();
            ctx.moveTo(x, yHigh);
            ctx.lineTo(x, yLow);
            ctx.lineWidth = 1;
            ctx.stroke();

            // Body
            const bodyTop = Math.min(yOpen, yClose);
            const bodyHeight = Math.abs(yClose - yOpen);
            ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight || 1);
        });

        // Volume bars at bottom
        ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
        candles.forEach((_, i) => {
            const x = i * (candleWidth + 2);
            const volumeHeight = 20 + Math.random() * 30;
            ctx.fillRect(x, canvas.height - volumeHeight, candleWidth, volumeHeight);
        });
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Redraw chart every 5 seconds
    setInterval(drawChart, 5000);
}

// ========== REAL MARKET DATA INTEGRATION ==========
const marketData = {
    XAUUSD: {
        current: 2045.00,
        previous: 2045.00,
        decimals: 2,
        prefix: '$',
        api: 'metals-api' // Gold price
    },
    EURUSD: {
        current: 1.0876,
        previous: 1.0876,
        decimals: 4,
        prefix: '',
        api: 'exchangerate' // Forex
    },
    GBPUSD: {
        current: 1.2734,
        previous: 1.2734,
        decimals: 4,
        prefix: '',
        api: 'exchangerate' // Forex
    },
    BTCUSD: {
        current: 45234.00,
        previous: 45234.00,
        decimals: 2,
        prefix: '$',
        api: 'coincap' // Crypto
    },
    US30: {
        current: 38945.00,
        previous: 38945.00,
        decimals: 2,
        prefix: '',
        api: 'yahoo' // Stock index (fallback to simulation)
    }
};

// Fetch real market data from multiple sources
async function fetchRealMarketData() {
    try {
        // 1. Fetch Forex rates (EUR, GBP) - FREE, NO API KEY
        const forexResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (forexResponse.ok) {
            const forexData = await forexResponse.json();
            if (forexData.rates) {
                // Convert to format we need (rates are inverted, we need USD/XXX not XXX/USD)
                marketData.EURUSD.current = 1 / forexData.rates.EUR;
                marketData.GBPUSD.current = 1 / forexData.rates.GBP;
                console.log('✓ Forex data updated:', { EUR: marketData.EURUSD.current, GBP: marketData.GBPUSD.current });
            }
        }
    } catch (error) {
        console.log('Forex API fallback to simulation:', error.message);
    }

    try {
        // 2. Fetch Bitcoin price - FREE, NO API KEY
        const btcResponse = await fetch('https://api.coincap.io/v2/assets/bitcoin');
        if (btcResponse.ok) {
            const btcData = await btcResponse.json();
            if (btcData.data && btcData.data.priceUsd) {
                marketData.BTCUSD.current = parseFloat(btcData.data.priceUsd);
                console.log('✓ Bitcoin data updated:', marketData.BTCUSD.current);
            }
        }
    } catch (error) {
        console.log('Bitcoin API fallback to simulation:', error.message);
    }

    try {
        // 3. Fetch Gold price - Using free gold API
        // Alternative: https://data-asg.goldprice.org/dbXRates/USD
        const goldResponse = await fetch('https://data-asg.goldprice.org/dbXRates/USD');
        if (goldResponse.ok) {
            const goldData = await goldResponse.json();
            if (goldData.items && goldData.items[0]) {
                // Gold price per ounce
                marketData.XAUUSD.current = parseFloat(goldData.items[0].xauPrice);
                console.log('✓ Gold data updated:', marketData.XAUUSD.current);
            }
        }
    } catch (error) {
        console.log('Gold API fallback to simulation:', error.message);
    }

    // 4. US30 (Dow Jones) - Would need paid API or web scraping
    // Using simulation for now. You can add Alpha Vantage or Finnhub with free API key

    // Update UI with new data
    updateMarketPrices(true);
}

// Initialize prices with current values
function initializeMarketPrices() {
    document.querySelectorAll('.ticker-item').forEach(item => {
        const symbol = item.querySelector('.ticker-symbol').textContent.replace('/', '');
        const priceEl = item.querySelector('.ticker-price');
        const changeEl = item.querySelector('.ticker-change');

        if (marketData[symbol]) {
            const data = marketData[symbol];
            priceEl.textContent = data.prefix + data.current.toLocaleString('en-US', {
                minimumFractionDigits: data.decimals,
                maximumFractionDigits: data.decimals
            });

            // Initial change is 0%
            changeEl.textContent = '+0.00%';
            changeEl.className = 'ticker-change positive';
        }
    });
}

// Update prices on screen
function updateMarketPrices(isRealData = false) {
    document.querySelectorAll('.ticker-item').forEach(item => {
        const symbol = item.querySelector('.ticker-symbol').textContent.replace('/', '');
        const priceEl = item.querySelector('.ticker-price');
        const changeEl = item.querySelector('.ticker-change');

        if (marketData[symbol]) {
            const data = marketData[symbol];

            // If not real data, simulate small movements
            if (!isRealData && symbol !== 'US30') {
                // Skip simulation for instruments with real API data
                return;
            }

            // For US30 and during simulation, add small random movement
            if (!isRealData || symbol === 'US30') {
                const volatility = symbol === 'BTCUSD' ? 0.015 :
                                 symbol === 'US30' ? 0.005 :
                                 symbol === 'XAUUSD' ? 0.003 : 0.0008;
                const randomWalk = (Math.random() - 0.5) * 2;
                const change = randomWalk * volatility * data.current;
                data.current = data.current + change;
            }

            // Update price display
            priceEl.textContent = data.prefix + data.current.toLocaleString('en-US', {
                minimumFractionDigits: data.decimals,
                maximumFractionDigits: data.decimals
            });

            // Calculate 24h change percentage
            const changePercent = ((data.current - data.previous) / data.previous) * 100;
            const changeText = (changePercent >= 0 ? '+' : '') + changePercent.toFixed(2) + '%';

            // Update change indicator
            changeEl.textContent = changeText;
            changeEl.className = 'ticker-change ' + (changePercent >= 0 ? 'positive' : 'negative');

            // Add flash animation on change
            priceEl.style.animation = 'flash 0.5s ease';
            setTimeout(() => {
                priceEl.style.animation = '';
            }, 500);
        }
    });
}

// ========== TICKER ANIMATION ==========
const ticker = document.querySelector('.ticker');
if (ticker) {
    // Duplicate ticker items for seamless loop
    const tickerContent = ticker.innerHTML;
    ticker.innerHTML = tickerContent + tickerContent;

    // Initialize with current prices
    initializeMarketPrices();

    // Fetch real data immediately on page load
    fetchRealMarketData();

    // Update real data every 30 seconds (to respect API rate limits)
    setInterval(fetchRealMarketData, 30000);

    // Add small visual updates every 3 seconds for smooth animation
    setInterval(() => updateMarketPrices(false), 3000);
}

// ========== OPTIONAL: ADD API KEYS FOR MORE DATA ==========
// For US30 (Dow Jones Index), you can add a free API key from:
// - Alpha Vantage: https://www.alphavantage.co/support/#api-key (free, 25 requests/day)
// - Finnhub: https://finnhub.io/register (free tier available)
//
// Example with Alpha Vantage:
/*
const ALPHA_VANTAGE_KEY = 'YOUR_FREE_API_KEY';

async function fetchUS30Data() {
    try {
        const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=DJI&apikey=${ALPHA_VANTAGE_KEY}`);
        const data = await response.json();
        if (data['Global Quote']) {
            marketData.US30.current = parseFloat(data['Global Quote']['05. price']);
            console.log('✓ US30 data updated:', marketData.US30.current);
        }
    } catch (error) {
        console.log('US30 API error:', error.message);
    }
}

// Add to fetchRealMarketData() or call separately
// fetchUS30Data();
*/


// ========== FADE-IN ANIMATIONS ==========
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '-50px' });

document.querySelectorAll('.product-card, .about-card, .step-card, .collab-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(el);
});

// ========== CONSOLE BRANDING ==========
console.log('%c ZER0 Wataha Trading ', 'background: linear-gradient(135deg, #ffd700, #cc9c00); color: #000; font-size: 20px; padding: 10px; font-weight: bold;');
console.log('%c Expert Advisors for MetaTrader 🤖', 'color: #ffd700; font-size: 14px;');
console.log('%c Trading involves risk. Past performance is not indicative of future results. ', 'color: #8892a6; font-size: 11px;');
