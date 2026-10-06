let projects = [];
let currentPage = 1;

function getProjectsPerPage() {
    if (window.innerWidth <= 750) {
        return 1;
    }

    return 8;
}
// const projectsPerPage = 8;

const projectGrid = document.getElementById("projectGrid");
const prevProject = document.getElementById("prevProject");
const nextProject = document.getElementById("nextProject");
const projectCounter = document.getElementById("projectCounter");

async function loadProjects() {
    try {
        const response = await fetch("/js/data.json");

        if (!response) {
            throw new Error("Gagal mengambil data project.");
        }

        projects = await response.json();

        renderProjects();
        updatePagination();
    }

    catch (error) {
        console.error("Error:", error);
    }
}

function createProject(project) {
    const article = document.createElement("article");
    article.className = "project-card";

    const tags = project.tags.map(function (tag) {
        return `<span class="project-tag">${tag}</span>`;
    }).join("");

    article.innerHTML = `
        <div class="project-visual">
            <span>PROJECT ${project.number}</span>
        </div>

        <div class="project-meta">
            <span>${project.number}</span>
            <span>${project.year}</span>
        </div>

        <h3 class="project-title">${project.title}</h3>
        <div class="project-tags">${tags}</div>

        <p class="project-description">${project.description}</p>

        <div class="project-links">
            <a href="${project.demo}" target="_blank" rel="noopener noreferrer"> Website ↗</a>
            <a href="${project.github}" target="_blank" rel="noopener noreferrer"> Code ↗</a>
        </div>
    `;

    return article;
}

function renderProjects() {
    if (!projectGrid) {
        return;
    }

    projectGrid.innerHTML = "";

    const projectsPerPage = getProjectsPerPage();
    const start = (currentPage - 1) * projectsPerPage;
    const end = start + projectsPerPage;

    const currentProjects = projects.slice(start, end);

    currentProjects.forEach(
        function (project) {
            projectGrid.appendChild(createProject(project));
        }
    );
}

function updatePagination() {
    const projectsPerPage = getProjectsPerPage();
    const totalPages = Math.ceil(projects.length / projectsPerPage);

    if (prevProject) {
        prevProject.disabled = currentPage === 1;
    }

    if (nextProject) {
        nextProject.disabled = currentPage === totalPages;
    }

    const start = (currentPage - 1) * projectsPerPage + 1;
    const end = Math.min(currentPage * projectsPerPage, projects.length);

    if (projectCounter) {
        projectCounter.textContent =  `${String(start).padStart(2, "0")} - ${String(end).padStart(2, "0")}`;
    }
}

if (nextProject) {
    nextProject.addEventListener("click", function() {
        const projectsPerPage = getProjectsPerPage();
        const totalPages = Math.ceil(projects.length / projectsPerPage);

        if (currentPage < totalPages) {
            currentPage++;

            renderProjects();
            updatePagination();
        }
    });
}

if (prevProject) {
    prevProject.addEventListener("click", function() {
        if (currentPage > 1){
            currentPage--;

            renderProjects();
            updatePagination();
        }
    });
}

window.addEventListener("resize", function () {

    currentPage = 1;

    renderProjects();

    updatePagination();

});

// Initialize
loadProjects();