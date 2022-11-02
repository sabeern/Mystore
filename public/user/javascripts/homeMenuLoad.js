function loadSubcategory(categoryId) {
    let subCategories='';
    let selectedCategory = 'Category';
    fetch('/loadSubcategory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ categoryId })
    }).then(res => res.json()).then(data => {
    let subCategory = data.subCategory;
    subCategories += `<ul style="display: block;"><li>
    <span class="text-danger" onclick="backToCategory()"><i class="fa fa-arrow-left"></i> Go Back</span></li>`;
    if (subCategory.length > 0) {
    subCategory.forEach((eachSubCategory)=> { 
    subCategories += `<li>
                        <a href="/category/${eachSubCategory._id}"> ${eachSubCategory.subCategoryName}</a>
                    </li>`;
                        selectedCategory = eachSubCategory.selectCategory[0].categoryName;
                 });
    subCategories += `</ul>`;
        } else {
                    subCategories += `<li><span>No Result</span></li></ul>`;
                }
            document.getElementById('innerCategory').innerHTML = subCategories;
            document.getElementById('selectedCategory').innerHTML = selectedCategory;
    });
}
function backToCategory() {
    let categories='';;
    fetch('/loadCategory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({  })
    }).then(res => res.json()).then(data => {
    let category = data.category;
    categories += `<ul style="display: block;">`;
    category.forEach((eachCategory)=> { 
        categories += `<li onclick="loadSubcategory('${eachCategory._id}')"><span>
                                ${eachCategory.categoryName}
                        </span></li>`;
                     });
        categories += `</ul>`;
    document.getElementById('innerCategory').innerHTML = categories;
    document.getElementById('selectedCategory').innerHTML = 'All Departments';
    });
}