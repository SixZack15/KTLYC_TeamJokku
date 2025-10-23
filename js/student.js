// js/student.js

document.addEventListener('DOMContentLoaded', function() {
    // Get the specific student's data using the new helper function
    const currentStudent = getCurrentStudent(); 

    // If no student is logged in, do nothing.
    if (!currentStudent) return;

    function populateDashboard() {
        document.querySelector('.user-profile span').textContent = currentStudent.name;

        if (currentStudent.hasRoom) {
            document.getElementById('room-info').style.display = 'block';
            document.getElementById('no-room-prompt').style.display = 'none';

            document.getElementById('building').textContent = currentStudent.roomInfo.building;
            document.getElementById('room-number').textContent = currentStudent.roomInfo.roomNumber;
            document.getElementById('room-type').textContent = currentStudent.roomInfo.roomType;
            document.getElementById('contract-days').textContent = currentStudent.contractDays;

            if (currentStudent.contractDays < 30) {
                const banner = document.getElementById('notification-banner');
                banner.textContent = `Hợp đồng của bạn sẽ hết hạn sau ${currentStudent.contractDays} ngày. Vui lòng gia hạn sớm.`;
                banner.style.display = 'block';
            }

            const unpaidInvoices = currentStudent.invoices.filter(inv => inv.status === 'Unpaid' || inv.status === 'Overdue');
            const totalDebt = unpaidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
            
            if (totalDebt > 0) {
                document.getElementById('total-debt').textContent = totalDebt.toLocaleString('vi-VN');
                document.getElementById('payment-deadline').textContent = unpaidInvoices[0]?.deadline || 'N/A';
            } else {
                document.getElementById('total-debt').textContent = "0";
                document.getElementById('fees-card').innerHTML += '<p style="color: var(--success-color);">Bạn không có công nợ.</p>';
            }

            const request = currentStudent.latestRequest;
            const statusEl = document.getElementById('request-status');
            document.getElementById('latest-request').innerHTML = `
                <p><strong>ID:</strong> ${request.id}</p>
                <p><strong>Loại:</strong> ${request.type}</p>
                <p><strong>Trạng thái:</strong> <span id="request-status" class="status-pending">${request.status}</span></p>
            `;
            
            if (request.status === 'Đã xử lý') document.getElementById('request-status').className = 'status-approved';
            else if (request.status === 'Bị từ chối') document.getElementById('request-status').className = 'status-rejected';
            else document.getElementById('request-status').className = 'status-pending';

        } else {
            // Hide all cards except the registration prompt
            document.querySelector('.cards-container').querySelectorAll('.card-info').forEach(card => {
                card.style.display = 'none';
            });
            const roomInfoCard = document.querySelector('.card-info'); // First card
            roomInfoCard.style.display = 'block';
            document.getElementById('room-info').style.display = 'none';
            document.getElementById('no-room-prompt').style.display = 'block';
        }
    }
    
    document.getElementById('fees-card').addEventListener('click', function() {
        window.location.href = 'fees.html';
    });
    
    populateDashboard();
});