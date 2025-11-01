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

// ========== MARKET DATA SIMULATOR ==========
// Realistic base prices (as of 2025)
const marketData = {
    XAUUSD: { base: 2045.00, volatility: 0.003, decimals: 2, prefix: '$' },
    EURUSD: { base: 1.0876, volatility: 0.0008, decimals: 4, prefix: '' },
    GBPUSD: { base: 1.2734, volatility: 0.001, decimals: 4, prefix: '' },
    BTCUSD: { base: 45234.00, volatility: 0.015, decimals: 2, prefix: '$' },
    US30: { base: 38945.00, volatility: 0.005, decimals: 2, prefix: '' }
};

// Initialize prices with realistic values
function initializeMarketPrices() {
    document.querySelectorAll('.ticker-item').forEach(item => {
        const symbol = item.querySelector('.ticker-symbol').textContent.replace('/', '');
        const priceEl = item.querySelector('.ticker-price');
        const changeEl = item.querySelector('.ticker-change');

        if (marketData[symbol]) {
            const data = marketData[symbol];
            const price = data.base;
            priceEl.textContent = data.prefix + price.toLocaleString('en-US', {
                minimumFractionDigits: data.decimals,
                maximumFractionDigits: data.decimals
            });
        }
    });
}

// Simulate realistic price movements
function updateMarketPrices() {
    document.querySelectorAll('.ticker-item').forEach(item => {
        const symbol = item.querySelector('.ticker-symbol').textContent.replace('/', '');
        const priceEl = item.querySelector('.ticker-price');
        const changeEl = item.querySelector('.ticker-change');

        if (marketData[symbol]) {
            const data = marketData[symbol];

            // Natural price movement (Brownian motion simulation)
            const randomWalk = (Math.random() - 0.5) * 2;
            const meanReversion = (data.base - parseFloat(priceEl.textContent.replace(/[$,]/g, ''))) * 0.01;
            const change = (randomWalk * data.volatility + meanReversion) * data.base;

            let currentPrice = parseFloat(priceEl.textContent.replace(/[$,]/g, ''));
            let newPrice = currentPrice + change;

            // Update price
            priceEl.textContent = data.prefix + newPrice.toLocaleString('en-US', {
                minimumFractionDigits: data.decimals,
                maximumFractionDigits: data.decimals
            });

            // Calculate 24h change percentage
            const changePercent = ((newPrice - data.base) / data.base) * 100;
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

    // Initialize with realistic prices
    initializeMarketPrices();

    // Update prices every 3 seconds
    setInterval(updateMarketPrices, 3000);
}

// ========== OPTIONAL: REAL API INTEGRATION ==========
// Uncomment and add your API key to use real data
/*
async function fetchRealMarketData() {
    try {
        // Example: Alpha Vantage API (free tier available)
        // const apiKey = 'YOUR_API_KEY_HERE';
        // const response = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=EUR&to_currency=USD&apikey=${apiKey}`);
        // const data = await response.json();

        // Or use ExchangeRate-API (no key needed for basic usage)
        // const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        // const data = await response.json();

        // Update marketData with real values
        // marketData.EURUSD.base = data.rates.EUR;

    } catch (error) {
        console.log('Using simulated data:', error);
    }
}
// fetchRealMarketData();
// setInterval(fetchRealMarketData, 60000); // Update every minute
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
