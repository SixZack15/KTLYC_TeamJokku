// js/checkout_process.js

document.addEventListener('DOMContentLoaded', function() {
    let state = getState();
    let pendingCheckouts = state.admin.pendingCheckoutList;

    const queueCountEl = document.getElementById('queue-count-checkout');
    const pendingListEl = document.getElementById('pending-list-checkout');
    const selectPromptEl = document.getElementById('select-prompt-checkout');
    const verificationPanelEl = document.getElementById('verification-panel-checkout');
    
    // Panel elements
    const studentNameHeader = document.getElementById('student-name-header-checkout');
    const debtStatusCheck = document.getElementById('debt-status-check');
    const damageChecklist = document.getElementById('damage-checklist');
    const checklistItems = damageChecklist.querySelectorAll('input[type="checkbox"]');
    const completeBtn = document.getElementById('complete-checkout-btn');
    
    let selectedRequest = null;
    let debtOk = false;
    let damagesOk = false;

    function renderPendingList() {
        pendingListEl.innerHTML = '';
        queueCountEl.textContent = pendingCheckouts.length;

        if (pendingCheckouts.length === 0) {
            pendingListEl.innerHTML = '<p style="padding: 15px;">Không có yêu cầu nào đang chờ xử lý.</p>';
            return;
        }

        pendingCheckouts.forEach(req => {
            const item = document.createElement('div');
            item.className = 'list-item';
            item.dataset.id = req.requestId;
            item.innerHTML = `<strong>${req.studentName}</strong><span>Phòng: ${req.roomId} - Ngày đi: ${req.departureDate}</span>`;
            item.addEventListener('click', () => {
                document.querySelectorAll('.list-item.active').forEach(el => el.classList.remove('active'));
                item.classList.add('active');
                displayRequestDetails(req.requestId);
            });
            pendingListEl.appendChild(item);
        });
    }

    function displayRequestDetails(requestId) {
        selectedRequest = pendingCheckouts.find(r => r.requestId === requestId);
        if (!selectedRequest) return;

        selectPromptEl.style.display = 'none';
        verificationPanelEl.style.display = 'block';
        studentNameHeader.textContent = `Xử lý trả phòng cho: ${selectedRequest.studentName}`;
        
        // Reset checks
        checklistItems.forEach(item => item.checked = false);

        // BR2: Check for outstanding fees
        const student = state.studentList[selectedRequest.studentId];
        debtOk = student && !student.hasOutstandingFees;
        if (debtOk) {
            debtStatusCheck.innerHTML = '<span class="badge badge-paid">Đã hoàn thành</span>';
        } else {
            debtStatusCheck.innerHTML = '<span class="badge badge-overdue">Còn công nợ</span>';
        }

        validateConditions();
    }

    function validateConditions() {
        // BR3: Check if all damage checklist items are ticked
        damagesOk = Array.from(checklistItems).every(item => item.checked);
        
        // Enable the final button only if both conditions are met
        completeBtn.disabled = !(debtOk && damagesOk);
    }

    damageChecklist.addEventListener('change', validateConditions);

    completeBtn.addEventListener('click', function() {
        if (!selectedRequest || !debtOk || !damagesOk) return;

        if (confirm(`Xác nhận hoàn tất thủ tục trả phòng cho sinh viên ${selectedRequest.studentName}?`)) {
            // --- STATE UPDATE LOGIC ---
            // 1. Remove from pending list
            state.admin.pendingCheckoutList = state.admin.pendingCheckoutList.filter(r => r.requestId !== selectedRequest.requestId);
            state.admin.pendingCheckouts--;
            
            // 2. Update student status to "no room"
            const studentToUpdate = state.studentList[selectedRequest.studentId];
            if (studentToUpdate) {
                studentToUpdate.hasRoom = false;
                studentToUpdate.roomInfo = {}; // Clear room info
                studentToUpdate.latestRequest = { id: selectedRequest.requestId, type: 'Trả phòng', status: 'Đã xử lý' };
            }
            
            // 3. Update room occupancy and available slots
            const roomToUpdate = state.admin.roomList.find(r => r.id === selectedRequest.roomId);
            if (roomToUpdate) {
                roomToUpdate.occupancy--;
            }
            state.admin.availableSlots++;
            
            saveState(state);
            // --- END STATE UPDATE ---

            alert('Đã hoàn tất trả phòng thành công!');
            verificationPanelEl.style.display = 'none';
            selectPromptEl.style.display = 'block';
            pendingCheckouts = state.admin.pendingCheckoutList;
            renderPendingList();
        }
    });

    // Initial Render
    document.getElementById('admin-name').textContent = state.admin.user.name;
    renderPendingList();
});