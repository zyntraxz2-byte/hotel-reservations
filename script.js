// ===== APP STATE =====
const appState = {
    user: null,
    bookings: [],
    rooms: [],
    currentBooking: null,
    filters: {
        type: 'all',
        sort: 'price-low'
    },
    view: 'rooms' // 'rooms' or 'bookings'
};

// ===== MOCK DATA =====
const mockRooms = [
    {
        id: 1,
        name: "Standard Room",
        type: "standard",
        description: "Comfortable room with essential amenities for a pleasant stay.",
        price: 120,
        originalPrice: 150,
        image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        features: ["Free WiFi", "TV", "Coffee Maker", "Work Desk"],
        amenities: ["WiFi", "TV", "AC", "Hairdryer"],
        maxGuests: 2,
        available: 5,
        rating: 4.2,
        popular: true
    },
    {
        id: 2,
        name: "Deluxe Room",
        type: "deluxe",
        description: "Spacious room with premium amenities and city view.",
        price: 180,
        originalPrice: 220,
        image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        features: ["City View", "King Bed", "Smart TV", "Mini Bar"],
        amenities: ["WiFi", "Smart TV", "Mini Bar", "Balcony"],
        maxGuests: 3,
        available: 3,
        rating: 4.5,
        popular: true
    },
    {
        id: 3,
        name: "Executive Suite",
        type: "suite",
        description: "Luxurious suite with separate living area and premium services.",
        price: 300,
        originalPrice: 350,
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        features: ["Separate Living Room", "Two King Beds", "Premium View", "Butler Service"],
        amenities: ["WiFi", "Smart TV", "Butler", "Living Room", "Premium Toiletries"],
        maxGuests: 4,
        available: 2,
        rating: 4.8,
        popular: false
    },
    {
        id: 4,
        name: "Ocean View Room",
        type: "deluxe",
        description: "Beautiful room with stunning ocean views and balcony.",
        price: 220,
        originalPrice: 260,
        image: "https://images.unsplash.com/photo-1615873968403-89e068629265?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        features: ["Ocean View", "Balcony", "King Bed", "Coffee Machine"],
        amenities: ["WiFi", "TV", "Balcony", "Coffee Machine", "Safe"],
        maxGuests: 2,
        available: 4,
        rating: 4.6,
        popular: true
    },
    {
        id: 5,
        name: "Family Suite",
        type: "suite",
        description: "Perfect for families with connecting rooms and extra space.",
        price: 280,
        originalPrice: 320,
        image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        features: ["Connecting Rooms", "Two Bathrooms", "Children's Area", "Game Console"],
        amenities: ["WiFi", "TV", "Game Console", "Kitchenette", "Extra Beds"],
        maxGuests: 6,
        available: 1,
        rating: 4.4,
        popular: false
    },
    {
        id: 6,
        name: "Business Room",
        type: "standard",
        description: "Designed for business travelers with enhanced workspace.",
        price: 150,
        originalPrice: 180,
        image: "https://images.unsplash.com/photo-1568495248636-6432b97bd949?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        features: ["Enhanced Workspace", "High-speed WiFi", "Printer", "Conference Line"],
        amenities: ["WiFi", "TV", "Printer", "Desk", "Office Chair"],
        maxGuests: 2,
        available: 6,
        rating: 4.3,
        popular: false
    }
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadRooms();
    updateDateInputs();
});

function initializeApp() {
    // Check for saved user data
    const savedUser = localStorage.getItem('hotel_user');
    if (savedUser) {
        appState.user = JSON.parse(savedUser);
        updateUserUI();
    } else {
        // Create guest user
        appState.user = {
            id: 'guest_' + Math.random().toString(36).substr(2, 9),
            name: 'Guest',
            email: '',
            phone: ''
        };
    }
    
    // Load bookings from localStorage
    const savedBookings = localStorage.getItem('hotel_bookings');
    if (savedBookings) {
        appState.bookings = JSON.parse(savedBookings);
    }
    
    // Initialize rooms
    appState.rooms = [...mockRooms];
}

function setupEventListeners() {
    // Search form submission
    document.getElementById('searchForm').addEventListener('submit', searchRooms);
    
    // Quick book form submission
    document.getElementById('quickBookForm').addEventListener('submit', quickBook);
    
    // Widget tabs
    document.querySelectorAll('.widget-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            switchWidgetTab(tabId);
        });
    });
    
    // My Bookings button
    document.getElementById('myBookingsBtn').addEventListener('click', showMyBookings);
    
    // Home link
    document.getElementById('homeLink').addEventListener('click', (e) => {
        e.preventDefault();
        showRooms();
    });
    
    // Modal close
    document.getElementById('closeModal').addEventListener('click', closeBookingModal);
    
    // Booking form submission
    document.getElementById('bookingDetailsForm').addEventListener('submit', confirmBooking);
    
    // Filter tags
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const type = tag.dataset.type;
            filterRoomsByType(type);
        });
    });
    
    // Sort dropdown
    document.getElementById('sortBy').addEventListener('change', sortRooms);
    
    // Date inputs
    document.getElementById('checkinDate').addEventListener('change', updateCheckoutDate);
    
    // Load more button
    document.getElementById('loadMoreBtn').addEventListener('click', loadMoreRooms);
    
    // User profile click
    document.getElementById('userProfile').addEventListener('click', toggleUserMenu);
    
    // Close modal on outside click
    document.getElementById('bookingModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('bookingModal')) {
            closeBookingModal();
        }
    });
}

function updateUserUI() {
    const user = appState.user;
    if (user) {
        const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().substr(0, 2);
        document.querySelector('.user-avatar').textContent = initials;
        document.querySelector('.user-name').textContent = user.name;
    }
}

// ===== DATE HANDLING =====
function updateDateInputs() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    const checkinInput = document.getElementById('checkinDate');
    const checkoutInput = document.getElementById('checkoutDate');
    const quickCheckin = document.getElementById('quickCheckin');
    const quickCheckout = document.getElementById('quickCheckout');
    
    checkinInput.value = formatDate(today);
    checkinInput.min = formatDate(today);
    checkoutInput.value = formatDate(tomorrow);
    checkoutInput.min = formatDate(tomorrow);
    
    quickCheckin.value = formatDate(today);
    quickCheckin.min = formatDate(today);
    quickCheckout.value = formatDate(tomorrow);
    quickCheckout.min = formatDate(tomorrow);
}

function updateCheckoutDate() {
    const checkinDate = document.getElementById('checkinDate').value;
    const checkoutInput = document.getElementById('checkoutDate');
    const quickCheckin = document.getElementById('quickCheckin');
    const quickCheckout = document.getElementById('quickCheckout');
    
    if (checkinDate) {
        const minDate = new Date(checkinDate);
        minDate.setDate(minDate.getDate() + 1);
        const formattedMinDate = minDate.toISOString().split('T')[0];
        
        checkoutInput.min = formattedMinDate;
        quickCheckout.min = formattedMinDate;
        
        if (checkoutInput.value < formattedMinDate) {
            checkoutInput.value = formattedMinDate;
            quickCheckout.value = formattedMinDate;
        }
    }
}

// ===== ROOM DISPLAY =====
function loadRooms() {
    const roomGrid = document.getElementById('roomGrid');
    roomGrid.innerHTML = '';
    
    let filteredRooms = [...appState.rooms];
    
    // Apply type filter
    if (appState.filters.type !== 'all') {
        filteredRooms = filteredRooms.filter(room => room.type === appState.filters.type);
    }
    
    // Apply sorting
    filteredRooms.sort((a, b) => {
        switch(appState.filters.sort) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'popularity':
                return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
            case 'rating':
                return b.rating - a.rating;
            default:
                return 0;
        }
    });
    
    // Display rooms
    filteredRooms.forEach(room => {
        const roomCard = document.createElement('div');
        roomCard.className = 'room-card';
        roomCard.innerHTML = `
            ${room.available > 0 ? '<span class="room-badge">Available</span>' : '<span class="room-badge" style="background: var(--danger);">Sold Out</span>'}
            <img src="${room.image}" alt="${room.name}" class="room-image" onerror="this.src='https://via.placeholder.com/800x400/3b82f6/ffffff?text=Room+Image'">
            <div class="room-content">
                <div class="room-header">
                    <h3 class="room-title">${room.name}</h3>
                    <div class="room-price">
                        <span class="price-amount">$${room.price}</span>
                        <span class="price-period">per night</span>
                        ${room.originalPrice > room.price ? 
                            `<div style="font-size: 0.8rem; color: var(--danger); text-decoration: line-through;">$${room.originalPrice}</div>` : ''}
                    </div>
                </div>
                
                <div class="room-features">
                    ${room.features.slice(0, 3).map(feature => `
                        <div class="feature">
                            <i class="fas fa-check"></i>
                            <span>${feature}</span>
                        </div>
                    `).join('')}
                </div>
                
                <p class="room-description">${room.description}</p>
                
                <div class="room-footer">
                    <div class="availability">
                        <span class="available-count">${room.available}</span> rooms available
                    </div>
                    <button class="btn btn-primary book-btn" data-room-id="${room.id}" ${room.available === 0 ? 'disabled' : ''}>
                        <i class="fas fa-calendar-check"></i>
                        Book Now
                    </button>
                </div>
            </div>
        `;
        roomGrid.appendChild(roomCard);
    });
    
    // Add event listeners to book buttons
    document.querySelectorAll('.book-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const roomId = parseInt(e.target.closest('.book-btn').dataset.roomId);
            const room = appState.rooms.find(r => r.id === roomId);
            if (room) {
                openBookingModal(room);
            }
        });
    });
}

function filterRoomsByType(type) {
    // Update active filter
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.classList.remove('active');
        if (tag.dataset.type === type) {
            tag.classList.add('active');
        }
    });
    
    // Update state and reload rooms
    appState.filters.type = type;
    loadRooms();
}

function sortRooms() {
    const sortValue = document.getElementById('sortBy').value;
    appState.filters.sort = sortValue;
    loadRooms();
}

function loadMoreRooms() {
    // In a real app, this would load more rooms from the server
    // For now, we'll just show a message
    showNotification('Loading more rooms...', 'info');
    
    // Simulate API call
    setTimeout(() => {
        showNotification('All rooms loaded', 'success');
        document.getElementById('loadMoreBtn').style.display = 'none';
    }, 1500);
}

// ===== SEARCH =====
function searchRooms(e) {
    e.preventDefault();
    
    const checkin = document.getElementById('checkinDate').value;
    const checkout = document.getElementById('checkoutDate').value;
    const guests = document.getElementById('guests').value;
    const rooms = document.getElementById('rooms').value;
    
    if (!checkin || !checkout) {
        showNotification('Please select check-in and check-out dates', 'error');
        return;
    }
    
    if (new Date(checkin) >= new Date(checkout)) {
        showNotification('Check-out date must be after check-in date', 'error');
        return;
    }
    
    showLoading(true);
    
    // Simulate API call
    setTimeout(() => {
        showLoading(false);
        
        // Scroll to rooms section
        document.getElementById('roomsSection').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        showNotification(`Found ${appState.rooms.length} rooms for your dates`, 'success');
        
        // Highlight available rooms
        document.querySelectorAll('.room-card').forEach(card => {
            card.style.boxShadow = '0 0 0 2px var(--primary)';
            setTimeout(() => {
                card.style.boxShadow = '';
            }, 2000);
        });
    }, 1000);
}

function quickBook(e) {
    e.preventDefault();
    
    const roomType = document.getElementById('quickRoomType').value;
    const checkin = document.getElementById('quickCheckin').value;
    const checkout = document.getElementById('quickCheckout').value;
    
    if (!roomType || !checkin || !checkout) {
        showNotification('Please fill all fields', 'error');
        return;
    }
    
    if (new Date(checkin) >= new Date(checkout)) {
        showNotification('Check-out date must be after check-in date', 'error');
        return;
    }
    
    // Find first available room of selected type
    const room = appState.rooms.find(r => r.type === roomType && r.available > 0);
    
    if (room) {
        openBookingModal(room);
    } else {
        showNotification(`No ${roomType} rooms available for selected dates`, 'error');
    }
}

// ===== BOOKING MODAL =====
function openBookingModal(room) {
    const modal = document.getElementById('bookingModal');
    const checkin = document.getElementById('checkinDate').value;
    const checkout = document.getElementById('checkoutDate').value;
    
    // Calculate nights
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
    const totalPrice = room.price * nights;
    
    // Update modal content
    document.getElementById('modalRoomTitle').textContent = `Book ${room.name}`;
    document.getElementById('selectedRoomName').textContent = room.name;
    document.getElementById('modalCheckinDate').textContent = checkin;
    document.getElementById('modalCheckoutDate').textContent = checkout;
    document.getElementById('totalNights').textContent = `${nights} night${nights !== 1 ? 's' : ''}`;
    document.getElementById('totalPrice').textContent = `$${totalPrice.toFixed(2)}`;
    
    // Store current booking
    appState.currentBooking = {
        room,
        checkin,
        checkout,
        nights,
        totalPrice,
        guests: parseInt(document.getElementById('guests').value) || 2
    };
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
    document.getElementById('bookingModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

async function confirmBooking(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const loading = submitBtn.querySelector('.loading');
    
    // Show loading state
    btnText.style.display = 'none';
    loading.style.display = 'inline-flex';
    submitBtn.disabled = true;
    
    // Collect form data
    const guestName = form.querySelector('input[type="text"]').value;
    const guestEmail = form.querySelector('input[type="email"]').value;
    const guestPhone = form.querySelector('input[type="tel"]').value;
    const specialRequests = form.querySelector('textarea').value || null;
    
    // Prepare API request data
    const requestData = {
        room_id: appState.currentBooking.room.id,
        room_name: appState.currentBooking.room.name,
        checkin: appState.currentBooking.checkin,
        checkout: appState.currentBooking.checkout,
        nights: appState.currentBooking.nights,
        guests: appState.currentBooking.guests,
        total: appState.currentBooking.totalPrice,
        guest_info: {
            name: guestName,
            email: guestEmail,
            phone: guestPhone
        },
        special_requests: specialRequests
    };

    const baseUrl = "https://backoffice-pms.zyntraz.com";
    
    try {
        // Make API call
        const response = await fetch(`${baseUrl}/api/reservations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            // Handle validation errors
            if (result.detail) {
                const errorMessages = result.detail.map(err => err.msg).join(', ');
                throw new Error(errorMessages);
            }
            throw new Error(result.message || 'Failed to create booking');
        }
        
        if (result.success && result.data) {
            // Create booking object from API response
            const booking = {
                id: result.data.id,
                roomId: result.data.room_id,
                roomName: result.data.room_name,
                checkin: result.data.checkin,
                checkout: result.data.checkout,
                nights: result.data.nights,
                guests: result.data.guests,
                total: result.data.total,
                status: result.data.status,
                date: result.data.booking_date,
                guestName: result.data.guest_name,
                guestEmail: result.data.guest_email,
                guestPhone: result.data.guest_phone,
                specialRequests: result.data.special_requests
            };
            
            // Add to bookings
            appState.bookings.unshift(booking);
            
            // Update room availability
            const room = appState.rooms.find(r => r.id === booking.roomId);
            if (room && room.available > 0) {
                room.available--;
            }
            
            // Save to localStorage
            localStorage.setItem('hotel_bookings', JSON.stringify(appState.bookings));
            
            // Reset button
            btnText.style.display = 'inline-flex';
            loading.style.display = 'none';
            submitBtn.disabled = false;
            
            // Close modal
            closeBookingModal();
            
            // Reset form
            form.reset();
            
            // Show success
            showNotification(result.message || 'Booking confirmed! Check your email for details.', 'success');
            
            // Reload rooms to update availability
            loadRooms();
            
            // If on bookings page, reload bookings
            if (appState.view === 'bookings') {
                loadBookings();
            }
        } else {
            throw new Error('Invalid response from server');
        }
        
    } catch (error) {
        console.error('Booking error:', error);
        
        // Reset button
        btnText.style.display = 'inline-flex';
        loading.style.display = 'none';
        submitBtn.disabled = false;
        
        // Show error notification
        showNotification(error.message || 'Failed to create booking. Please try again.', 'error');
    }
}

// ===== MY BOOKINGS =====
function showMyBookings() {
    appState.view = 'bookings';
    
    // Hide rooms section
    document.getElementById('roomsSection').style.display = 'none';
    
    // Show bookings section
    document.getElementById('bookingsSection').style.display = 'block';
    
    // Update button text
    document.getElementById('myBookingsBtn').textContent = 'Back to Rooms';
    document.getElementById('myBookingsBtn').removeEventListener('click', showMyBookings);
    document.getElementById('myBookingsBtn').addEventListener('click', showRooms);
    
    // Load bookings
    loadBookings();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showRooms() {
    appState.view = 'rooms';
    
    // Show rooms section
    document.getElementById('roomsSection').style.display = 'block';
    
    // Hide bookings section
    document.getElementById('bookingsSection').style.display = 'none';
    
    // Update button text
    document.getElementById('myBookingsBtn').textContent = 'My Bookings';
    document.getElementById('myBookingsBtn').removeEventListener('click', showRooms);
    document.getElementById('myBookingsBtn').addEventListener('click', showMyBookings);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function loadBookings() {
    const bookingsGrid = document.getElementById('bookingsGrid');
    
    if (appState.bookings.length === 0) {
        bookingsGrid.innerHTML = `
            <div class="no-bookings">
                <i class="far fa-calendar-times"></i>
                <h3>No Bookings Yet</h3>
                <p>You haven't made any reservations yet.</p>
                <button class="btn btn-primary mt-2" onclick="showRooms()">
                    <i class="fas fa-search"></i>
                    Browse Rooms
                </button>
            </div>
        `;
        return;
    }
    
    bookingsGrid.innerHTML = appState.bookings.map(booking => `
        <div class="booking-card">
            <div class="booking-header">
                <div>
                    <span class="booking-id">${booking.id}</span>
                    <div style="font-size: 0.9rem; color: var(--gray);">Booked on ${booking.date}</div>
                </div>
                <span class="booking-status status-${booking.status}">${booking.status}</span>
            </div>
            
            <div class="booking-details">
                <div class="detail-item">
                    <label>Room</label>
                    <span>${booking.roomName}</span>
                </div>
                <div class="detail-item">
                    <label>Dates</label>
                    <span>${booking.checkin} to ${booking.checkout}</span>
                </div>
                <div class="detail-item">
                    <label>Guests</label>
                    <span>${booking.guests} guest${booking.guests !== 1 ? 's' : ''}</span>
                </div>
                <div class="detail-item">
                    <label>Total</label>
                    <span>$${booking.total.toFixed(2)}</span>
                </div>
            </div>
            
            <div class="booking-actions">
                <button class="btn btn-secondary" onclick="viewBookingDetails('${booking.id}')">
                    <i class="fas fa-eye"></i>
                    View
                </button>
                ${booking.status === 'confirmed' ? `
                    <button class="btn btn-danger" onclick="cancelBooking('${booking.id}')">
                        <i class="fas fa-times"></i>
                        Cancel
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function viewBookingDetails(bookingId) {
    const booking = appState.bookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    Swal.fire({
        title: 'Booking Details',
        html: `
            <div style="text-align: left;">
                <p><strong>Booking ID:</strong> ${booking.id}</p>
                <p><strong>Room:</strong> ${booking.roomName}</p>
                <p><strong>Check-in:</strong> ${booking.checkin}</p>
                <p><strong>Check-out:</strong> ${booking.checkout}</p>
                <p><strong>Nights:</strong> ${booking.nights}</p>
                <p><strong>Guests:</strong> ${booking.guests}</p>
                <p><strong>Total:</strong> $${booking.total.toFixed(2)}</p>
                <p><strong>Status:</strong> <span style="color: ${booking.status === 'confirmed' ? 'green' : booking.status === 'cancelled' ? 'red' : 'orange'}">${booking.status}</span></p>
                <p><strong>Guest:</strong> ${booking.guestName || 'Not provided'}</p>
                <p><strong>Email:</strong> ${booking.guestEmail || 'Not provided'}</p>
            </div>
        `,
        confirmButtonText: 'Close',
        confirmButtonColor: '#2563eb'
    });
}

function cancelBooking(bookingId) {
    Swal.fire({
        title: 'Cancel Booking?',
        text: 'Are you sure you want to cancel this booking?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, cancel it!',
        cancelButtonText: 'No, keep it'
    }).then((result) => {
        if (result.isConfirmed) {
            const bookingIndex = appState.bookings.findIndex(b => b.id === bookingId);
            if (bookingIndex !== -1) {
                // Update booking status
                appState.bookings[bookingIndex].status = 'cancelled';
                
                // Update room availability
                const booking = appState.bookings[bookingIndex];
                const room = appState.rooms.find(r => r.id === booking.roomId);
                if (room) {
                    room.available++;
                }
                
                // Save to localStorage
                localStorage.setItem('hotel_bookings', JSON.stringify(appState.bookings));
                
                // Reload bookings
                loadBookings();
                
                // Reload rooms to update availability
                loadRooms();
                
                showNotification('Booking cancelled successfully', 'success');
            }
        }
    });
}

// ===== WIDGET TABS =====
function switchWidgetTab(tabId) {
    // Update active tab
    document.querySelectorAll('.widget-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabId) {
            tab.classList.add('active');
        }
    });
    
    // Show/hide forms
    document.getElementById('searchForm').classList.toggle('d-none', tabId !== 'search');
    document.getElementById('quickBookForm').classList.toggle('d-none', tabId !== 'quick-book');
}

// ===== UTILITIES =====
function toggleUserMenu() {
    if (!appState.user || appState.user.name === 'Guest') {
        showLoginModal();
    } else {
        // Show user menu (would be implemented as dropdown)
        showNotification(`Welcome, ${appState.user.name}!`, 'info');
    }
}

function showLoginModal() {
    Swal.fire({
        title: 'Sign In',
        html: `
            <input type="email" id="loginEmail" class="swal2-input" placeholder="Email">
            <input type="password" id="loginPassword" class="swal2-input" placeholder="Password">
        `,
        confirmButtonText: 'Sign In',
        showCancelButton: true,
        cancelButtonText: 'Continue as Guest',
        preConfirm: () => {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            if (!email || !password) {
                Swal.showValidationMessage('Please enter email and password');
                return false;
            }
            
            // In a real app, this would be an API call
            return new Promise((resolve) => {
                setTimeout(() => {
                    appState.user = {
                        id: 'user_' + Date.now(),
                        name: email.split('@')[0],
                        email: email
                    };
                    
                    localStorage.setItem('hotel_user', JSON.stringify(appState.user));
                    updateUserUI();
                    
                    resolve(true);
                }, 1000);
            });
        }
    }).then((result) => {
        if (result.isConfirmed) {
            showNotification('Welcome back!', 'success');
        }
    });
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const title = document.getElementById('notificationTitle');
    const messageEl = document.getElementById('notificationMessage');
    const icon = notification.querySelector('.notification-icon');
    
    // Set content
    messageEl.textContent = message;
    
    // Set type
    notification.className = 'notification';
    notification.classList.add(type);
    
    // Set icon based on type
    switch(type) {
        case 'success':
            title.textContent = 'Success!';
            icon.className = 'fas fa-check-circle notification-icon';
            break;
        case 'error':
            title.textContent = 'Error!';
            icon.className = 'fas fa-exclamation-circle notification-icon';
            break;
        case 'warning':
            title.textContent = 'Warning!';
            icon.className = 'fas fa-exclamation-triangle notification-icon';
            break;
        default:
            title.textContent = 'Info';
            icon.className = 'fas fa-info-circle notification-icon';
    }
    
    // Show notification
    notification.classList.add('show');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}

// ===== EXPORT FUNCTIONS =====
window.viewBookingDetails = viewBookingDetails;
window.cancelBooking = cancelBooking;
window.showRooms = showRooms;
