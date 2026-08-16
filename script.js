// Handle the search form submission
function handleSearch() {
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const guests = document.getElementById('guests').value;
    const roomtype = document.getElementById('roomtype').value;

    if (!checkin || !checkout) {
        alert('Please select both check-in and check-out dates.');
        return;
    }

    alert(`Searching availability for ${guests} guest(s) from ${checkin} to ${checkout}!`);
    
    // Smoothly scroll down to the rooms section to show available listings
    document.getElementById('rooms').scrollIntoView({ behavior: 'smooth' });
}

// Handle individual room/apartment booking buttons
function openBooking(roomName) {
    alert(`Great choice! You selected the ${roomName}. You can now proceed to confirm your dates or connect your payment gateway here.`);
}
