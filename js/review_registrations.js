// js/review_registrations.js

document.addEventListener('DOMContentLoaded', function() {
    let state = getState();
    let pendingStudents = state.admin.pendingStudentList;
    let rooms = state.admin.roomList;

    const queueCountEl = document.getElementById('queue-count');
    const pendingListEl = document.getElementById('pending-list');
    const selectPromptEl = document.getElementById('select-prompt');
    const verificationPanelEl = document.getElementById('verification-panel');
    
    // Panel elements
    const studentNameHeader = document.getElementById('student-name-header');
    const vluStatusCheck = document.getElementById('vlu-status-check');
    const feeStatusCheck = document.getElementById('fee-status-check');
    const rejectionReasonEl = document.getElementById('rejection-reason');
    const roomSelector = document.getElementById('room-selector');
    const approveBtn = document.getElementById('approve-btn');
    const rejectBtn = document.getElementById('reject-btn');
    
    let selectedStudent = null;

    function renderPendingList() {
        pendingListEl.innerHTML = '';
        queueCountEl.textContent = pendingStudents.length;

        if (pendingStudents.length === 0) {
            pendingListEl.innerHTML = '<p style="padding: 15px;">Không có hồ sơ nào đang chờ duyệt.</p>';
            return;
        }

        pendingStudents.forEach(student => {
            const item = document.createElement('div');
            item.className = 'list-item';
            item.dataset.id = student.id;
            item.innerHTML = `
                <strong>${student.name}</strong>
                <span>MSSV: ${student.studentId}</span>
            `;
            item.addEventListener('click', () => {
                // Remove active class from any other item
                document.querySelectorAll('.list-item.active').forEach(el => el.classList.remove('active'));
                item.classList.add('active');
                displayStudentDetails(student.id);
            });
            pendingListEl.appendChild(item);
        });
    }

    function displayStudentDetails(studentId) {
        selectedStudent = pendingStudents.find(s => s.id === studentId);
        if (!selectedStudent) return;

        selectPromptEl.style.display = 'none';
        verificationPanelEl.style.display = 'block';

        studentNameHeader.textContent = `Chi tiết hồ sơ: ${selectedStudent.name}`;
        
        // Step 2: Perform and display verification checks
        let isEligible = true;
        rejectionReasonEl.style.display = 'none';

        if (selectedStudent.statusOk) {
            vluStatusCheck.innerHTML = '<span class="badge badge-paid">Hợp lệ</span>';
        } else {
            vluStatusCheck.innerHTML = '<span class="badge badge-overdue">Không hợp lệ</span>';
            isEligible = false;
        }

        if (selectedStudent.feeOk) {
            feeStatusCheck.innerHTML = '<span class="badge badge-paid">Đã thanh toán</span>';
        } else {
            feeStatusCheck.innerHTML = '<span class="badge badge-overdue">Chưa thanh toán</span>';
            isEligible = false;
        }
        
        // Step 3: Populate room selector with available rooms for the student's gender
        populateRoomSelector(selectedStudent.gender);

        // Enable/disable approval button based on eligibility
        approveBtn.disabled = !isEligible;
        if (!isEligible) {
            rejectionReasonEl.textContent = "Sinh viên không đủ điều kiện. Chỉ có thể từ chối hồ sơ.";
            rejectionReasonEl.style.display = 'block';
        }
    }

    function populateRoomSelector(gender) {
        roomSelector.innerHTML = '<option value="">-- Chọn phòng --</option>';
        const availableRooms = rooms.filter(r => r.gender === gender && r.occupancy < r.capacity);
        
        availableRooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room.id;
            option.textContent = `Phòng ${room.id} (${room.occupancy}/${room.capacity})`;
            roomSelector.appendChild(option);
        });
    }

    approveBtn.addEventListener('click', function() {
        const selectedRoomId = roomSelector.value;
        if (!selectedStudent || !selectedRoomId) {
            alert('Vui lòng chọn sinh viên và phòng hợp lệ.');
            return;
        }

        if (confirm(`Xác nhận nhận phòng cho sinh viên ${selectedStudent.name} vào phòng ${selectedRoomId}?`)) {
            // --- STATE UPDATE LOGIC ---
            // 1. Remove student from pending list
            state.admin.pendingStudentList = state.admin.pendingStudentList.filter(s => s.id !== selectedStudent.id);
            
            // 2. Update room occupancy
            const roomToUpdate = state.admin.roomList.find(r => r.id === selectedRoomId);
            if (roomToUpdate) {
                roomToUpdate.occupancy++;
            }
            
            // 3. Update admin dashboard metrics
            state.admin.pendingRegistrations--;
            state.admin.availableSlots--;
            
            // 4. Save the updated state
            saveState(state);
            // --- END STATE UPDATE ---

            // Reset UI
            alert('Đã duyệt thành công!');
            verificationPanelEl.style.display = 'none';
            selectPromptEl.style.display = 'block';
            // Update the local variable before re-rendering
            pendingStudents = state.admin.pendingStudentList; 
            renderPendingList(); // Re-render the list
        }
    });

    rejectBtn.addEventListener('click', function() {
        if (!selectedStudent) return;
        if (prompt(`Nhập lý do từ chối hồ sơ của sinh viên ${selectedStudent.name}:`)) {
            // --- STATE UPDATE LOGIC ---
            state.admin.pendingStudentList = state.admin.pendingStudentList.filter(s => s.id !== selectedStudent.id);
            state.admin.pendingRegistrations--;
            saveState(state);
            // --- END STATE UPDATE ---
            
            alert('Đã từ chối hồ sơ.');
            verificationPanelEl.style.display = 'none';
            selectPromptEl.style.display = 'block';
            pendingStudents = state.admin.pendingStudentList;
            renderPendingList();
        }
    });

    // Initial Render
    renderPendingList();
});