// js/checkout_request.js

document.addEventListener('DOMContentLoaded', function() {
    // Get the student's status directly from the persistent state
    const currentUserId = sessionStorage.getItem('currentUserId');
    if (!currentUserId) return;

    let state = getState();
    const studentStatus = state.studentList[currentUserId]; // Get the correct student

    const form = document.getElementById('checkout-form');
    const submitBtn = document.getElementById('submit-checkout-btn');
    const alertBox = document.getElementById('prerequisite-alert-checkout');
    const requestView = document.getElementById('checkout-request-view');
    const statusView = document.getElementById('status-view-checkout');

    function checkPrerequisites() {
        // The check now uses the REAL, persistent state
        if (studentStatus.hasOutstandingFees) {
            alertBox.innerHTML = `<strong>Không thể gửi yêu cầu:</strong> Bạn vẫn còn công nợ chưa thanh toán. Vui lòng <a href="fees.html">hoàn thành tất cả các khoản phí</a> trước khi làm thủ tục trả phòng.`;
            alertBox.style.display = 'block';
            submitBtn.disabled = true;
            Array.from(form.elements).forEach(el => el.disabled = true);
        } else {
            alertBox.style.display = 'none';
            submitBtn.disabled = false;
        }
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (document.getElementById('departure-date').value && document.getElementById('checkout-reason').value) {
            // Simulate successful submission and show the next step notification
            requestView.style.display = 'none';
            statusView.style.display = 'block';
        } else {
            alert('Vui lòng điền đầy đủ thông tin.');
        }
    });

    checkPrerequisites();
});