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
    //Loop through checkboxes to see if atleast oned is checked
    for (let i = 0; i < radiosX.length; i++) {
        if (radiosX[i].checked) {
            selected = true;
            selectedPoints.push(true);
        }
        else {selectedPoints.push(false);}
    }
    //If selected is true get the ratingType(choosen reviews) and selectedPoints(reviews options) and display  
    if (selected) {
        let ratingType = choosenRangeX;
        if (!ratingType == "") {
            function orderByDate(array, order = "asc") {
                // Parse the date strings into Date objects and store in a new array
                array.forEach((item) => {
                    Object.defineProperty(item, "datePublishedParsed", {value: new Date(item.datePublished), writable: true, enumerable: true, configurable: true});
                });
                // Sort the new array by the datePublished property
                array.sort((a, b) => {
                  if (order === "asc") {
                    return a.datePublishedParsed - b.datePublishedParsed;
                  } else if (order === "desc") {
                    return b.datePublishedParsed - a.datePublishedParsed;
                  }
                });
                // Convert datePublished back to the original string format
                array.forEach((item) => {
                    item.datePublishedParsed = item.datePublishedParsed.toDateString().slice(4);
                });
                return array;
            }
            //Update the reviewsSelected array based on ratingType
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
            //If descending or ascending option is checked on submit run orderByDate to update reviewsSelected
            if (radiosX[0].checked){
                const descending = orderByDate(reviewsSelected, "desc");
                reviewsSelected = descending;
            }
            if (radiosX[1].checked){
                const ascending = orderByDate(reviewsSelected, "asc");
                reviewsSelected = ascending;
            }
        }
        //Update h1 based on reviews choosen
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
        //Loop through the updated reviewsSelected and construct html elements to display content
        reviewsSelected.forEach(review_block => {
            const reviewBox = document.createElement("div");
            reviewBox.setAttribute("class", "reviewBox");
            contentBoxX.appendChild(reviewBox);
            let reviewNumber = document.createElement("span");
            reviewNumber.setAttribute("class", "reviewNumber");
            let reviewNumberText = document.createTextNode("#" + newNumber);
            reviewNumber.appendChild(reviewNumberText);
            reviewBox.appendChild(reviewNumber);
            //Add review stars per review_block
            if (ratingType) {
                let ratingValue = 0;
                    ratingValue = review_block.reviewRating.ratingValue;
                for (let p = 0; p < ratingValue; p++) {
                    const newRating = document.createElement("span");
                    newRating.setAttribute("class", "fa fa-star checked reviewRating");
                    reviewBox.appendChild(newRating);
                }
            }
            //Add reviews, author and date if true
            for (let j = 0; j < selectedPoints.length; j++) {
                if(selectedPoints[j] == true) {
                    if (radiosX[j].value === "reviews") {
                        const newLine = document.createElement("h3");
                        let newContent;
                        let totalStars = 0;
                        if (review_block.reviewBody == "") {
                            totalStars = review_block.item.reviewRating.ratingValue; 
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
//submit(display) event handler
document.getElementById('reviewForm').addEventListener("submit", function(event) {
    submitFunction(event, reviews, contentBox, category, radios);
});
//onload event handler
window.addEventListener('load', function(event) {
    submitFunction(event, reviews, contentBox, category, radios);
});