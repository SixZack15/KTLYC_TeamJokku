// js/admin.js

document.addEventListener('DOMContentLoaded', function() {
    // Get the shared state from the state manager
    const adminState = getState().admin;

    function populateDashboard() {
        // Set user name in header
        document.getElementById('admin-name').textContent = adminState.user.name;

        // Populate metric cards from the shared state
        document.getElementById('pending-registrations-count').textContent = adminState.pendingRegistrations;
        document.getElementById('pending-transfers-count').textContent = adminState.pendingTransfers;
        document.getElementById('available-slots-count').textContent = adminState.availableSlots;
        document.getElementById('expiring-contracts-count').textContent = adminState.expiringContracts;
        
        // Add interactivity to the cards
        document.getElementById('pending-registrations-card').addEventListener('click', () => {
            window.location.href = 'review_registrations.html';
        });
        document.getElementById('pending-transfers-card').addEventListener('click', () => {
            window.location.href = 'handle_transfer.html';
        });

        // Visually emphasize cards that have actionable items
        if (adminState.pendingRegistrations === 0) {
            document.getElementById('pending-registrations-card').style.opacity = '0.7';
        }
         if (adminState.pendingTransfers === 0) {
            document.getElementById('pending-transfers-card').style.opacity = '0.7';
        }
    }

    // Initial population of the dashboard
    populateDashboard();
});