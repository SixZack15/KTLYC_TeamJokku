// js/register.js

document.addEventListener('DOMContentLoaded', function() {
    // Simulated room data
    const rooms = [
        { id: 'A201', location: 'Cơ sở 1', gender: 'Nam', capacity: 4, occupancy: 3, price: '1,000,000 VND' },
        { id: 'A202', location: 'Cơ sở 1', gender: 'Nam', capacity: 4, occupancy: 4, price: '1,000,000 VND' },
        { id: 'B301', location: 'Cơ sở 1', gender: 'Nữ', capacity: 8, occupancy: 6, price: '800,000 VND' },
        { id: 'C101', location: 'Cơ sở 3', gender: 'Nữ', capacity: 4, occupancy: 4, price: '1,200,000 VND' },
        { id: 'C102', location: 'Cơ sở 3', gender: 'Nữ', capacity: 4, occupancy: 2, price: '1,200,000 VND' },
        { id: 'D405', location: 'Cơ sở 3', gender: 'Nam', capacity: 8, occupancy: 8, price: '900,000 VND' },
    ];

    const roomListing = document.getElementById('room-listing');
    const filters = {
        location: document.getElementById('location-filter'),
        gender: document.getElementById('gender-filter'),
        capacity: document.getElementById('capacity-filter'),
    };

    // Views
    const roomSelectionView = document.getElementById('room-selection-view');
    const registrationFormView = document.getElementById('registration-form-view');
    const statusTrackingView = document.getElementById('status-tracking-view');

    // --- Step 1 & 2: Room Selection and Filtering ---

    function renderRooms() {
        roomListing.innerHTML = '';
        const filteredRooms = rooms.filter(room => {
            const locationMatch = filters.location.value === 'all' || room.location === filters.location.value;
            const genderMatch = filters.gender.value === 'all' || room.gender === filters.gender.value;
            const capacityMatch = filters.capacity.value === 'all' || room.capacity == filters.capacity.value;
            return locationMatch && genderMatch && capacityMatch;
        });

        if (filteredRooms.length === 0) {
            roomListing.innerHTML = '<p>Không tìm thấy phòng phù hợp.</p>';
            return;
        }

        filteredRooms.forEach(room => {
            const isFull = room.occupancy >= room.capacity;
            const card = document.createElement('div');
            card.className = 'card-info room-card';
            card.innerHTML = `
                <h4>Phòng ${room.id} - ${room.location}</h4>
                <p><strong>Khu ở:</strong> ${room.gender}</p>
                <p><strong>Loại phòng:</strong> ${room.capacity} SV</p>
                <p><strong>Hiện có:</strong> ${room.occupancy} / ${room.capacity} SV</p>
                <p><strong>Giá:</strong> ${room.price}/tháng</p>
                <button class="btn register-btn" data-room-id="${room.id}" ${isFull ? 'disabled' : ''}>
                    ${isFull ? 'Đã đầy' : 'Đăng ký'}
                </button>
            `;
            roomListing.appendChild(card);
        });
    }

    Object.values(filters).forEach(filter => filter.addEventListener('change', renderRooms));

    roomListing.addEventListener('click', function(e) {
        if (e.target.classList.contains('register-btn')) {
            const roomId = e.target.dataset.roomId;
            const room = rooms.find(r => r.id === roomId);
            document.getElementById('selected-room-info').textContent = `${room.id} (${room.location})`;
            document.getElementById('status-room-info').textContent = `${room.id} (${room.location})`;
            
            // Switch to form view
            roomSelectionView.style.display = 'none';
            registrationFormView.style.display = 'block';
        }
    });

    // --- Step 3: Registration Form ---
    
    document.getElementById('back-to-selection-btn').addEventListener('click', () => {
        registrationFormView.style.display = 'none';
        roomSelectionView.style.display = 'block';
    });

    document.getElementById('registration-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const formError = document.getElementById('form-error');
        // Simulate form validation (BR4)
        const fullName = document.getElementById('full-name').value;
        const studentId = document.getElementById('student-id').value;
        const phone = document.getElementById('phone-number').value;
        const docs = document.getElementById('documents').files;

        if (fullName && studentId && phone && docs.length > 0) {
            // On success, switch to status view (BR7)
            registrationFormView.style.display = 'none';
            statusTrackingView.style.display = 'block';
            formError.style.display = 'none';
        } else {
            formError.style.display = 'block';
        }
    });

    // --- Step 5: Status Tracking ---

    document.getElementById('cancel-registration-btn').addEventListener('click', () => {
        // Simulate cancellation (BR6)
        if (confirm('Bạn có chắc chắn muốn huỷ đăng ký phòng này?')) {
            alert('Đã huỷ đăng ký thành công. Tiền cọc (nếu có) sẽ được xử lý theo quy định.');
            // Reset to initial state
            statusTrackingView.style.display = 'none';
            roomSelectionView.style.display = 'block';
            document.getElementById('registration-form').reset();
        }
    });

    // Initial render
    renderRooms();
});