// js/configuration.js

document.addEventListener('DOMContentLoaded', function() {
    // --- State Management Integration ---
    // Get the full, current state from localStorage.
    let state = getState();
    // Create local references for easier access to specific parts of the state.
    let params = state.admin.systemParameters;
    let log = state.admin.activityLog;

    // --- DOM Element Declarations ---
    const electricityInput = document.getElementById('electricity-price');
    const waterInput = document.getElementById('water-price');
    const room4Input = document.getElementById('room-price-4');
    const room8Input = document.getElementById('room-price-8');
    const saveBtn = document.getElementById('save-config-btn');
    const logBody = document.getElementById('activity-log-body');
    const adminNameEl = document.getElementById('admin-name');

    /**
     * Loads the current system parameters from the state into the input fields.
     */
    function loadParameters() {
        electricityInput.value = params.electricityPrice;
        waterInput.value = params.waterPrice;
        room4Input.value = params.roomPriceTier4;
        room8Input.value = params.roomPriceTier8;
    }

    /**
     * Renders the activity log from the state into the HTML table.
     * It reverses the log array to show the most recent changes first.
     */
    function renderActivityLog() {
        logBody.innerHTML = '';
        // Use [...log] to create a shallow copy before reversing, ensuring the original state is not mutated.
        [...log].reverse().forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.timestamp}</td>
                <td>${entry.user}</td>
                <td><strong>${entry.action}</strong></td>
                <td>${entry.details}</td>
            `;
            logBody.appendChild(row);
        });
    }

    /**
     * Handles the click event for the "Save Changes" button.
     * It compares old and new values, logs any differences, and updates the global state.
     */
    saveBtn.addEventListener('click', function() {
        // Parse new values from input fields as integers.
        const newElectricity = parseInt(electricityInput.value, 10);
        const newWater = parseInt(waterInput.value, 10);
        const newRoom4 = parseInt(room4Input.value, 10);
        const newRoom8 = parseInt(room8Input.value, 10);

        const changes = []; // An array to hold detected changes.

        // --- Compare each parameter and log changes ---
        if (params.electricityPrice !== newElectricity) {
            changes.push({ action: 'Cập nhật giá điện', details: `Giá cũ: ${params.electricityPrice}, Giá mới: ${newElectricity}` });
            params.electricityPrice = newElectricity; // Update local reference
        }
        if (params.waterPrice !== newWater) {
            changes.push({ action: 'Cập nhật giá nước', details: `Giá cũ: ${params.waterPrice}, Giá mới: ${newWater}` });
            params.waterPrice = newWater;
        }
        if (params.roomPriceTier4 !== newRoom4) {
            changes.push({ action: 'Cập nhật giá phòng 4 SV', details: `Giá cũ: ${params.roomPriceTier4}, Giá mới: ${newRoom4}` });
            params.roomPriceTier4 = newRoom4;
        }
        if (params.roomPriceTier8 !== newRoom8) {
            changes.push({ action: 'Cập nhật giá phòng 8 SV', details: `Giá cũ: ${params.roomPriceTier8}, Giá mới: ${newRoom8}` });
            params.roomPriceTier8 = newRoom8;
        }

        // --- If changes were detected, update the state ---
        if (changes.length > 0) {
            const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
            
            // Add each detected change to the main activity log in the state.
            changes.forEach(change => {
                state.admin.activityLog.push({
                    timestamp: timestamp,
                    user: state.admin.user.name,
                    action: change.action,
                    details: change.details
                });
            });
            
            // The `params` object was already updated, so we just need to update it in the main state.
            state.admin.systemParameters = params;
            
            // Save the entire modified state object back to localStorage.
            saveState(state);
            
            alert('Đã lưu các thay đổi thành công!');
            renderActivityLog(); // Re-render the log to show the new entries immediately.
        } else {
            alert('Không có thay đổi nào để lưu.');
        }
    });

    // --- Initial setup on page load ---
    adminNameEl.textContent = state.admin.user.name;
    loadParameters();
    renderActivityLog();
});