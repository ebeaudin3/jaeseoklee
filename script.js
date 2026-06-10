document.addEventListener("DOMContentLoaded", () => {
    // 1. Fetch and inject the sidebar HTML
    fetch("sidebar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("sidebar-container").innerHTML = data;
            highlightActiveTab();
        })
        .catch(error => console.error("Error loading the sidebar:", error));
});

function highlightActiveTab() {
    // 2. Get the current filename (e.g., "education.html")
    let path = window.location.pathname;
    let page = path.split("/").pop();

    // Default to index if path is empty (e.g., root domain)
    if (page === "" || page === "index.html") {
        page = "index.html";
    }

    // 3. Find the matching link ID and add the 'active' class
    // Removes .html extension to match the element IDs (nav-index, nav-education, etc.)
    let pageId = "nav-" + page.replace(".html", "");
    let activeLink = document.getElementById(pageId);
    
    if (activeLink) {
        activeLink.classList.add("active");
    }
}
