// js/transfer_request.js

document.addEventListener('DOMContentLoaded', function() {
    // --- State Management Integration ---
    const currentUserId = sessionStorage.getItem('currentUserId');
    if (!currentUserId) return;

    let state = getState();
    const studentStatus = state.studentList[currentUserId]; // Get the correct student

    // Simulated data for available rooms (can be moved to state manager later if needed)
    const availableRooms = [
        { id: 'B301', gender: 'Nữ', capacity: 8, occupancy: 6 },
        { id: 'C102', gender: 'Nữ', capacity: 4, occupancy: 2 },
        { id: 'A405', gender: 'Nam', capacity: 4, occupancy: 1 },
    ];

    const form = document.getElementById('transfer-form');
    const submitBtn = document.getElementById('submit-transfer-btn');
    const alertBox = document.getElementById('prerequisite-alert');
    const newRoomSelect = document.getElementById('new-room');
    const requestView = document.getElementById('transfer-request-view');
    const statusView = document.getElementById('status-view');

    function checkPrerequisites() {
        let canRequest = true;
        let alertMessage = '';

        if (!studentStatus.hasRoom) {
            canRequest = false;
            alertMessage = 'Bạn phải có phòng ở hiện tại mới có thể yêu cầu chuyển phòng.';
        } else if (studentStatus.hasOutstandingFees) {
            canRequest = false;
            alertMessage = 'Bạn có công nợ chưa thanh toán. Vui lòng hoàn thành phí trước khi yêu cầu chuyển phòng.';
        }

        if (!canRequest) {
            alertBox.textContent = alertMessage;
            alertBox.classList.add('alert-danger'); // Make the alert more prominent
            alertBox.style.display = 'block';
            submitBtn.disabled = true;
            Array.from(form.elements).forEach(el => el.disabled = true);
        } else {
            alertBox.style.display = 'none';
            submitBtn.disabled = false;
        }
    }

    function populateAvailableRooms() {
        newRoomSelect.innerHTML = '<option value="">-- Chọn phòng mong muốn --</option>';
        availableRooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room.id;
            option.textContent = `Phòng ${room.id} (Còn ${room.capacity - room.occupancy} chỗ)`;
            newRoomSelect.appendChild(option);
        });
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (newRoomSelect.value && document.getElementById('transfer-reason').value) {
            
            // --- STATE UPDATE LOGIC ---
            // 1. Create a new request object.
            const newRequestId = '#YC-' + Math.floor(100 + Math.random() * 900); // e.g., #YC-123
            const newRequest = {
                id: newRequestId,
                type: 'Chuyển phòng',
                status: 'Chờ xử lý' // Set the status to pending
            };

            // 2. Update the main state object.
            state.studentList[currentUserId].latestRequest = newRequest;

            // 3. Save the entire state back to localStorage.
            saveState(state);
            // --- END OF STATE UPDATE LOGIC ---

            // Simulate successful submission by switching views
            requestView.style.display = 'none';
            statusView.style.display = 'block';

        } else {
            alert('Vui lòng điền đầy đủ thông tin.');
        }
    });

    // --- Initial setup on page load ---
    document.getElementById('current-room').value = studentStatus.roomInfo.roomNumber;
    checkPrerequisites();
    populateAvailableRooms();
});