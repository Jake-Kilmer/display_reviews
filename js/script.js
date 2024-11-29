const form = document.getElementById('selectReviewsForm');
const radios = document.getElementsByName('category');
let selected;
let selectedPoints = [];
let reviewsOwner = document.getElementsByClassName("ownerName")[0];
reviewsOwner.textContent = "Jimbo's Burgers"; //change name
form.addEventListener("submit", function(event) {
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            selected = true;
        }
    }
    if (!selected) {
        event.preventDefault();
        selected = false;
        alert("please select a category");
    }
    else {
        window.location.href = "reviews.html";
    }
});