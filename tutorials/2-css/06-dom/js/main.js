// console.log('javascript')

const header = document.querySelector("#header");
const changeHeaderButton = document.querySelector("#change-header-button");
const changeThemeButton = document.querySelector("#change-theme-button");
const img1 = document.querySelector("#img1");
const img2 = document.querySelector("#img2");
const img3 = document.querySelector("#img3");


// change ehader with button click
changeHeaderButton.addEventListener("click", () => {
    header.innerHTML = "WOOHOO!!!!"
});



// toggle color theme

// create function for changing button text
function changeButtonText() {
    if (document.body.classList.contains("dark")) {
        changeThemeButton.textContent = "Good Night";
    } else {
        changeThemeButton.textContent = "Good Morning";
    }
}




// click event on button
changeThemeButton.addEventListener("click", () => {
    // add/remove dark class to body
    document.body.classList.toggle("dark");
    changeButtonText();
});


// toggle image visibility

img1.addEventListener("click", () => {
    img2.classList.remove("hidden");
})

img2.addEventListener("click", () => {
    img3.classList.remove("hidden");
})