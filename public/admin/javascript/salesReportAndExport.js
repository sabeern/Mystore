function ExportToExcel(type, fn, dl) {
    var elt = document.getElementById('tbl_exporttable_to_xls');
    var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
    return dl ?
        XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }) :
        XLSX.writeFile(wb, fn || ('SalesReport'+Date.now()+'.' + (type || 'xlsx')));
}
function ExportToPdf() {
    html2canvas(document.getElementById('tbl_exporttable_to_xls'), {
        onrendered: function (canvas) {
            var data = canvas.toDataURL();
            var docDefinition = {
                content: [{
                    image: data,
                    width: 500
                }]
            };
            pdfMake.createPdf(docDefinition).download('SalesReport'+Date.now()+'.pdf');
        }
    });
}
function showReport() {
    let resultTable = '',resFlag = 0;
    const months = [ "January", "February", "March", "April", "May", "June", 
       "July", "August", "September", "October", "November", "December" ];
    let startDate = document.getElementById('startDate').value;
    let endDate = document.getElementById('endDate').value;
    let reportType = document.getElementById('reportType').value;
    fetch('/admin/salesReport/generateReport', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ startDate, endDate, reportType })
    }).then(res => res.json()).then(data => { 
        resultTable += `<button onclick="ExportToExcel('xlsx')">Export report to excel</button>
                         <button onclick="ExportToPdf()" id="btnExport">Export report to pdf</button>`;
        if(data.monthlySale.length>0) {
            resFlag = 1;
            resultTable += `<table class="table lms_table_active" id="tbl_exporttable_to_xls">
                            <thead>
                                <tr>
                                    <th scope="col">Sl.No</th>
                                    <th scope="col">Month</th>
                                    <th scope="col">Sale Amount</th>
                                </tr>
                            </thead><tbody>`;
                let count = 1;
                let monthlySale = data.monthlySale;
           monthlySale.forEach((saleValue)=> {
            let salesDate = saleValue._id;
            let newMonth = salesDate.substr(5,2);
            resultTable += `<tr><td>${count++}</td><td>${salesDate.substr(0,4)} / ${months[newMonth-1]}</td><td>${saleValue.sales}</td></tr>`;
           });
           resultTable += `</tbody></table>`;
        }
        if(data.customerSale.length > 0) {
            resFlag = 1;
            resultTable += `<table class="table lms_table_active" id="tbl_exporttable_to_xls">
                            <thead>
                                <tr>
                                    <th scope="col">Sl.No</th>
                                    <th scope="col">Customer Name</th>
                                    <th scope="col">Purchase Amount</th>
                                    <th scope="col">Contact Number</th>
                                    <th scope="col">Email</th>
                                </tr>
                            </thead><tbody>`;
                                let count = 1;
                let customerSale = data.customerSale;
                customerSale.forEach((saleValue)=> {
            resultTable += `<tr><td>${count++}</td><td>${saleValue.customer[0].userName}</td><td>${saleValue.totalPurchase}</td>
                            <td>${saleValue.customer[0].userMobile}</td><td>${saleValue.customer[0].userEmail}</td></tr>`;
           });
           resultTable += `</tbody></table>`;
        }
        if(data.categorySale.length > 0) {
            resFlag = 1;
            resultTable += `<table class="table lms_table_active" id="tbl_exporttable_to_xls">
                            <thead>
                                <tr>
                                    <th scope="col">Sl.No</th>
                                    <th scope="col">Category Name</th>
                                    <th scope="col">Sales Value</th>
                                </tr>
                            </thead><tbody>`;
                                let count = 1;
                let categorySale = data.categorySale;
                categorySale.forEach((saleValue)=> {
            resultTable += `<tr><td>${count++}</td><td>${saleValue.category.categoryName}</td><td>${saleValue.categorySale}</td></tr>`;
           });
           resultTable += `</tbody></table>`;
        }
        if(resFlag == 0) {
            resultTable = '';
        }
        document.getElementById('reportTable').innerHTML = resultTable;
        tableLoad1();
            tableLoad2();
            tableLoad3();
    });
}