function getBrands() {
    var checkboxes = 
        document.getElementsByName('brand');
    var result = [];
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            result.push(checkboxes[i].value);
        }
    }
    return result;
}
function loadBgImage() {
    $('.set-bg').each(function () {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });
}
function changeValue(sortType,pageName) {
    document.getElementById('sortType').value = sortType;
        findResult(pageName);
}
function findResult(pageName) {
    let brands = getBrands();
    const sortType = document.getElementById('sortType').value;
    const productSubCategoryId = document.getElementById('subCategoryId').value;
    let minAmount = document.getElementById('minamount').value;
        minAmount = minAmount.replace('₹','');
    let maxAmount = document.getElementById('maxamount').value;
        maxAmount = maxAmount.replace('₹','');
        if(!minAmount) {
            return false;
        }
    let result = '',page = '',count = 0;
    let searchContent = document.getElementById('searchContent').value;
    fetch('/category/sortData', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sortType,productSubCategoryId,minAmount,maxAmount,brands,pageName,searchContent })
        }).then(res => res.json()).then(data => {
        const sortResult = data.sortResult;
            if(sortResult.length > 0) {
                sortResult.forEach((eachProduct) => {
                    result += `<div class="col-lg-4 col-md-6 col-sm-6">
                    <div class="product__item">
                        <div class="product__item__pic set-bg" data-setbg="../uploads/${eachProduct.productImage}">
                            <ul class="product__item__pic__hover">
                                <li onclick="addToWishlist('${eachProduct._id}')"><span><i class="fa fa-heart"></i></span></li>
                                <li title="Add to cart" onclick="addToCart('${eachProduct._id}')"><span><i class="fa fa-shopping-cart"></i></span></li>
                            </ul>
                        </div>
                        <div class="product__item__text">
                            <h6><a href="/product/${eachProduct._id}">${eachProduct.productName}</a></h6>
                            <h5>₹${(eachProduct.productPrice).toFixed(2)}</h5>
                        </div>
                    </div>
                </div>`;
                });
            }
            if((data.resultCount.length) > 0) {
                count = data.resultCount[0].productQuantity;
                page += `<div class="col-12">
                        <input type="hidden" id="pageCount" name="pageCount" value="${count}">
                            <div class="product__pagination">`;
                            if((count) > 18) {
                                newCount = 1;
                page += `<span onclick="changePage('pre','${pageName}')"><i class="fa fa-long-arrow-left"></i></span>`;
                    for(i=1;i <= (count);i=i+18) {
                page += `<span onclick="changePage('${newCount}','${pageName}')" id="page${newCount}">${newCount++}</span>`;
                    }
                page += `<span onclick="changePage('next','${pageName}')"><i class="fa fa-long-arrow-right"></i></span>`;
                     } 
                page += `</div></div>`;
            }
            document.getElementById('paginationPage').innerHTML = page;
        document.getElementById('pagination').innerHTML = result;
        document.getElementById('productCountDisplay').innerHTML = count;
        loadBgImage();
    });
}
function changePage(pageNumber,pageName) {
    console.log(pageNumber);
    const pageNoTextbox = document.getElementById('pageNumber');
    const currentPageNumber = pageNoTextbox.value;
    const pageCount = document.getElementById('pageCount').value;
    const subCategoryId = document.getElementById('subCategoryId').value;
    if(pageNumber == 'pre') {
        if(currentPageNumber != 1) {
            document.getElementById('page'+currentPageNumber).className = '';
            pageNumber = currentPageNumber-1;
            pageNoTextbox.value = pageNumber;
            document.getElementById('page'+pageNumber).className = 'active';
        }else {
            return false;
        }
    }else if(pageNumber == 'next') {
        if(currentPageNumber <= parseInt(pageCount/18)) {
            document.getElementById('page'+currentPageNumber).className = '';
            pageNumber = Number(currentPageNumber)+1;
            pageNoTextbox.value = pageNumber;
            document.getElementById('page'+pageNumber).className = 'active';
        }else {
            return false;
        } 
    }else {
        document.getElementById('page'+currentPageNumber).className = '';
        pageNoTextbox.value = pageNumber;
        document.getElementById('page'+pageNumber).className = 'active';
    }
    let searchContent = document.getElementById('searchContent').value;
    const sortType = document.getElementById('sortType').value;
    let minAmount = document.getElementById('minamount').value;
        minAmount = minAmount.replace('₹','');
    let maxAmount = document.getElementById('maxamount').value;
        maxAmount = maxAmount.replace('₹','');
    let brands = getBrands();
let result = '';
fetch('/category/pagination', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ pageNumber,subCategoryId,sortType,minAmount,maxAmount,brands,pageName,searchContent })
        }).then(res => res.json()).then(data => {
        const categoryProducts = data.categoryProducts;
        if(categoryProducts.length > 0) {
                    categoryProducts.forEach((eachProduct) => { 
        result += `<div class="col-lg-4 col-md-6 col-sm-6">
                    <div class="product__item">
                        <div class="product__item__pic set-bg" data-setbg="../uploads/${eachProduct.productImage}">
                            <ul class="product__item__pic__hover">
                                <li onclick="addToWishlist('${eachProduct._id}')"><span><i class="fa fa-heart"></i></span></li>
                                <li title="Add to cart" onclick="addToCart('${eachProduct._id}')"><span><i class="fa fa-shopping-cart"></i></span></li>
                            </ul>
                        </div>
                        <div class="product__item__text">
                            <h6><a href="/product/${eachProduct._id}">${eachProduct.productName}</a></h6>
                            <h5>₹${(eachProduct.productPrice).toFixed(2)}</h5>
                        </div>
                    </div>
                </div>`;
             }); } 
        document.getElementById('pagination').innerHTML = result;
        loadBgImage();
  });
}