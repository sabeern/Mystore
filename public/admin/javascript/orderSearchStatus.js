function changeStatus(orderId,status) {
    document.getElementById('orderId').value = orderId;
    const statusField = document.getElementById('orderStatus');
    const updateButton = document.getElementById('confirmButton');
    if(status == 'approved') {
        statusField.innerHTML = `<option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="canceled">Canceled</option>`;
            updateButton.disabled = false;
    }else if(status == 'shipped') {
        statusField.innerHTML = `<option value="delivered">Delivered</option>
                                <option value="canceled">Canceled</option>`;
            updateButton.disabled = false;
    }else {
        updateButton.disabled = true;
    }
}
function deleteOrder(orderId) {
document.getElementById('deleteOrderId').value = orderId;
}
function sortOrder() {
const orderStatus = document.getElementById('orderSearchStatus').value;
const orderSearchContent = document.getElementById('orderSearchContent').value;
let table = '';
fetch('/admin/order/sortOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus,orderSearchContent })
        }).then(res => res.json()).then(data => {
            const sortedOrders = data.sortedOrders;
            table +=  `<table class="table lms_table_active">
                                        <thead>
                                            <tr>
                                                <th scope="col">Sl.No</th>
                                                <th scope="col">Order Id</th>
                                                <th scope="col">Ordered User</th>
                                                <th scope="col">Total Amount</th>
                                                <th scope="col">Order Status</th>
                                                <th scope="col">Delivery Date</th>
                                                <th scope="col">Change Status</th>
                                                <th scope="col">View</th>
                                                <th scope="col">Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody>`;
            if(sortedOrders.length > 0) {
                let count = 1;
                sortedOrders.forEach((order) => {
                    table += `<tr>
                                                    <th scope="row"> 
                                                        <span class="question_content">${count++}</span>
                                                    </th>
                                                    <td>
                                                        #${order.orderId}
                                                    </td>
                                                    <td>
                                                        ${order.user.userName}
                                                    </td>
                                                    <td>
                                                        ${order.totalAmount}
                                                    </td>
                                                    <td>
                                                        ${order.orderStatus}
                                                    </td>
                                                    <td>`;
                                                        let deliveryDate = order.deliveryDate;
                                                        deliveryDate = new Date(deliveryDate);
                                                        deliveryDate = deliveryDate.getFullYear()+'/'+(+deliveryDate.getMonth()+1)+'/'+(deliveryDate.getDate());
                                                        let dateNow = new Date();
                                                        let currentDate = dateNow.getFullYear()+'/'+(+dateNow.getMonth()+1)+'/'+(dateNow.getDate());
                                                        if(deliveryDate == currentDate & order.orderStatus == 'approved') {
                                                        table += `<span class="text-success">${deliveryDate}</span>`;
                                                            } else if(deliveryDate < currentDate & order.orderStatus == 'approved') { 
                                                                table += `<span class="text-danger">${deliveryDate}</span>`;
                                                                } else { 
                                                                    table += `${deliveryDate}`;
                                                                    }
                                            table += `</td>
                                                    <td>
                                                        <span class="badge rounded-pill pointer bg-primary" onclick="changeStatus('${order._id}','${order.orderStatus}')" 
                                                            data-toggle="modal" data-target="#statusModal">Change Status</span>
                                                    </td>
                                                    <td>
                                                        <a href="/admin/order/viewOrder/${order._id}">
                                                            <span class="badge rounded-pill pointer bg-primary">View</span>
                                                        </a>
                                                    </td>
                                                    <td>
                                                        <span class="badge rounded-pill pointer bg-danger" onclick="deleteOrder('${order._id}')" 
                                                            data-toggle="modal" data-target="#deleteModal">Delete</span>
                                                    </td>
                                                </tr>`;
                });
            }else {
                table += `<tr><td colspan="9">No result found</td></tr>`;
            }
            table += `<tbody></table>`;
            document.getElementById('orderTable').innerHTML = table;
            tableLoad1();
            tableLoad2();
            tableLoad3();
        });
}