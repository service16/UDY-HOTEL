// Default Initial Data (Cached in localStorage for persistence)
const defaultRooms = [
    { id: 1, name: "Classic Single Room", price: 35000, status: "Available", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800", desc: "Cozy space equipped with air conditioning, flat-screen TV, clothes rack, and clean en-suite facilities." },
    { id: 2, name: "Executive Double Room", price: 50000, status: "Available", image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800", desc: "Features a comfortable double bed, refrigerator, electric kettle, desk workspace, and city view." },
    { id: 3, name: "Udy Presidential Suite", price: 85000, status: "Available", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800", desc: "Spacious luxury suite with premium amenities, spa bath, terrace access, and top-tier comfort." }
];

const defaultGallery = [
    { id: 1, title: "Havana Lobby Bar & Open Bar", desc: "Enjoy chilled drinks, signature cocktails, and your favorite Asun pairings.", image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800" },
    { id: 2, title: "Fiesta Restaurant", desc: "Savor delicious, well-prepared local and continental dishes made by expert chefs.", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800" },
    { id: 3, title: "Night Club & Lounge", desc: "Experience an energetic weekend atmosphere with great music and entertainment.", image: "https://images.unsplash.com/photo-1545128485-c400e7702796?w=800" }
];

// Initialize storage if empty
if (!localStorage.getItem('udy_rooms')) {
    localStorage.setItem('udy_rooms', JSON.stringify(defaultRooms));
}
if (!localStorage.getItem('udy_gallery')) {
    localStorage.setItem('udy_gallery', JSON.stringify(defaultGallery));
}
if (!localStorage.getItem('udy_bookings')) {
    localStorage.setItem('udy_bookings', JSON.stringify([]));
}

// ==================== PUBLIC WEBSITE LOGIC ====================
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('publicRoomsGrid')) {
        renderPublicWebsite();
    }
    if (document.getElementById('adminDashboardWrapper')) {
        checkAdminAuth();
    }
});

function renderPublicWebsite() {
    const rooms = JSON.parse(localStorage.getItem('udy_rooms')) || [];
    const gallery = JSON.parse(localStorage.getItem('udy_gallery')) || [];

    // Render Rooms
    const roomsGrid = document.getElementById('publicRoomsGrid');
    roomsGrid.innerHTML = '';
    rooms.forEach(room => {
        const isAvail = room.status === 'Available';
        roomsGrid.innerHTML += `
            <div class="card">
                <div class="card-img-wrapper">
                    <img src="${room.image}" alt="${room.name}" class="card-img">
                    <span class="badge-tag ${!isAvail ? 'badge-unavailable' : ''}">${room.status}</span>
                </div>
                <div class="card-body">
                    <h3>${room.name}</h3>
                    <p class="price">₦${room.price.toLocaleString()} <span>/ night</span></p>
                    <p class="desc">${room.desc}</p>
                    <button class="btn-primary ${!isAvail ? 'btn-disabled' : ''}" 
                        ${isAvail ? `onclick="openBookingModal('${room.name}', ${room.price})"` : 'disabled'}>
                        ${isAvail ? 'Book Room Now' : 'Currently Booked Out'}
                    </button>
                </div>
            </div>
        `;
    });

    // Render Gallery
    const galleryGrid = document.getElementById('publicGalleryGrid');
    galleryGrid.innerHTML = '';
    gallery.forEach(item => {
        galleryGrid.innerHTML += `
            <div class="gallery-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="gallery-caption">
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                </div>
            </div>
        `;
    });
}

let selectedRoomName = "";
let selectedRoomPrice = 0;

function openBookingModal(roomName, price) {
    selectedRoomName = roomName;
    selectedRoomPrice = price;
    document.getElementById('modalRoomTitle').innerText = `${roomName} - ₦${price.toLocaleString()} / night`;
    document.getElementById('bookingModal').style.display = 'flex';
}

function closeBookingModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

function submitReservation(event) {
    event.preventDefault();

    const newBooking = {
        id: Date.now(),
        name: document.getElementById('guestName').value,
        phone: document.getElementById('guestPhone').value,
        email: document.getElementById('guestEmail').value,
        room: selectedRoomName,
        checkIn: document.getElementById('checkInDate').value,
        checkOut: document.getElementById('checkOutDate').value,
        status: "Pending Review",
        dateBooked: new Date().toLocaleDateString()
    };

    let bookings = JSON.parse(localStorage.getItem('udy_bookings')) || [];
    bookings.unshift(newBooking);
    localStorage.setItem('udy_bookings', JSON.stringify(bookings));

    alert(`🎉 Reservation Sent Successfully! Udy Hotel admin has received your booking notification for the ${selectedRoomName}.`);
    document.getElementById('reservationForm').reset();
    closeBookingModal();
}


// ==================== ADMIN DASHBOARD LOGIC ====================
function checkAdminAuth() {
    if (sessionStorage.getItem('udy_admin_auth') === 'true') {
        document.getElementById('adminLoginWrapper').style.display = 'none';
        document.getElementById('adminDashboardWrapper').style.display = 'block';
        loadAdminData();
    } else {
        document.getElementById('adminLoginWrapper').style.display = 'flex';
        document.getElementById('adminDashboardWrapper').style.display = 'none';
    }
}

function loginAdmin() {
    const u = document.getElementById('adminUser').value;
    const p = document.getElementById('adminPass').value;
    if (u === 'admin' && p === 'password') {
        sessionStorage.setItem('udy_admin_auth', 'true');
        checkAdminAuth();
    } else {
        alert('❌ Invalid username or password (use admin / password)');
    }
}

function logoutAdmin() {
    sessionStorage.removeItem('udy_admin_auth');
    checkAdminAuth();
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    if (tabName === 'bookings') {
        document.getElementById('tabBookings').style.display = 'block';
        event.currentTarget.classList.add('active');
    } else if (tabName === 'rooms') {
        document.getElementById('tabRooms').style.display = 'block';
        event.currentTarget.classList.add('active');
    } else if (tabName === 'gallery') {
        document.getElementById('tabGallery').style.display = 'block';
        event.currentTarget.classList.add('active');
    }
}

function loadAdminData() {
    loadBookingsTable();
    loadRoomsTable();
    loadGalleryGrid();
}

// 1. BOOKINGS CONTROLLER
function loadBookingsTable() {
    const bookings = JSON.parse(localStorage.getItem('udy_bookings')) || [];
    const tbody = document.getElementById('adminBookingsTable');
    document.getElementById('totalBookingsCount').innerText = bookings.length;
    document.getElementById('badgeCount').innerText = bookings.filter(b => b.status === 'Pending Review').length;
    document.getElementById('pendingBookingsCount').innerText = bookings.filter(b => b.status === 'Pending Review').length;

    tbody.innerHTML = '';
    if (bookings.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #64748b;">No guest bookings received yet.</td></tr>`;
        return;
    }

    bookings.forEach(b => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${b.name}</strong><br><small>${b.phone} | ${b.email}</small></td>
                <td><span style="color: #0284c7; font-weight: 600;">${b.room}</span></td>
                <td>${b.checkIn} to ${b.checkOut}</td>
                <td><span style="font-weight: 600; color: ${b.status === 'Accepted' ? '#166534' : b.status === 'Rejected' ? '#991b1b' : '#eab308'};">${b.status}</span></td>
                <td>
                    <button class="btn-action btn-accept" onclick="updateBookingStatus(${b.id}, 'Accepted')">Accept</button>
                    <button class="btn-action btn-reject" onclick="updateBookingStatus(${b.id}, 'Rejected')">Reject</button>
                    <button class="btn-action" style="background:#fee2e2; color:#991b1b;" onclick="deleteBooking(${b.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

function updateBookingStatus(id, status) {
    let bookings = JSON.parse(localStorage.getItem('udy_bookings')) || [];
    bookings = bookings.map(b => b.id === id ? {...b, status} : b);
    localStorage.setItem('udy_bookings', JSON.stringify(bookings));
    loadBookingsTable();
}

function deleteBooking(id) {
    if (confirm('Delete this reservation record?')) {
        let bookings = JSON.parse(localStorage.getItem('udy_bookings')) || [];
        bookings = bookings.filter(b => b.id !== id);
        localStorage.setItem('udy_bookings', JSON.stringify(bookings));
        loadBookingsTable();
    }
}

// 2. ROOM MANAGEMENT CONTROLLER
function loadRoomsTable() {
    const rooms = JSON.parse(localStorage.getItem('udy_rooms')) || [];
    const tbody = document.getElementById('adminRoomsTable');
    tbody.innerHTML = '';

    rooms.forEach(room => {
        const isAvail = room.status === 'Available';
        tbody.innerHTML += `
            <tr>
                <td><img src="${room.image}" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px;"></td>
                <td><strong>${room.name}</strong></td>
                <td>₦${room.price.toLocaleString()}</td>
                <td><span style="font-weight: 600; color: ${isAvail ? '#166534' : '#991b1b'};">${room.status}</span></td>
                <td>
                    <button class="btn-action btn-toggle-status" onclick="toggleRoomStatus(${room.id})">Toggle Available/Booked</button>
                    <button class="btn-action" style="background:#f1f5f9; color:#0f172a;" onclick="editRoom(${room.id})">Edit</button>
                    <button class="btn-action btn-reject" onclick="deleteRoom(${room.id})">Remove</button>
                </td>
            </tr>
        `;
    });
}

function toggleRoomStatus(id) {
    let rooms = JSON.parse(localStorage.getItem('udy_rooms')) || [];
    rooms = rooms.map(r => r.id === id ? {...r, status: r.status === 'Available' ? 'Unavailable' : 'Available'} : r);
    localStorage.setItem('udy_rooms', JSON.stringify(rooms));
    loadRoomsTable();
}

function openAddRoomModal() {
    document.getElementById('roomModalTitle').innerText = 'Add New Room';
    document.getElementById('roomForm').reset();
    document.getElementById('editRoomId').value = '';
    document.getElementById('roomModal').style.display = 'flex';
}

function closeRoomModal() {
    document.getElementById('roomModal').style.display = 'none';
}

function editRoom(id) {
    const rooms = JSON.parse(localStorage.getItem('udy_rooms')) || [];
    const room = rooms.find(r => r.id === id);
    if (!room) return;

    document.getElementById('roomModalTitle').innerText = 'Edit Room Details';
    document.getElementById('editRoomId').value = room.id;
    document.getElementById('roomNameInput').value = room.name;
    document.getElementById('roomPriceInput').value = room.price;
    document.getElementById('roomImgInput').value = room.image;
    document.getElementById('roomDescInput').value = room.desc;
    document.getElementById('roomStatusInput').value = room.status;
    document.getElementById('roomModal').style.display = 'flex';
}

function saveRoom(e) {
    e.preventDefault();
    const id = document.getElementById('editRoomId').value;
    const name = document.getElementById('roomNameInput').value;
    const price = Number(document.getElementById('roomPriceInput').value);
    const image = document.getElementById('roomImgInput').value;
    const desc = document.getElementById('roomDescInput').value;
    const status = document.getElementById('roomStatusInput').value;

    let rooms = JSON.parse(localStorage.getItem('udy_rooms')) || [];

    if (id) {
        rooms = rooms.map(r => r.id == id ? {...r, name, price, image, desc, status} : r);
    } else {
        rooms.push({ id: Date.now(), name, price, image, desc, status });
    }

    localStorage.setItem('udy_rooms', JSON.stringify(rooms));
    closeRoomModal();
    loadRoomsTable();
}

function deleteRoom(id) {
    if (confirm('Are you sure you want to delete this room?')) {
        let rooms = JSON.parse(localStorage.getItem('udy_rooms')) || [];
        rooms = rooms.filter(r => r.id !== id);
        localStorage.setItem('udy_rooms', JSON.stringify(rooms));
        loadRoomsTable();
    }
}

// 3. GALLERY IMAGE CONTROLLER
function loadGalleryGrid() {
    const gallery = JSON.parse(localStorage.getItem('udy_gallery')) || [];
    const grid = document.getElementById('adminGalleryGrid');
    grid.innerHTML = '';

    gallery.forEach(item => {
        grid.innerHTML += `
            <div class="admin-gallery-card">
                <img src="${item.image}" alt="${item.title}">
                <div class="admin-gallery-body">
                    <h4>${item.title}</h4>
                    <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 10px;">${item.desc}</p>
                    <button class="btn-action btn-reject" onclick="deleteGalleryItem(${item.id})">Delete Photo</button>
                </div>
            </div>
        `;
    });
}

function openAddImageModal() {
    document.getElementById('imageForm').reset();
    document.getElementById('imageModal').style.display = 'flex';
}

function closeImageModal() {
    document.getElementById('imageModal').style.display = 'none';
}

function saveImage(e) {
    e.preventDefault();
    const title = document.getElementById('imgTitleInput').value;
    const desc = document.getElementById('imgDescInput').value;
    const image = document.getElementById('imgUrlInput').value;

    let gallery = JSON.parse(localStorage.getItem('udy_gallery')) || [];
    gallery.push({ id: Date.now(), title, desc, image });
    localStorage.setItem('udy_gallery', JSON.stringify(gallery));

    closeImageModal();
    loadGalleryGrid();
}

function deleteGalleryItem(id) {
    if (confirm('Remove this photo from the website gallery?')) {
        let gallery = JSON.parse(localStorage.getItem('udy_gallery')) || [];
        gallery = gallery.filter(i => i.id !== id);
        localStorage.setItem('udy_gallery', JSON.stringify(gallery));
        loadGalleryGrid();
    }
}
