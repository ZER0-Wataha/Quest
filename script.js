// ========== ANIMATED COUNTER ==========
function animateCounter(element, target, duration = 2000, isDecimal = false) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = isDecimal ? target.toFixed(1) : Math.floor(target);
            clearInterval(timer);
        } else {
            element.textContent = isDecimal ? start.toFixed(1) : Math.floor(start);
        }
    }, 16);
}

// Animate stat counters when visible
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseFloat(entry.target.getAttribute('data-count'));
            const isDecimal = target % 1 !== 0;
            animateCounter(entry.target, target, 2000, isDecimal);
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => {
    statObserver.observe(el);
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

// ========== TICKER ANIMATION ==========
const ticker = document.querySelector('.ticker');
if (ticker) {
    // Duplicate ticker items for seamless loop
    const tickerContent = ticker.innerHTML;
    ticker.innerHTML = tickerContent + tickerContent;
}

// Update ticker prices randomly
function updateTickerPrices() {
    document.querySelectorAll('.ticker-price').forEach(priceEl => {
        const currentPrice = parseFloat(priceEl.textContent.replace('$', '').replace(',', ''));
        const change = (Math.random() - 0.5) * currentPrice * 0.01;
        const newPrice = currentPrice + change;

        const crypto = priceEl.getAttribute('data-crypto');
        if (crypto) {
            priceEl.textContent = '$' + newPrice.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
    });
}

setInterval(updateTickerPrices, 3000);

// ========== MINI CHARTS ==========
function drawMiniChart(elementId) {
    const container = document.getElementById(elementId);
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const points = 20;
    const data = Array.from({ length: points }, () => Math.random());

    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((value, i) => {
        const x = (canvas.width / (points - 1)) * i;
        const y = canvas.height - (value * canvas.height * 0.8) - canvas.height * 0.1;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.stroke();

    // Fill area under line
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 215, 0, 0.1)';
    ctx.fill();
}

drawMiniChart('miniChart1');
drawMiniChart('miniChart2');

// ========== PROGRESS RING ==========
const progressRing = document.querySelector('.progress-ring-fill');
if (progressRing) {
    const percent = parseFloat(progressRing.getAttribute('data-percent'));
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (percent / 100) * circumference;

    setTimeout(() => {
        progressRing.style.strokeDashoffset = offset;
    }, 500);
}

// ========== FADE-IN ANIMATIONS ==========
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '-50px' });

document.querySelectorAll('.signal-card, .portfolio-card, .feature-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(el);
});

// ========== CONSOLE BRANDING ==========
console.log('%c Zer0_Code Trading ', 'background: linear-gradient(135deg, #ffd700, #cc9c00); color: #000; font-size: 20px; padding: 10px; font-weight: bold;');
console.log('%c Professional Trading Platform 📈', 'color: #ffd700; font-size: 14px;');
console.log('%c Markets are open. Trade responsibly. ', 'color: #8892a6; font-size: 12px;');
