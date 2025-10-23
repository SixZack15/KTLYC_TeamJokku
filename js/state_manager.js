// js/state_manager.js

// ... (initialState object remains the same as the last update)
const initialState = {
    studentList: {
        'std-nguyen-van-a': { name: 'Nguyễn Văn A', hasRoom: true, contractDays: 25, hasOutstandingFees: true, roomInfo: { building: 'A', roomNumber: 'A201', roomType: 'Phòng 4 SV' }, invoices: [ { id: 'HD-1023', period: 'Tháng 10/2025', type: 'Tiền phòng + Điện/Nước', amount: 750000, deadline: '25/10/2025', status: 'Unpaid' }, { id: 'HD-0923', period: 'Tháng 09/2025', type: 'Tiền phòng + Điện/Nước', amount: 820000, deadline: '25/09/2025', status: 'Overdue' }, { id: 'HD-0823', period: 'Tháng 08/2025', type: 'Tiền phòng + Điện/Nước', amount: 780000, deadline: '25/08/2025', status: 'Paid' } ], latestRequest: { id: '#YC-105', type: 'Chuyển phòng', status: 'Đã xử lý' } },
        'std-tran-thi-b': {
            name: 'Trần Thị B', hasRoom: true, contractDays: 150, hasOutstandingFees: true,
            roomInfo: { building: 'B', roomNumber: 'B301', roomType: 'Phòng 8 SV' },
            invoices: [
                { id: 'HD-1023-B', period: 'Tháng 10/2025', type: 'Tiền phòng + Điện/Nước', amount: 950000, deadline: '25/10/2025', status: 'Unpaid' },
                { id: 'HD-0923-B', period: 'Tháng 09/2025', type: 'Tiền phòng + Điện/Nước', amount: 910000, deadline: '25/09/2025', status: 'Overdue' },
                { id: 'HD-0823-B', period: 'Tháng 08/2025', type: 'Tiền phòng + Điện/Nước', amount: 880000, deadline: '25/08/2025', status: 'Paid' }
            ],
            latestRequest: {}
        }
    },
    admin: {
        systemParameters: {
            electricityPrice: 3500, // VND per kWh
            waterPrice: 15000, // VND per m³
            roomPriceTier4: 1200000, // VND for 4-person room
            roomPriceTier8: 900000, // VND for 8-person room
        },
        activityLog: [
            {
                timestamp: '2025-10-22 10:30:15',
                user: 'Chị B',
                action: 'Cập nhật giá điện',
                details: 'Giá cũ: 3200, Giá mới: 3500'
            }
        ],
        pendingRegistrations: 2, pendingTransfers: 1, 
        pendingCheckouts: 1, // Add metric for the dashboard (optional but good practice)
        pendingCheckoutList: [
            {
                requestId: 'co-001',
                studentId: 'std-nguyen-van-a', // Links to our main student
                studentName: 'Nguyễn Văn A',
                roomId: 'A201',
                departureDate: '2025-11-15',
                reason: 'Đã tốt nghiệp.'
            }
        ],
        expiringContracts: 0, availableSlots: 13, user: { name: 'Chị B' },
        pendingStudentList: [ { id: 'std-001', name: 'Trần Thị B', studentId: '2173402010101', statusOk: true, feeOk: true, gender: 'Nữ' }, { id: 'std-002', name: 'Lê Văn C', studentId: '2173402010202', statusOk: true, feeOk: false, gender: 'Nam' } ],
        pendingTransferList: [ { requestId: 'tr-001', studentId: 'std-nguyen-van-a', studentName: 'Nguyễn Văn A', currentRoomId: 'A201', desiredRoomId: 'C102', reason: 'Muốn ở cùng tầng với bạn bè để tiện học nhóm và trao đổi bài vở.', feeOk: true } ],
        roomList: [ { id: 'A201', location: 'Cơ sở 1', gender: 'Nam', capacity: 4, occupancy: 3 }, { id: 'A202', location: 'Cơ sở 1', gender: 'Nam', capacity: 4, occupancy: 4 }, { id: 'B301', location: 'Cơ sở 1', gender: 'Nữ', capacity: 8, occupancy: 6 }, { id: 'C102', location: 'Cơ sở 3', gender: 'Nữ', capacity: 4, occupancy: 2 } ]
    }
};


function getState() {
    const state = localStorage.getItem('vluKtxState');
    if (state) { return JSON.parse(state); } 
    else { localStorage.setItem('vluKtxState', JSON.stringify(initialState)); return initialState; }
}

function saveState(newState) {
    localStorage.setItem('vluKtxState', JSON.stringify(newState));
}

function resetState() {
    localStorage.setItem('vluKtxState', JSON.stringify(initialState));
    alert('Trạng thái của trang web đã được reset về mặc định.');
    location.reload();
}

// --- NEW HELPER FUNCTION ---
/**
 * Gets the full state and returns the object for the currently logged-in student.
 * @returns {object|null} The student object or null if not logged in.
 */
function getCurrentStudent() {
    const currentUserId = sessionStorage.getItem('currentUserId');
    if (!currentUserId) {
        // Redirect to login if trying to access a page without being logged in
        // alert("Bạn chưa đăng nhập. Đang chuyển hướng về trang đăng nhập.");
        // window.location.href = '../index.html';
        return null;
    }
    const state = getState();
    return state.studentList[currentUserId];
}
// --- END NEW FUNCTION ---

(function initialize() {
    if (!localStorage.getItem('vluKtxState')) { saveState(initialState); }
})();