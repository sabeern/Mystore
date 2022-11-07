function changeBrandId(brandId) {
    document.getElementById('brandId').value = brandId;
}
const element = document.getElementById("confirmButton");
element.addEventListener("click", function () {
let brandDelete = document.getElementById('brandId').value;
fetch('/admin/brand/deleteBrand', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ brandDelete })
            }).then(res => res.json()).then(data => {
                window.location.reload();
            });
    });