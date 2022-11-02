function changeId(val) {
    document.getElementById('CategoryId').value = val;
}
const element = document.getElementById("confirmButton");
element.addEventListener("click", function () {
    let categoryDelete = document.getElementById('CategoryId').value;
    fetch('/admin/category/deleteCategory', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categoryDelete })
                }).then(res => res.json()).then(data => {
                    window.location = '/admin/category/categoryList';
                });
        });
function searchCategory() {
        const searchKeyword = document.getElementById('searchContent').value;
        let table = `<table class="table lms_table_active">
                        <thead>
                            <tr>
                                <th scope="col">Sl.No</th>
                                <th scope="col">Category Name</th>
                                <th scope="col">Edit</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>`;
        let count = 1;
        fetch('/admin/category/searchCategory', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ searchKeyword })
                    }).then(res => res.json()).then(data => {
                    let searchResult = data.searchedData;
                    console.log(searchResult.length);
                    searchResult.forEach(val => {
                        table += `<tr>
                                    <th scope="row"> <span class="question_content">${count++}</span></th>
                                    <td> ${val.categoryName}</td>
                                    <td>
                                        <form method="POST" action="/admin/category/editCategory">
                                            <input type="hidden" id="categoryEdit" name="categoryEdit" value="${val._id}">
                                            <button type="submit" class="badge rounded-pill bg-primary">Edit</button>
                                        </form>
                                    </td>
                                    <td>`;
                                    if(val.usedCategory.length > 0) { 
                        table += `<span class="badge rounded-pill bg-success">Used</span>`;
                                     } else { 
                        table += `<a href="#" onclick="changeId('${val._id}')" data-toggle="modal" data-target="#deleteConfirmModal" class="question_content">
                                        <span class="badge rounded-pill bg-danger">Delete</span>
                                    </a>`;
                                     } 
                        table += `</td></tr>`;
         });
            table += `</tbody></table>`;
        document.getElementById('categoryTable').innerHTML = table;;
                    tableLoad1();
                    tableLoad2();
                    tableLoad3();
        });
}
