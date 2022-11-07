function showDetails(userId) {
    let details = `<table class="table table-bordered"><tbody>`;            
    fetch('/admin/user/viewDetails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
    }).then(res => res.json()).then(data => {
        const user = data.user;
        details += `<tr><th>Fullname</th><td>${user.userName}</td></tr>
                    <tr><th>User Email</th><td>${user.userEmail}</td></tr>
                    <tr><th>User Mobile</th><td>${user.userMobile}</td></tr>
                    <tr><th>User Status</th><td>${user.userStatus}</td></tr>
                    <tr><th>User Type</th><td>${user.userType}</td></tr>`;
                    if(user.userAddress.length > 0) {
                        for(i=0;i<user.userAddress.length;i++) {
                            if(i==0) {
                                details += `<tr><th>User Addresses</th>
                                <td>${user.userAddress[i].fullName} - ${user.userAddress[i].mobileNumber}<br/>
                                    ${user.userAddress[i].locality}, ${user.userAddress[i].address}, ${user.userAddress[i].pincode}<br/>
                                    ${user.userAddress[i].district}, ${user.userAddress[i].state}</td></tr>`;
                            }else {
                                details += `<tr><th></th>
                                    <td>${user.userAddress[i].fullName} - ${user.userAddress[i].mobileNumber}<br/>
                                    ${user.userAddress[i].locality}, ${user.userAddress[i].address}, ${user.userAddress[i].pincode}<br/>
                                    ${user.userAddress[i].district}, ${user.userAddress[i].state}</td></tr>`
                            }  
                        }
                    }
        details += `</tbody></table>`;
        document.getElementById('userDetails').innerHTML = details;
     })
}
function blockConfirm(userId,userStatus,userName) {
document.getElementById('userId').value = userId;
document.getElementById('userStatus').value = userStatus;
let blockStatus;
if(userStatus == 'active') {
    blockStatus = 'block';
}else {
    blockStatus = 'unblock';
}
document.getElementById('blockDetails').innerHTML = blockStatus+' '+userName;
}
function searchUser() {
const searchUserContent = document.getElementById('searchUserContent').value;
let table = '';
fetch('/admin/user/searchUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchUserContent })
        }).then(res => res.json()).then(data => {
            const matchingUser = data.matchingUser;
            table += `<table class="table lms_table_active">
                                        <thead>
                                            <tr>
                                                <th scope="col">Sl.No</th>
                                                <th scope="col">Fullname</th>
                                                <th scope="col">Email</th>
                                                <th scope="col">Mobile Number</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">View</th>
                                                <th scope="col">Change</th>
                                            </tr>
                                        </thead>
                                        <tbody>`;
            if(matchingUser.length > 0) {
                let count = 1;
                matchingUser.forEach((user)=> {
                    table += `<tr>
                                                    <th scope="row"> 
                                                        <span class="question_content">${count++}</span>
                                                    </th>
                                                    <td>
                                                        ${user.userName}
                                                    </td>
                                                    <td>
                                                        ${user.userEmail}
                                                    </td>
                                                    <td>
                                                        ${user.userMobile}
                                                    </td>
                                                    <td>`;
                                                    if(user.userStatus == 'active'){
                                                        table += `<span class="badge rounded-pill bg-success">${user.userStatus}</span>`;
                                                            } else {
                                                              table += `<span class="badge rounded-pill bg-danger">${user.userStatus}</span>`;
                                                                }
                                        table += `</td>
                                                    <td>
                                                            <button type="button" onclick="showDetails('${user._id}')" data-toggle="modal" data-target="#userViewModal" class="badge rounded-pill bg-primary">View Details</button>
                                                    </td>
                                                    <td>
                                                            <span class="badge rounded-pill bg-danger" onclick="blockConfirm('${user._id}','${user.userStatus}','${user.userName}')" data-toggle="modal" data-target="#blockConfirmModal" style="cursor:pointer;">Block/Unblock</span>
                                                    </td>
                                                </tr>`;
                });
            }else {
                table += `<tr><td colspan="7">No result found</td></tr>`;
            }
            table += `</tbody></table>`;
            console.log(table);
        document.getElementById('userTable').innerHTML = table;
        tableLoad1();
            tableLoad2();
            tableLoad3();
        });
}