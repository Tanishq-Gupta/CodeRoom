const pricePara = document.querySelector(".price"),
    tutorPara = document.querySelector(".tutor-p"),
    heading = document.querySelector(".heading"),
    classButton = document.querySelector(".class-button"),
    infoButton = document.querySelector(".info-button"),
    option1 = document.getElementById("option1"),
    option2 = document.getElementById("option2"),
    option3 = document.getElementById("option3"),
    pfor125 = document.querySelector(".pfor125"),
    pfor225 = document.querySelector(".pfor225"),
    pfor325 = document.querySelector(".pfor325"),
    circle = document.querySelector(".blackcircle"),
    progress = document.querySelector(".progress"),
    line = document.querySelector(".line"),
    Rs = document.getElementById("Rs"),
    payLink = document.getElementById("paylink");

let prevActiveOption = option1;
var circleMouseDown = false;

var position = line.getBoundingClientRect();

circle.addEventListener("mousedown", (e) => {
    circleMouseDown = true;
});

document.addEventListener("mousemove", (e) => {
    if (!circleMouseDown) return;
    var widthShouldbe = e.clientX - position.left;
    progress.style.width = widthShouldbe + "px";
    widthShouldbe = Math.max(0, widthShouldbe);
    widthShouldbe = Math.min(line.clientWidth, widthShouldbe);
    circle.style.left = widthShouldbe + "px";
    document.body.setAttribute("style", "user-select: none");
    widthShouldbe = Math.floor(widthShouldbe);
    widthShouldbe = Math.min(500, widthShouldbe);
    Rs.innerHTML = widthShouldbe + " Rs";
    if (widthShouldbe > 285) {
        Rs.style.color = "white";
    } else Rs.style.color = "gray";
});

document.addEventListener("mouseup", (e) => {
    circleMouseDown = false;
    document.body.removeAttribute("style");
});

function showInfo(e) {
    tutorPara.style.display = "block";
    pricePara.style.display = "none";
    heading.innerHTML = "About me";
    infoButton.style.height = "70%";
    classButton.style.height = "30%";
}

function showPrice(e) {
    tutorPara.style.display = "none";
    pricePara.style.display = "block";
    heading.innerHTML = "About my Class";
    classButton.style.height = "70%";
    infoButton.style.height = "30%";
}

function changeBorders(IdName) {
    const shouldbeActive =
        IdName == "option1" ? option1 : IdName == "option2" ? option2 : option3;
    shouldbeActive.classList.add("active");
    prevActiveOption.classList.remove("active");
    const hidePara =
        prevActiveOption == option1
            ? pfor125
            : prevActiveOption == option2
            ? pfor225
            : pfor325;
    const displayPara =
        shouldbeActive == option1
            ? pfor125
            : shouldbeActive == option2
            ? pfor225
            : pfor325;
    hidePara.style.display = "none";
    displayPara.style.display = "block";
    if(displayPara === pfor125) {
        payLink.setAttribute("href", "https://rzp.io/l/KRB2cNa");
    }
    else if(displayPara === pfor225) {
        payLink.setAttribute("href", "https://rzp.io/l/DV46cEahDO");
    }
    else {
        payLink.setAttribute("href", "https://rzp.io/l/yvwygwyrVd");
    }
    prevActiveOption = shouldbeActive;
}
