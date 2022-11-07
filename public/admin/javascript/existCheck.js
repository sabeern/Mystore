
        function checkCategory() {
            let categoryName = document.getElementById('categoryName').value;
            let displayContent = document.getElementById('checkResult');
            let submitButton = document.getElementById('submitButton');
            fetch('/admin/category/existCategory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categoryName })
            }).then(res => res.json()).then(data => {
                let searchResult = data.searchResult;
                if (searchResult.length < 1) {
                    displayContent.style.display = 'none';
                    submitButton.disabled = false;
                    return;
                }
                displayContent.style.display = 'block';
                displayContent.innerHTML = ` <div class="alert alert-danger" role="alert">
                            Category already exist
                          </div>`;
                submitButton.disabled = true;
            })
        }
function subCategoryExistCheck() {
    const subCategoryTextbox = document.getElementById('subCategoryText');
        const subCategoryName = subCategoryTextbox.value;
        const categoryId = document.getElementById('selectCategory').value;
        if(categoryId.length < 1) {
            return false;
        }
        let displayContent = document.getElementById('checkResult');
        let submitButton = document.getElementById('submitButton');
        fetch('/admin/subCategory/existSubCategory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subCategoryName,categoryId })
        }).then(res => res.json()).then(data => {
            let subSearchResult = data.subSearchResult;
            if (subSearchResult.length < 1) {
                displayContent.style.display = 'none';
                submitButton.disabled = false;
                return;
            }
            displayContent.style.display = 'block';
            displayContent.innerHTML = ` <div class="alert alert-danger" role="alert">
                        Sub-category already exist under the category
                      </div>`;
            submitButton.disabled = true;
        })
}
    
    
