let selectedRoomName = "";
let selectedRoomPrice = 0;

// Open booking modal
function openBookingModal(roomName, price) {
    selectedRoomName = roomName;
    selectedRoomPrice = price;
    document.getElementById('modalRoomTitle').innerText = `${roomName} - ₦${price.toLocaleString()} / night`;
    document.getElementById('bookingModal').style.display = 'flex';
}

// Close booking modal
function closeBookingModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

// Submit Reservation & Notify Admin
function submitReservation(event) {
    event.preventDefault();

    const name = document.getElementById('guestName').value;
    const phone = document.getElementById('guestPhone').value;
    const email = document.getElementById('guestEmail').value;
    const checkIn = document.getElementById('checkInDate').value;
    const checkOut = document.getElementById('checkOutDate').value;

    const newBooking = {
        id: Date.now(),
        name,
        phone,
        email,
        room: selectedRoomName,
        checkIn,
        checkOut,
        dateBooked: new Date().toLocaleDateString()
    };

    // Save into localStorage
    let bookings = JSON.parse(localStorage.getItem('udy_hotel_bookings')) || [];
    bookings.unshift(newBooking);
    localStorage.setItem('udy_hotel_bookings', JSON.stringify(bookings));

    alert(`🎉 Booking Successful! Thank you, ${name}. Udy Hotel and Suites has received your reservation request for the ${selectedRoomName}. An admin notification has been dispatched.`);
    
    document.getElementById('reservationForm').reset();
    closeBookingModal();
}

// Toggle Admin Portal Modal
function toggleAdminModal() {
    const modal = document.getElementById('adminModal');
    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'flex';
        // Check if already logged in during session
        if (sessionStorage.getItem('udy_admin_logged') === 'true') {
            showDashboard();
        } else {
            showLoginView();
        }
    }
}

function showLoginView() {
    document.getElementById('adminLoginView').style.display = 'block';
    document.getElementById('adminDashboardView').style.display = 'none';
}

function showDashboard() {
    document.getElementById('adminLoginView').style.display = 'none';
    document.getElementById('adminDashboardView').style.display = 'block';
    loadAdminBookings();
}

// Simple Hardcoded Admin Login (Username: admin, Password: password)
function loginAdmin() {
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;

    if (user === 'admin' && pass === 'password') {
        sessionStorage.setItem('udy_admin_logged', 'true');
        showDashboard();
    } else {
        alert('❌ Invalid admin username or password. (Hint: use admin / password)');
    }
}

function logoutAdmin() {
    sessionStorage.removeItem('udy_admin_logged');
    showLoginView();
}

// Load reservations onto the Admin table
function loadAdminBookings() {
    const bookings = JSON.parse(localStorage.getItem('udy_hotel_bookings')) || [];
    const tableBody = document.getElementById('adminBookingsTable');
    document.getElementById('totalBookingsCount').innerText = bookings.length;

    tableBody.innerHTML = '';

    if (bookings.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #64748b;">No reservations found yet.</td></tr>`;
        return;
    }

    bookings.forEach(b => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${b.name}</strong><br><small>${b.email}</small></td>
            <td>${b.phone}</td>
            <td><span style="color: #0284c7; font-weight: 600;">${b.room}</span></td>
            <td>${b.checkIn}</td>
            <td>${b.checkOut}</td>
            <td><button class="btn-delete" onclick="deleteBooking(${b.id})">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Delete booking entry from admin dashboard
function deleteBooking(id) {
    if (confirm('Are you sure you want to delete this reservation record?')) {
        let bookings = JSON.parse(localStorage.getItem('udy_hotel_bookings')) || [];
        bookings = bookings.filter(b => b.id !== id);
        localStorage.setItem('udy_hotel_bookings', JSON.stringify(bookings));
        loadAdminBookings();
    }
}
