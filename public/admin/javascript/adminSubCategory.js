function changeId(val) {
        document.getElementById('subCategoryId').value = val;
    }
const element = document.getElementById("confirmButton");
element.addEventListener("click", function () {
        let subCategoryDelete = document.getElementById('subCategoryId').value;
        fetch('/admin/subCategory/deleteSubCategory', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subCategoryDelete })
                }).then(res => res.json()).then(data => {
                    window.location = '/admin/subCategory/subCategoryList';
                })
            });
            function validateSubCategory() {
                let errFlag = 0;
                let validateCategory = document.getElementById('categoryId').value;
                let validateSubcategoryName = document.getElementById('subCategoryText').value;
                validateSubcategoryName = validateSubcategoryName.trim();
                let subcategoryImage = document.getElementById('subCategoryImage').value;
                if(validateCategory.length < 1) {
                    document.getElementById('categoryErr').innerHTML = '* required';
                    errFlag=1;
                }else {
                    document.getElementById('categoryErr').innerHTML = ''
                }
                if(validateSubcategoryName.length < 1) {
                    document.getElementById('subCategoryErr').innerHTML = '* required';
                    errFlag=1;
                }else {
                    document.getElementById('subCategoryErr').innerHTML = ''
                }
                if(subcategoryImage.length < 1) {
                    document.getElementById('subImageErr').innerHTML = '* required';
                    errFlag=1;
                }else {
                    document.getElementById('subImageErr').innerHTML = ''
                }
                if(errFlag == 1) {
                    return false;
                }
            }
            function searchSubCategory() {
                const searchKeyword = document.getElementById('searchContent').value;
                let table = `<table class="table lms_table_active">
                                <thead>
                                    <tr>
                                        <th scope="col">Sl.No</th>
                                        <th scope="col">Sub-Category Name</th>
                                        <th scope="col">Category</th>
                                        <th scope="col">Edit</th>
                                        <th scope="col">Delete</th>
                                    </tr>
                                </thead><tbody>`;
                let count = 3;
                fetch('/admin/subCategory/searchSubCategory', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ searchKeyword })
                        }).then(res => res.json()).then(data => {
                        let searchResult = data.searchedData;
                        searchResult.forEach(val => {
                            table += `<tr>
                                        <th scope="row"> 
                                            <span class="question_content">${count++}</span>
                                        </th>
                                        <td>${val.subCategoryName}</td>
                                        <td>${val.category[0].categoryName}</td>
                                        <td>
                                            <form method="POST" action="/admin/subCategory/editSubCategory">
                                                <input type="hidden" id="subCategoryEdit" name="subCategoryEdit" value="${val._id}">
                                                <button type="submit" class="badge rounded-pill bg-primary">Edit</button>
                                            </form>
                                        </td>
                                        <td>`;
                                            if(val.usedSubcategory.length < 1) { 
                            table += `<a href="#" onclick="changeId('${val._id}')" data-toggle="modal"
                                            data-target="#subCategoryDeleteConfirm" class="question_content">
                                        <span class="badge rounded-pill bg-danger">Delete</span></a>`;
                                         } else { 
                            table += `<span class="badge rounded-pill bg-success">Used</span></a>`;
                                            } 
                            table += `</td></tr>`;
                            });
                            table += `</tbody></table>`;
                            document.getElementById('subCategoryTable').innerHTML = table;
                                tableLoad1();
                                tableLoad2();
                                tableLoad3();
                })
        }
