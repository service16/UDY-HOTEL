// Filter rooms and apartments dynamically based on user selection
function filterCategory(category) {
    const cards = document.querySelectorAll('.card');
    const buttons = document.querySelectorAll('.filter-btn');

    // Update active state on filter buttons
    buttons.forEach(btn => {
        if(btn.textContent.toLowerCase().includes(category) || (category === 'all' && btn.textContent.includes('All'))) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Show or hide cards based on selected category
    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Handle booking alerts
function openBooking(roomName) {
    alert(`Thank you for choosing Udy Hotel & Suites! You have selected the ${roomName}. You will now be redirected to secure your reservation.`);
}
