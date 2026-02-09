document.addEventListener('DOMContentLoaded', () => {

    // --- Cost Calculator ---
    const areaInput = document.getElementById('area');
    const walkwayInput = document.getElementById('walkway');
    const boardingInput = document.getElementById('boarding');
    const totalPriceEl = document.getElementById('total-price');
    const hiddenPriceInput = document.getElementById('hidden-price');

    // Prices
    const PRICE_INSULATION = 350; // Kč/m2
    const PRICE_WALKWAY = 380;   // Kč/bm
    const PRICE_BOARDING = 580;  // Kč/m2

    function calculateTotal() {
        const area = parseFloat(areaInput.value) || 0;
        const walkway = parseFloat(walkwayInput.value) || 0;
        const boarding = parseFloat(boardingInput.value) || 0;

        const total = (area * PRICE_INSULATION) + (walkway * PRICE_WALKWAY) + (boarding * PRICE_BOARDING);

        // Format Result
        const formattedPrice = total.toLocaleString('cs-CZ') + ' Kč';

        totalPriceEl.textContent = formattedPrice;
        hiddenPriceInput.value = formattedPrice;
    }

    // Add listeners
    if (areaInput) {
        areaInput.addEventListener('input', calculateTotal);
        walkwayInput.addEventListener('input', calculateTotal);
        boardingInput.addEventListener('input', calculateTotal);
    }

    // --- Savings Estimator ---
    const heatingInput = document.getElementById('heating-cost');
    const heatingValueEl = document.getElementById('heating-value');
    const savingsAmountEl = document.getElementById('savings-amount');

    function calculateSavings() {
        const annualCost = parseInt(heatingInput.value);

        // Update display of current cost
        heatingValueEl.textContent = annualCost.toLocaleString('cs-CZ').replace(/\s/g, ' ');

        // Calculate Savings (using 30% as the upper optimistic bound for "Až")
        const savings = annualCost * 0.30;

        // Format Result
        savingsAmountEl.textContent = Math.round(savings).toLocaleString('cs-CZ') + ' Kč';
    }

    if (heatingInput) {
        heatingInput.addEventListener('input', calculateSavings);
        // Init
        calculateSavings();
    }

    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // --- Carousel Logic (3D Slider) ---
    const carouselTrack = document.getElementById('hero-carousel');
    const galleryGrid = document.querySelector('.gallery-grid');
    const imageCount = 12;
    const images = [];

    // Generate image paths
    for (let i = 1; i <= imageCount; i++) {
        images.push(`assets/realizace/${i}.webp`);
    }

    // Populate Hero Carousel (3D Slides)
    if (carouselTrack) {
        carouselTrack.innerHTML = ''; // Clear existing
        const slides = [];

        // Create slide elements
        images.forEach((src) => {
            const slide = document.createElement('div');
            slide.classList.add('carousel-slide');
            slide.style.backgroundImage = `url('${src}')`;
            carouselTrack.appendChild(slide);
            slides.push(slide);
        });

        let activeIndex = 0;

        function updateSlider() {
            // Reset all classes
            slides.forEach(slide => {
                slide.className = 'carousel-slide';
            });

            // Calculate indices with wrapping
            const getIndex = (offset) => {
                return (activeIndex + offset + slides.length) % slides.length;
            };

            // Set classes for visible items
            slides[activeIndex].classList.add('active');
            slides[getIndex(-1)].classList.add('prev');
            slides[getIndex(1)].classList.add('next');
            slides[getIndex(-2)].classList.add('prev-2');
            slides[getIndex(2)].classList.add('next-2');
        }

        // Init
        updateSlider();

        // Auto Cycle
        setInterval(() => {
            activeIndex = (activeIndex + 1) % slides.length;
            updateSlider();
        }, 2000); // Faster cycle for smoother flow feeling
    }

    // Populate Gallery Grid
    if (galleryGrid) {
        galleryGrid.innerHTML = ''; // Clear placeholders
        images.forEach(src => {
            const item = document.createElement('div');
            item.classList.add('gallery-item');

            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Realizace zateplení';
            img.loading = 'lazy';

            item.appendChild(img);
            galleryGrid.appendChild(item);
        });
    }

    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });


    // --- Form Submission to Make.com ---
    const priceForm = document.getElementById('price-form');

    if (priceForm) {
        priceForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const submitBtn = priceForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            // Loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Odesílám...';

            // Gather data
            const formData = new FormData(priceForm);
            const data = Object.fromEntries(formData.entries());

            // Add calculated savings explicitly if present
            const savingsEl = document.getElementById('savings-amount');
            if (savingsEl) {
                data.odhaduspor = savingsEl.textContent;
            }

            // --- Capture Facebook Cookies (CAPI) ---
            function getCookie(name) {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) return parts.pop().split(';').shift();
            }

            const fbp = getCookie('_fbp');
            const fbc = getCookie('_fbc');

            if (fbp) data.fbp = fbp;
            if (fbc) data.fbc = fbc;

            // Add source URL for debugging
            data.source_url = window.location.href;


            try {
                const response = await fetch('https://hook.eu2.make.com/bao49ye5kigc6elwii78nm2abawwkj4w', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    // Track Lead event for Facebook Pixel (Client-side)
                    if (typeof fbq === 'function') {
                        fbq('track', 'Lead');
                    }

                    // Success handling
                    alert('Poptávka byla úspěšně odeslána. Děkujeme, brzy se vám ozveme.');
                    priceForm.reset();
                    // Recalculate totals after reset
                    if (typeof calculateTotal === 'function') calculateTotal();
                } else {
                    throw new Error('Chyba serveru');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Omlouváme se, došlo k chybě při odesílání formuláře. Zkuste to prosím znovu nebo nám zavolejte.');
            } finally {
                // Restore button
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }

});


