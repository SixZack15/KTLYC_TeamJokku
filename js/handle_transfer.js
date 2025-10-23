// js/handle_transfer.js

document.addEventListener('DOMContentLoaded', function() {
    let state = getState();
    let pendingTransfers = state.admin.pendingTransferList;
    let rooms = state.admin.roomList;
    let students = state.studentList;

    const queueCountEl = document.getElementById('queue-count-transfer');
    const pendingListEl = document.getElementById('pending-list-transfer');
    const selectPromptEl = document.getElementById('select-prompt-transfer');
    const verificationPanelEl = document.getElementById('verification-panel-transfer');
    
    // Panel elements
    const studentNameHeader = document.getElementById('student-name-header-transfer');
    const currentRoomInfo = document.getElementById('current-room-info');
    const desiredRoomInfo = document.getElementById('desired-room-info');
    const reasonDisplay = document.getElementById('reason-display');
    const feeStatusCheck = document.getElementById('fee-status-check-transfer');
    const roomAvailabilityCheck = document.getElementById('room-availability-check');
    const rejectionReasonEl = document.getElementById('rejection-reason-transfer');
    const approveBtn = document.getElementById('approve-btn-transfer');
    const rejectBtn = document.getElementById('reject-btn-transfer');
    
    let selectedRequest = null;

    function renderPendingList() {
        pendingListEl.innerHTML = '';
        queueCountEl.textContent = pendingTransfers.length;

        if (pendingTransfers.length === 0) {
            pendingListEl.innerHTML = '<p style="padding: 15px;">Không có yêu cầu nào đang chờ xử lý.</p>';
            return;
        }

        pendingTransfers.forEach(req => {
            const item = document.createElement('div');
            item.className = 'list-item';
            item.dataset.id = req.requestId;
            item.innerHTML = `
                <strong>${req.studentName}</strong>
                <span>Từ: ${req.currentRoomId} → Đến: ${req.desiredRoomId}</span>
            `;
            item.addEventListener('click', () => {
                document.querySelectorAll('.list-item.active').forEach(el => el.classList.remove('active'));
                item.classList.add('active');
                displayRequestDetails(req.requestId);
            });
            pendingListEl.appendChild(item);
        });
    }

    function displayRequestDetails(requestId) {
        selectedRequest = pendingTransfers.find(r => r.requestId === requestId);
        if (!selectedRequest) return;

        selectPromptEl.style.display = 'none';
        verificationPanelEl.style.display = 'block';

        studentNameHeader.textContent = `Yêu cầu của sinh viên: ${selectedRequest.studentName}`;
        currentRoomInfo.textContent = selectedRequest.currentRoomId;
        desiredRoomInfo.textContent = selectedRequest.desiredRoomId;
        reasonDisplay.textContent = selectedRequest.reason;

        let isEligible = true;
        rejectionReasonEl.style.display = 'none';

        // Check 1: Fee status (BR2)
        if (selectedRequest.feeOk) {
            feeStatusCheck.innerHTML = '<span class="badge badge-paid">Không có nợ</span>';
        } else {
            feeStatusCheck.innerHTML = '<span class="badge badge-overdue">Còn nợ phí</span>';
            isEligible = false;
        }

        // Check 2: New room availability (BR3)
        const desiredRoom = rooms.find(r => r.id === selectedRequest.desiredRoomId);
        if (desiredRoom && desiredRoom.occupancy < desiredRoom.capacity) {
            roomAvailabilityCheck.innerHTML = `<span class="badge badge-paid">Còn trống (${desiredRoom.occupancy}/${desiredRoom.capacity})</span>`;
        } else {
            roomAvailabilityCheck.innerHTML = '<span class="badge badge-overdue">Đã đầy hoặc không tồn tại</span>';
            isEligible = false;
        }

        approveBtn.disabled = !isEligible;
        if (!isEligible) {
            rejectionReasonEl.textContent = "Yêu cầu không đủ điều kiện để chấp thuận.";
            rejectionReasonEl.style.display = 'block';
        }
    }

    approveBtn.addEventListener('click', function() {
        if (!selectedRequest) return;

        if (confirm(`Xác nhận chuyển phòng cho sinh viên ${selectedRequest.studentName} từ ${selectedRequest.currentRoomId} sang ${selectedRequest.desiredRoomId}?`)) {
            // --- STATE UPDATE LOGIC ---
            state.admin.pendingTransferList = state.admin.pendingTransferList.filter(r => r.requestId !== selectedRequest.requestId);
            
            const oldRoom = state.admin.roomList.find(r => r.id === selectedRequest.currentRoomId);
            const newRoom = state.admin.roomList.find(r => r.id === selectedRequest.desiredRoomId);
            if (oldRoom) oldRoom.occupancy--;
            if (newRoom) newRoom.occupancy++;
            
            state.admin.pendingTransfers--;
            
            const studentToUpdate = state.studentList[selectedRequest.studentId];
            if (studentToUpdate) {
                studentToUpdate.roomInfo.roomNumber = selectedRequest.desiredRoomId;
                studentToUpdate.latestRequest = {
                    id: selectedRequest.requestId,
                    type: 'Chuyển phòng',
                    status: 'Đã xử lý'
                };
            }
            
            saveState(state);
            // --- END STATE UPDATE ---

            alert('Đã duyệt chuyển phòng thành công!');
            verificationPanelEl.style.display = 'none';
            selectPromptEl.style.display = 'block';
            pendingTransfers = state.admin.pendingTransferList; 
            renderPendingList();
        }
    });

    rejectBtn.addEventListener('click', function() {
        if (!selectedRequest) return;
        if (prompt(`Nhập lý do từ chối yêu cầu của sinh viên ${selectedRequest.studentName}:`)) {
            // --- STATE UPDATE LOGIC ---
            state.admin.pendingTransferList = state.admin.pendingTransferList.filter(r => r.requestId !== selectedRequest.requestId);
            state.admin.pendingTransfers--;
            
            const studentToUpdate = state.studentList[selectedRequest.studentId];
            if (studentToUpdate) {
                 studentToUpdate.latestRequest = {
                    id: selectedRequest.requestId,
                    type: 'Chuyển phòng',
                    status: 'Bị từ chối'
                };
            }
            
            saveState(state);
            // --- END STATE UPDATE ---
            
            alert('Đã từ chối yêu cầu.');
            verificationPanelEl.style.display = 'none';
            selectPromptEl.style.display = 'block';
            pendingTransfers = state.admin.pendingTransferList;
            renderPendingList();
        }
    });

    // Initial Render
    document.getElementById('admin-name').textContent = state.admin.user.name;
    renderPendingList();
});