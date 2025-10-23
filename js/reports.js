// js/reports.js

document.addEventListener('DOMContentLoaded', function() {
    const state = getState();
    
    const generateBtn = document.getElementById('generate-report-btn');
    const reportOutput = document.getElementById('report-output');
    const reportTitleEl = document.getElementById('report-title-output');
    const reportRangeEl = document.getElementById('report-range-output');
    const downloadPdfBtn = document.getElementById('download-pdf-btn');
    const downloadExcelBtn = document.getElementById('download-excel-btn');

    generateBtn.addEventListener('click', function() {
        const reportType = document.getElementById('report-type').value;
        const dateRange = document.getElementById('date-range').value;

        // Simulate data aggregation
        this.textContent = 'Đang tạo...';
        this.disabled = true;

        setTimeout(() => {
            reportTitleEl.textContent = reportType;
            reportRangeEl.textContent = dateRange;
            reportOutput.style.display = 'block';
            
            this.textContent = 'Tạo báo cáo';
            this.disabled = false;
        }, 1000);
    });

    downloadPdfBtn.addEventListener('click', () => alert('Đang mô phỏng tải xuống tệp PDF...'));
    downloadExcelBtn.addEventListener('click', () => alert('Đang mô phỏng tải xuống tệp Excel...'));

    document.getElementById('admin-name').textContent = state.admin.user.name;
});