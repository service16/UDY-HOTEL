document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SET DEFAULT DATES FOR BOOKING BAR ---
    const checkinInput = document.querySelector('input[type="date"]:nth-of-type(1)') || document.querySelectorAll('.booking-bar input[type="date"]')[0];
    const checkoutInput = document.querySelector('input[type="date"]:nth-of-type(2)') || document.querySelectorAll('.booking-bar input[type="date"]')[1];

    if (checkinInput && checkoutInput) {
        const today = new Date();
        
        // Format date to YYYY-MM-DD
        const formatDate = (date) => {
            const d = new Date(date);
            let month = '' + (d.getMonth() + 1);
            let day = '' + d.getDate();
            const year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        };

        // Check-in default: Today or tomorrow
        const checkinDate = new Date(today);
        checkinDate.setDate(today.getDate() + 1); // Tomorrow

        // Check-out default: 3 days from today
        const checkoutDate = new Date(today);
        checkoutDate.setDate(today.getDate() + 3);

        checkinInput.value = formatDate(checkinDate);
        checkoutInput.value = formatDate(checkoutDate);

        // Prevent selecting check-out dates before check-in
        checkinInput.addEventListener('change', (e) => {
            const selectedCheckin = new Date(e.target.value);
            const currentCheckout = new Date(checkoutInput.value);

            if (selectedCheckin >= currentCheckout) {
                const newCheckout = new Date(selectedCheckin);
                newCheckout.setDate(selectedCheckin.getDate() + 2);
                checkoutInput.value = formatDate(newCheckout);
            }
            checkoutInput.min = e.target.value;
        });
    }

    // --- 2. SEARCH AVAILABILITY BUTTON INTERACTION ---
    const searchBtn = document.querySelector('.search-availability-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const checkin = checkinInput ? checkinInput.value : 'Selected Date';
            const checkout = checkoutInput ? checkoutInput.value : 'Selected Date';
            
            // Trigger feedback action
            console.log(`Checking availability from ${checkin} to ${checkout}...`);
            
            // Smooth user confirmation feedback
            const originalText = searchBtn.textContent;
            searchBtn.textContent = 'Searching...';
            searchBtn.style.backgroundColor = 'var(--accent-gold)';
            searchBtn.style.color = 'var(--primary-dark)';

            setTimeout(() => {
                searchBtn.textContent = originalText;
                searchBtn.style.backgroundColor = '';
                searchBtn.style.color = '';
                alert(`Availability confirmed! Rooms are ready for your stay from ${checkin} to ${checkout}. Proceeding to reservation details...`);
            }, 600);
        });
    }

    // --- 3. NAVBAR SCROLL EFFECT ---
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(18, 18, 18, 0.95)';
            header.style.padding = '5px 0';
        } else {
            header.style.background = 'rgba(18, 18, 18, 0.85)';
            header.style.padding = '0';
        }
    });

    // --- 4. SMOOTH SCROLLING FOR INTERNAL ANCHOR LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});
