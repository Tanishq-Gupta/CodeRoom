const searchBar = document.getElementById("input");

searchBar.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
        const toSearch = searchBar.value;
        if (toSearch === "Tanishq") {
            window.location.href = "../fakeTutorPage/tutorPage.html";
        } else {
            alert("Tutor Not Found");
        }
    }
});
