// js/fees.js

document.addEventListener('DOMContentLoaded', function() {
    // --- State Management Integration ---
    // Get the current shared state from localStorage.
    // All operations will read from and write back to this 'state' object.
    const currentUserId = sessionStorage.getItem('currentUserId');
    if (!currentUserId) return;

    let state = getState();
    let invoices = state.studentList[currentUserId].invoices;

    // --- DOM Element Declarations ---
    const invoiceTableBody = document.getElementById('invoice-table-body');
    const paymentAlert = document.getElementById('payment-alert');
    const invoiceListView = document.getElementById('invoice-list-view');
    const paymentGatewayView = document.getElementById('payment-gateway-view');
    const successModal = document.getElementById('success-modal');
    const gatewayInvoiceIdEl = document.getElementById('gateway-invoice-id');
    const gatewayAmountEl = document.getElementById('gateway-amount');
    const cancelPaymentBtn = document.getElementById('cancel-payment-btn');
    const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
    const closeModalBtn = document.querySelector('.close-modal');
    const closeSuccessModalBtn = document.getElementById('close-success-modal-btn');
    
    let currentInvoiceToPay = null; // To track which invoice is being paid

    /**
     * Renders the list of invoices from the current state into the HTML table.
     * It also checks for overdue invoices to display a warning banner.
     */
    function renderInvoices() {
        invoiceTableBody.innerHTML = '';
        let hasOverdue = false;

        invoices.forEach(inv => {
            const row = document.createElement('tr');
            let statusBadge = '';
            let actionBtn = '';

            if (inv.status === 'Paid') {
                statusBadge = '<span class="badge badge-paid">Đã thanh toán</span>';
                actionBtn = '<button class="btn btn-secondary btn-sm" disabled>Đã trả</button>';
            } else if (inv.status === 'Overdue') {
                statusBadge = '<span class="badge badge-overdue">Quá hạn</span>';
                actionBtn = `<button class="btn btn-sm pay-btn" data-id="${inv.id}">Thanh toán ngay</button>`;
                hasOverdue = true;
                row.classList.add('row-overdue'); // Visual flag for the entire row
            } else { // Unpaid
                statusBadge = '<span class="badge badge-unpaid">Chưa thanh toán</span>';
                actionBtn = `<button class="btn btn-sm pay-btn" data-id="${inv.id}">Thanh toán</button>`;
            }

            row.innerHTML = `
                <td><strong>${inv.id}</strong></td>
                <td>${inv.period}</td>
                <td>${inv.type}</td>
                <td style="font-weight: bold;">${inv.amount.toLocaleString('vi-VN')}</td>
                <td>${inv.deadline}</td>
                <td>${statusBadge}</td>
                <td>${actionBtn}</td>
            `;
            invoiceTableBody.appendChild(row);
        });

        // Toggle the alert banner based on overdue status (enforcing BR2)
        paymentAlert.style.display = hasOverdue ? 'block' : 'none';
    }

    /**
     * Handles clicks on the "Pay" buttons, finds the corresponding invoice,
     * and transitions the UI to the payment gateway view.
     */
    invoiceTableBody.addEventListener('click', function(e) {
        if (e.target.classList.contains('pay-btn')) {
            const invoiceId = e.target.dataset.id;
            currentInvoiceToPay = invoices.find(inv => inv.id === invoiceId);
            
            if (currentInvoiceToPay) {
                // Setup the payment gateway with the selected invoice's details
                gatewayInvoiceIdEl.textContent = currentInvoiceToPay.id;
                gatewayAmountEl.textContent = currentInvoiceToPay.amount.toLocaleString('vi-VN');
                
                // Switch views
                invoiceListView.style.display = 'none';
                paymentGatewayView.style.display = 'flex'; // Use flex to center the gateway
            }
        }
    });

    /**
     * Handles the payment confirmation process.
     */
    confirmPaymentBtn.addEventListener('click', function() {
        // Simulate a processing delay for realism
        const btn = this;
        btn.textContent = 'Đang xử lý...';
        btn.disabled = true;

        setTimeout(() => {
            // --- CORE STATE UPDATE LOGIC ---
            if (currentInvoiceToPay) {
                // 1. Find the invoice in our local array and update its status
                const invoiceToUpdate = invoices.find(inv => inv.id === currentInvoiceToPay.id);
                if (invoiceToUpdate) {
                    invoiceToUpdate.status = 'Paid';
                }
                
                // 2. Recalculate if the student still has outstanding fees
                const hasRemainingDebt = invoices.some(inv => inv.status === 'Unpaid' || inv.status === 'Overdue');
                
                // 3. Update the main state object with the modified data
                state.studentList[currentUserId].invoices = invoices;
                state.studentList[currentUserId].hasOutstandingFees = hasRemainingDebt;
                
                // 4. Save the entire updated state back to localStorage
                saveState(state);
            }
            // --- END OF STATE UPDATE LOGIC ---

            renderInvoices(); // Re-render the table to reflect the change

            // Reset the gateway view and button
            paymentGatewayView.style.display = 'none';
            invoiceListView.style.display = 'block';
            btn.textContent = 'Xác nhận thanh toán';
            btn.disabled = false;

            // Show the success modal
            successModal.style.display = 'flex';
        }, 1500);
    });

    /**
     * Handles canceling the payment process and returning to the invoice list.
     */
    cancelPaymentBtn.addEventListener('click', function() {
        paymentGatewayView.style.display = 'none';
        invoiceListView.style.display = 'block';
    });

    /**
     * Handles closing the success modal.
     */
    function closeModal() {
        successModal.style.display = 'none';
    }
    closeModalBtn.addEventListener('click', closeModal);
    closeSuccessModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === successModal) {
            closeModal();
        }
    });

    // --- Initial Execution ---
    // Render the invoices based on the current state when the page loads.
    renderInvoices();
});