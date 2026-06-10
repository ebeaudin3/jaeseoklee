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

/*  SPA-like NAVIGATION */
// 1. Listen for clicks on the navigation tabs
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        const targetUrl = link.getAttribute('href');
        
        // Skip handling external links or anchor links
        if (targetUrl.startsWith('http') || targetUrl.startsWith('#')) return;
        
        // Stop the browser from executing a full-page reload
        e.preventDefault();
        
        // Execute the smooth background page migration
        navigateToPage(targetUrl);
    });
});

// 2. The Dynamic Content Loading Engine
function navigateToPage(url) {
    // Quietly fetch the next HTML document in the background
    fetch(url)
        .then(response => response.text())
        .then(htmlString => {
            // Turn the fetched text string into a temporary readable HTML DOM
            const parser = new DOMParser();
            const nextDoc = parser.parseFromString(htmlString, 'text/html');
            
            // Extract the fresh content inside the next page's <main> container
            const newMainContent = nextDoc.querySelector('main').innerHTML;
            
            // Inject only that fresh content straight into your current <main> canvas
            document.querySelector('main').innerHTML = newMainContent;
            
            // 3. Update the URL browser bar so back/forward buttons still work perfectly
            history.pushState({ url }, '', url);
            
            // 4. Run any UI updates needed (like switching the active nav highlight)
            updateActiveNavTab(url);
        })
        .catch(err => {
            console.error('Failed to stream tectonic content:', err);
            // Fallback: If anything breaks, just execute a standard hard load
            window.location.href = url;
        });
}

// 5. Keep navigation styling up-to-date with the active tab position
function updateActiveNavTab(url) {
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (url.includes(href)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// 6. Handle the browser's native Back/Forward buttons smoothly
window.addEventListener('popstate', (e) => {
    if (e.state && e.state.url) {
        navigateToPage(e.state.url);
    } else {
        window.location.reload();
    }
});
