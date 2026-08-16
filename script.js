document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SET DEFAULT DATES FOR BOOKING BAR ---
    const checkinInput = document.getElementById('booking-checkin');
    const checkoutInput = document.getElementById('booking-checkout');

    if (checkinInput && checkoutInput) {
        const today = new Date();
        
        const formatDate = (date) => {
            const d = new Date(date);
            let month = '' + (d.getMonth() + 1);
            let day = '' + d.getDate();
            const year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        };

        const checkinDate = new Date(today);
        checkinDate.setDate(today.getDate() + 1);

        const checkoutDate = new Date(today);
        checkoutDate.setDate(today.getDate() + 3);

        checkinInput.value = formatDate(checkinDate);
        checkoutInput.value = formatDate(checkoutDate);

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

    // --- 2. BOOKING LOGIC & ADMIN SYNC ---
    const handleBookingProcess = (selectedRoomType = null) => {
        const checkin = checkinInput ? checkinInput.value : '2026-06-01';
        const checkout = checkoutInput ? checkoutInput.value : '2026-06-03';
        const roomTypeSelect = document.getElementById('booking-room-select');
        const roomType = selectedRoomType || (roomTypeSelect ? roomTypeSelect.value : 'Executive Suite');
        
        const guestName = prompt(`You are booking a ${roomType} at Udy Hotel & Suites.\n\nPlease enter your Full Name:`, "");
        
        if (!guestName || guestName.trim() === "") return;

        const newBookingID = 'UDY-' + Math.floor(1000 + Math.random() * 9000);
        const bookingRecord = {
            id: newBookingID,
            name: guestName.trim(),
            room: roomType,
            checkin: checkin,
            checkout: checkout,
            status: 'confirmed'
        };

        // Save to browser LocalStorage so admin dashboard updates instantly
        let existingBookings = JSON.parse(localStorage.getItem('udy_bookings')) || [];
        existingBookings.unshift(bookingRecord);
        localStorage.setItem('udy_bookings', JSON.stringify(existingBookings));

        alert(`Reservation Successful! 🎉\n\nThank you, ${guestName.trim()}.\nBooking ID: ${newBookingID}\nRoom: ${roomType}\nCheck-in: ${checkin}\nCheck-out: ${checkout}\n\nThis booking has been logged to your Admin Portal.`);
    };

    // Trigger from main search button
    const searchBtn = document.querySelector('.search-availability-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleBookingProcess();
        });
    }

    // Trigger from individual room cards
    document.querySelectorAll('.quick-book-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const roomName = btn.getAttribute('data-room');
            handleBookingProcess(roomName);
        });
    });

    // --- 3. NAVBAR SCROLL EFFECT ---
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(18, 18, 18, 0.95)';
            header.style.padding = '5px 0';
        } else {
            header.style.background = 'rgba(18, 18, 18, 0.9)';
            header.style.padding = '0';
        }
    });

    // --- 4. SMOOTH SCROLLING ---
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
