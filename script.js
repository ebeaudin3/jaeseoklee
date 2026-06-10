document.addEventListener("DOMContentLoaded", () => {
    // Fetch and inject the top header HTML
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;
            setActiveTab();
        })
        .catch(err => console.error("Header template loading failed:", err));
    
    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-container").innerHTML = data;
        })
        .catch(err => console.error("Footer loading failed:", err));
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

// Seismic mouse cursor
window.addEventListener('click', (e) => {
    // 1. Create a dynamic epicentral element
    const wavefront = document.createElement('div');
    wavefront.className = 'seismic-wavefront';
    
    // 2. Position the epicenter exactly where the mouse coordinates are
    wavefront.style.left = `${e.clientX}px`;
    wavefront.style.top = `${e.clientY}px`;
    
    // 3. Inject it into the page architecture
    document.body.appendChild(wavefront);
    
    // 4. Automatically delete it from the DOM once the wave finishes expanding
    wavefront.addEventListener('animationend', () => {
        wavefront.remove();
    });
});
