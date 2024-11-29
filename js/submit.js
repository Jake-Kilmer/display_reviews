import {reviews} from "./reviews.js";
const contentBox = document.getElementById("mainContent");
const radios = document.getElementsByName('options');
const params = new URLSearchParams(window.location.search);
const category = params.get('category');
const submitFunction = (e, reviews_block, contentBoxX, choosenRangeX, radiosX) => {
    e.preventDefault();
    let selected = false;
    const selectedPoints = [];
    contentBoxX.textContent = "";
    let newNumber = 1;
    let reviewsSelected = [];
    for (let i = 0; i < radiosX.length; i++) {
        if (radiosX[i].checked) {
            selected = true;
            selectedPoints.push(true);
        }
        else {selectedPoints.push(false)}
    }
    if (selected) {
        let ratingType = choosenRangeX;
        if (!ratingType == "") {
            if (ratingType == "five_star") {
                reviews_block.forEach(review_block => {
                    if (review_block.reviewRating.ratingValue === 5) {
                        reviewsSelected.push(review_block);
                    }
                });
            }
            else if (ratingType == "other") {
                reviews_block.forEach(review_block => {
                    if (review_block.reviewRating.ratingValue == 4 || review_block.reviewRating.ratingValue == 3 || review_block.reviewRating.ratingValue == 2 || review_block.reviewRating.ratingValue == 1) {
                        reviewsSelected.push(review_block);
                    }
                });
            }
            else {
                reviewsSelected = reviews_block;
            }
        }
        const reviewsHeadline = document.getElementById('reviewsHeadline');
        if (category == "all") {
            reviewsHeadline.textContent = "all (" + reviewsSelected.length + ")";
        }
        else if (category == "five_star") {
            reviewsHeadline.textContent = "five star (" + reviewsSelected.length + ")";
        }
        else {
            reviewsHeadline.textContent = "other (" + reviewsSelected.length + ")";
        }
        reviewsSelected.forEach(review_block => {
            const reviewBox = document.createElement("div");
            reviewBox.setAttribute("class", "reviewBox");
            contentBoxX.appendChild(reviewBox);
            let reviewNumber = document.createElement("span");
            reviewNumber.setAttribute("class", "reviewNumber");
            let reviewNumberText = document.createTextNode("#" + newNumber);
            reviewNumber.appendChild(reviewNumberText);
            reviewBox.appendChild(reviewNumber);
            if (ratingType) {
                let ratingValue = 0;
                ratingValue = review_block.reviewRating.ratingValue; //rating value from javascript object
                for (let p = 0; p < ratingValue; p++) {
                    const newRating = document.createElement("span");
                    newRating.setAttribute("class", "fa fa-star checked reviewRating");
                    reviewBox.appendChild(newRating);
                }
            }
            for (let j = 0; j < selectedPoints.length; j++) {
                if(selectedPoints[j] == true) {
                    if (radiosX[j].value === "reviews") {
                        const newLine = document.createElement("h3");
                        let newContent;
                        let totalStars = 0;
                        if (review_block.reviewBody == "") {
                            totalStars = review_block.reviewRating.ratingValue; //rating value from javascript object
                            if (totalStars == 1) {
                                newContent = document.createTextNode('"' + totalStars + ' Star"');
                            }
                            else {
                                newContent = document.createTextNode('"' + totalStars + ' Stars"');
                            }
                        }
                        else {
                            newContent = document.createTextNode('"' + review_block.reviewBody + '"');
                        }
                        newLine.appendChild(newContent);
                        reviewBox.appendChild(newLine);
                    }
                    if (radiosX[j].value === "author") {
                        const newAuthor = document.createElement("h4");
                        let newContentAuthor = document.createTextNode("~ " + review_block.author.name);
                        newAuthor.appendChild(newContentAuthor);
                        reviewBox.appendChild(newAuthor);
                    }
                    if (radiosX[j].value === "date") {
                        const newDate = document.createElement("p");
                        newDate.setAttribute("class", "reviewDate");
                        let newContentDate = document.createTextNode(review_block.datePublished);
                        newDate.appendChild(newContentDate);
                        reviewBox.appendChild(newDate);
                    }
                }
            }
            contentBoxX.appendChild(reviewBox);
            newNumber++;
        });
        return reviewsSelected;
    }
    else if (!selected) {
        alert('please select an option');
        return false; // Prevent form submission
    }
}
document.getElementById('reviewForm').addEventListener("submit", function(event) {
    submitFunction(event, reviews, contentBox, category, radios);
});
window.addEventListener('load', function(event) {
    submitFunction(event, reviews, contentBox, category, radios);
});