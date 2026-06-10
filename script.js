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

// Seismic wave clicks
window.addEventListener('mousedown', (e) => {
    const totalWaves = 3;       // Number of concentric rings
    const waveDelay = 120;      // Stagger spacing in milliseconds

    for (let i = 0; i < totalWaves; i++) {
        setTimeout(() => {
            const wavefront = document.createElement('div');
            wavefront.className = 'seismic-wavefront';
            
            // Lock coordinates precisely to the epicenter
            wavefront.style.left = `${e.clientX}px`;
            wavefront.style.top = `${e.clientY}px`;
            
            document.body.appendChild(wavefront);
            
            // Clean up the element once its specific wave cycle clears
            wavefront.addEventListener('animationend', () => {
                wavefront.remove();
            });
        }, i * waveDelay);
    }
});
