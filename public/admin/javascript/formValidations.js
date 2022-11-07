function validateCategory() {
    let errFlag = 0;
    let categoryName = document.getElementById('categoryName').value;
        categoryName = categoryName.trim();
        if(categoryName.length < 1) {
            errFlag = 1;
            document.getElementById('categoryErr').innerHTML = '* required';
        }else {
            document.getElementById('categoryErr').innerHTML = '';
        }
        if(errFlag == 1) {
            return false;
        }
}
function validateSubCategoryEdit() {
    let errFlag = 0;
    let validateCategory = document.getElementById('selectCategory').value;
    let validateSubcategoryName = document.getElementById('subCategoryText').value;
    validateSubcategoryName = validateSubcategoryName.trim();
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
    if(errFlag == 1) {
            return false;
        }
}
function validateBrand() {
    let errFlag = 0;
    let brandName = document.getElementById('brandName').value;
        brandName = brandName.trim();
        if(brandName.length < 1) {
            errFlag = 1;
            document.getElementById('brandErr').innerHTML = '* required';
        }else {
            document.getElementById('brandErr').innerHTML = '';
        }
        if(errFlag == 1) {
            return false;
        }
}