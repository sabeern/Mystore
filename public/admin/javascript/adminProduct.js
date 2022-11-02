const category = document.getElementById("categoryId");
category.addEventListener("change", function () {
    let categoryId = category.value;
    const subCategoryField = document.getElementById('subcategory');
    let option = '';
    fetch('/admin/product/loadSubcategory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId })
    }).then(res => res.json()).then(data => {
        let subCategory = data.subCategory;
        if (subCategory.length > 0) {
            option+=`<select id="subCategoryId" name="productSubCategoryId" class="form-control">`;
            subCategory.forEach((eachSubCategory) => {
                option += `<option value="${eachSubCategory._id}">${eachSubCategory.subCategoryName}</option>`;
            });
            option += `</select>`;
            subCategoryField.innerHTML = option;
        } else {
            subCategoryField.innerHTML = `<select id="subCategoryId" name="productSubCategoryId" class="form-control"><option value="">Choose..</option></select>`;
        }

    });
});
document.getElementById('requiredErr').style.display = 'none';
function validateForm() {
    let errFlag = 0;
    let productName = document.getElementById('productName').value;
    productName = productName.trim();
    if(productName.length < 5) {
        document.getElementById('nameErr').innerHTML = ' *required';
        errFlag = 1;
    }else {
        document.getElementById('nameErr').innerHTML = '';
    }
    let productDescription = document.getElementById('productDescription').value;
    productDescription = productDescription.trim();
    if(productDescription.length < 5) {
        document.getElementById('descriptionErr').innerHTML = ' *required';
        errFlag = 1;
    }else {
        document.getElementById('descriptionErr').innerHTML = '';
    }
    let category = document.getElementById('categoryId').value;
    category = category.trim();
    if(!category) {
        document.getElementById('categoryErr').innerHTML = ' *required';
        errFlag = 1;
    }else {
        document.getElementById('categoryErr').innerHTML = '';
    }
    let subCategory = document.getElementById('subCategoryId').value;
    subCategory = subCategory.trim();
    if(!subCategory) {
        document.getElementById('subCategoryErr').innerHTML = ' *required';
        errFlag = 1;
    }else {
        document.getElementById('subCategoryErr').innerHTML = '';
    }
    let brand = document.getElementById('productBrandId').value;
    brand = brand.trim();
    if(!brand) {
        document.getElementById('brandErr').innerHTML = ' *required';
        errFlag = 1;
    }else {
        document.getElementById('brandErr').innerHTML = '';
    }
    let stock = document.getElementById('productStock').value;
    stock = stock.trim();
    const numbers = /^[0-9.]+$/;
    if(!stock.match(numbers) | stock.length < 1) {
        document.getElementById('stockErr').innerHTML = ' *required';
        errFlag = 1;
    }else {
        document.getElementById('stockErr').innerHTML = '';
    }
    let mrp = document.getElementById('productMrp').value;
    mrp = mrp.trim();
    if(!mrp.match(numbers) | mrp.length < 1) {
        document.getElementById('mrpErr').innerHTML = ' *required';
        errFlag = 1;
    }else {
        document.getElementById('mrpErr').innerHTML = '';
    }
    let sellingPrice = document.getElementById('productPrice').value;
    sellingPrice = sellingPrice.trim();
    if(!sellingPrice.match(numbers) | sellingPrice.length < 1) {
        document.getElementById('priceErr').innerHTML = ' *required';
        errFlag = 1;
    }else {
        document.getElementById('priceErr').innerHTML = '';
    }
    if(errFlag == 1) {
        document.getElementById('requiredErr').style.display = 'block';
        return false;
    }
}
function changeId(val) {
    document.getElementById('productId').value = val;
}

function searchProduct() {
    const searchKeyword = document.getElementById('searchContent').value;
    let table = `<table class="table lms_table_active">
                    <thead>
                        <tr>
                            <th scope="col">Sl.No</th>
                            <th scope="col">Product Name</th>
                            <th scope="col">Product Category</th>
                            <th scope="col">Product Sub-Category</th>
                            <th scope="col">Stock</th>
                            <th scope="col">Price</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead><tbody>`;
    let count = 1;
    fetch('/admin/product/searchProduct', {
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
                                <td>${val.productName}</td>
                                <td>`;
                                    if(val.category[0]){ 
                    table += `${val.category[0].categoryName}`; 
                        } 
                    table += `</td><td>`;
                         if(val.subCategory[0]){ 
                    table += `${val.subCategory[0].subCategoryName}`;
                        } 
                    table += `</td><td>${val.productStock}</td>
                            <td>${val.productPrice}</td>
                            <td>
                                <form method="post" action="/admin/product/editProduct">
                                    <input type="hidden" id="productEdit" name="productEdit" value="${val._id}">
                                    <button type="submit" class="badge rounded-pill bg-primary">Edit</button>
                                </form>
                            </td>
                            <td>
                                <a href="#" onclick="changeId('${val._id}')" data-toggle="modal"
                                    data-target="#productDeleteModal" class="question_content">
                                    <span class="badge rounded-pill bg-danger">Delete</span>
                                </a>
                            </td></tr>`;
     });
        table += `</tbody></table>`;
    document.getElementById('productTable').innerHTML = table;
                tableLoad1();
                tableLoad2();
                tableLoad3();
    });
}

