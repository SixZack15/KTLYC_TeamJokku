// js/payment_confirm.js

document.addEventListener('DOMContentLoaded', function() {
    const state = getState();
    const studentList = state.studentList;
    const adminUser = state.admin.user;

    const studentFilterEl = document.getElementById('student-filter');
    const statusFilterEl = document.getElementById('status-filter');
    const tableBodyEl = document.getElementById('invoices-table-body');
    
    let allInvoices = [];

    /**
     * Flattens the invoice data from the nested studentList into a single array.
     * Each invoice object is augmented with the student's ID and name.
     */
    function aggregateAllInvoices() {
        allInvoices = [];
        for (const studentId in studentList) {
            const student = studentList[studentId];
            student.invoices.forEach(invoice => {
                allInvoices.push({
                    ...invoice,
                    studentId: studentId,
                    studentName: student.name
                });
            });
        }
        // Sort by due date, most recent first
        allInvoices.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
    }

    /**
     * Populates the student filter dropdown with all students from the state.
     */
    function populateFilters() {
        for (const studentId in studentList) {
            const student = studentList[studentId];
            const option = document.createElement('option');
            option.value = studentId;
            option.textContent = student.name;
            studentFilterEl.appendChild(option);
        }
    }

    /**
     * Renders a given array of invoice objects into the data table.
     * @param {Array} invoicesToDisplay - The array of invoices to render.
     */
    function renderTable(invoicesToDisplay) {
        tableBodyEl.innerHTML = '';

        if (invoicesToDisplay.length === 0) {
            const row = tableBodyEl.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 6;
            cell.textContent = 'Không tìm thấy hoá đơn nào phù hợp.';
            cell.style.textAlign = 'center';
            return;
        }

        invoicesToDisplay.forEach(inv => {
            const row = tableBodyEl.insertRow();
            if (inv.status === 'Overdue') {
                row.classList.add('row-overdue');
            }

            let statusBadge = '';
            if (inv.status === 'Paid') statusBadge = '<span class="badge badge-paid">Đã thanh toán</span>';
            else if (inv.status === 'Unpaid') statusBadge = '<span class="badge badge-unpaid">Chưa thanh toán</span>';
            else if (inv.status === 'Overdue') statusBadge = '<span class="badge badge-overdue">Quá hạn</span>';

            row.innerHTML = `
                <td><strong>${inv.id}</strong></td>
                <td>${inv.studentName}</td>
                <td>${inv.period}</td>
                <td style="font-weight: bold;">${inv.amount.toLocaleString('vi-VN')}</td>
                <td>${inv.deadline}</td>
                <td>${statusBadge}</td>
            `;
        });
    }

    /**
     * Applies the current filter selections to the master invoice list
     * and calls the render function with the result.
     */
    function applyFilters() {
        const selectedStudent = studentFilterEl.value;
        const selectedStatus = statusFilterEl.value;

        let filteredInvoices = allInvoices;

        // Apply student filter
        if (selectedStudent !== 'all') {
            filteredInvoices = filteredInvoices.filter(inv => inv.studentId === selectedStudent);
        }

        // Apply status filter
        if (selectedStatus !== 'all') {
            filteredInvoices = filteredInvoices.filter(inv => inv.status === selectedStatus);
        }

        renderTable(filteredInvoices);
    }

    // --- Initial Setup ---
    document.getElementById('admin-name').textContent = adminUser.name;
    
    aggregateAllInvoices();
    populateFilters();
    renderTable(allInvoices); // Initial render with all invoices

    // --- Event Listeners ---
    studentFilterEl.addEventListener('change', applyFilters);
    statusFilterEl.addEventListener('change', applyFilters);
});