// js/incident_report.js

document.addEventListener('DOMContentLoaded', function() {
    const currentUserId = sessionStorage.getItem('currentUserId');
    if (!currentUserId) return;

    let state = getState();

    const form = document.getElementById('incident-form');
    const reportView = document.getElementById('report-view');
    const statusView = document.getElementById('status-view');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const incidentType = document.getElementById('incident-type').value;
        const incidentDetails = document.getElementById('incident-details').value;

        if (incidentType && incidentDetails) {
            // --- STATE UPDATE LOGIC ---
            const newRequestId = '#YC-' + Math.floor(100 + Math.random() * 900);
            const newRequest = {
                id: newRequestId,
                type: 'Báo cáo sự cố',
                status: 'Chờ xử lý'
            };

            state.studentList[currentUserId].latestRequest = newRequest;
            saveState(state);
            // --- END OF STATE UPDATE LOGIC ---

            // Switch views to show confirmation
            reportView.style.display = 'none';
            statusView.style.display = 'block';
        } else {
            alert('Vui lòng điền đầy đủ các trường bắt buộc.');
        }
    });
});