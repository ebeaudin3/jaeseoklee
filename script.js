document.addEventListener("DOMContentLoaded", () => {
    fetch("sidebar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("sidebar-container").innerHTML = data;
            setActiveTab();
        })
        .catch(err => console.error("Sidebar loading failed:", err));
});

function setActiveTab() {
    let path = window.location.pathname;
    let page = path.split("/").pop();

    if (page === "" || page === "index.html") {
        page = "index.html";
    }

    let activeId = "nav-" + page.replace(".html", "");
    let element = document.getElementById(activeId);
    if (element) {
        element.classList.add("active");
    }
}
