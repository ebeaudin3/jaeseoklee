document.addEventListener("DOMContentLoaded", () => {
    // 1. Fetch and inject the top header HTML
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;
            setActiveTab();
            
            // CRITICAL FIX: Only wire up the SPA navigation AFTER the header HTML actually exists in the DOM!
            initSPANavigation(); 
        })
        .catch(err => console.error("Header template loading failed:", err));
    
    // Fetch and inject the footer HTML
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

// Interactive multi-ring seismic wavefront clicks
window.addEventListener('mousedown', (e) => {
    const totalWaves = 3;       // Number of concentric rings
    const waveDelay = 120;      // Stagger spacing in milliseconds

    for (let i = 0; i < totalWaves; i++) {
        setTimeout(() => {
            const wavefront = document.createElement('div');
            wavefront.className = 'seismic-wavefront';
            
            wavefront.style.left = `${e.clientX}px`;
            wavefront.style.top = `${e.clientY}px`;
            
            document.body.appendChild(wavefront);
            
            wavefront.addEventListener('animationend', () => {
                wavefront.remove();
            });
        }, i * waveDelay);
    }
});

/* ==========================================================================
   SPA-like NAVIGATION ENGINE
   ========================================================================== */

// Wrapped inside a function so we can initialize it safely at the correct time
function initSPANavigation() {
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetUrl = link.getAttribute('href');
            
            if (targetUrl.startsWith('http') || targetUrl.startsWith('#')) return;
            
            // Safely stop the full page reload
            e.preventDefault();
            
            // Execute the partial content stream
            navigateToPage(targetUrl);
        });
    });
}

function navigateToPage(url) {
    fetch(url)
        .then(response => response.text())
        .then(htmlString => {
            const parser = new DOMParser();
            const nextDoc = parser.parseFromString(htmlString, 'text/html');
            
            // Surgically pull out the internal view container
            const newInnerContent = nextDoc.querySelector('#page-content').innerHTML;
            
            // Swap out ONLY the middle text canvas
            document.querySelector('#page-content').innerHTML = newInnerContent;
            
            // Update browser history state
            history.pushState({ url }, '', url);
            
            // Re-verify which navigation tab is lit up
            updateActiveNavTab(url);
        })
        .catch(err => {
            console.error('Failed to stream tectonic content:', err);
            window.location.href = url;
        });
}

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

// Handle browser navigation arrows cleanly
window.addEventListener('popstate', (e) => {
    if (e.state && e.state.url) {
        navigateToPage(e.state.url);
    } else {
        window.location.reload();
    }
});
