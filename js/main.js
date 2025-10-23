// js/main.js

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const role = document.getElementById('role').value;

    if (role === 'student') {
        // --- SESSION SIMULATION ---
        // When a student logs in, we store their unique ID in sessionStorage.
        // For this prototype, we'll always log in as 'Nguyễn Văn A'.
        sessionStorage.setItem('currentUserId', 'std-nguyen-van-a');
        window.location.href = 'student/dashboard.html';
        // --- END SIMULATION ---
    } else if (role === 'admin') {
        // Clear any student session data if an admin logs in
        sessionStorage.removeItem('currentUserId');
        window.location.href = 'admin/dashboard.html';
    }
});