let projects = [];
let currentProject = 0;


/* =========================================================
   ELEMENT
========================================================= */

const projectGrid =
    document.getElementById("projectGrid");

const prevProject =
    document.getElementById("prevProject");

const nextProject =
    document.getElementById("nextProject");

const projectCounter =
    document.getElementById("projectCounter");


/* =========================================================
   LOAD PROJECT DATA
========================================================= */

async function loadProjects() {
    try {
        const response =
            await fetch("/js/data.json");

        if (!response.ok) {
            throw new Error(
                "Gagal mengambil data project."
            );
        }

        projects =
            await response.json();

        renderProjects();
        updateCarousel();

    } catch (error) {
        console.error(
            "Error:",
            error
        );
    }
}


/* =========================================================
   CREATE PROJECT CARD
========================================================= */

function createProject(project) {

    const article =
        document.createElement("article");

    article.className =
        "project-card";


    const tags =
        project.tags
            .map(function (tag) {
                return `
                    <span class="project-tag">
                        ${tag}
                    </span>
                `;
            })
            .join("");


    article.innerHTML = `
        <div class="project-visual">
            <span>
                PROJECT ${project.number}
            </span>
        </div>

        <div class="project-meta">
            <span>
                ${project.number}
            </span>

            <span>
                ${project.year}
            </span>
        </div>

        <h3 class="project-title">
            ${project.title}
        </h3>

        <div class="project-tags">
            ${tags}
        </div>

        <p class="project-description">
            ${project.description}
        </p>

        <div class="project-links">

            <a
                href="${project.demo}"
                target="_blank"
                rel="noopener noreferrer"
            >
                Website ↗
            </a>

            <a
                href="${project.github}"
                target="_blank"
                rel="noopener noreferrer"
            >
                Code ↗
            </a>

        </div>
    `;


    return article;
}


/* =========================================================
   RENDER PROJECTS
========================================================= */

function renderProjects() {

    if (!projectGrid) {
        return;
    }

    projectGrid.innerHTML = "";


    projects.forEach(
        function (project) {

            projectGrid.appendChild(
                createProject(project)
            );

        }
    );
}


/* =========================================================
   GET VISIBLE PROJECTS
========================================================= */

function getVisibleProjects() {

    const width =
        window.innerWidth;


    if (width <= 500) {
        return 1;
    }


    if (width <= 750) {
        return 2;
    }


    if (width <= 1000) {
        return 3;
    }


    return 4;
}


/* =========================================================
   UPDATE CAROUSEL
========================================================= */

function updateCarousel() {

    if (!projectGrid) {
        return;
    }


    const cards =
        projectGrid.querySelectorAll(
            ".project-card"
        );


    const total =
        cards.length;


    const visible =
        getVisibleProjects();


    const maxPosition =
        Math.max(
            0,
            total - visible
        );


    if (
        currentProject >
        maxPosition
    ) {

        currentProject =
            maxPosition;
    }


    if (
        currentProject < 0
    ) {

        currentProject = 0;
    }


    if (cards.length > 0) {

        const cardWidth =
            cards[0]
                .getBoundingClientRect()
                .width;


        const gap = 1;


        const move =
            (cardWidth + gap) *
            currentProject;


        projectGrid.style.transform =
            `translateX(-${move}px)`;
    }


    if (prevProject) {

        prevProject.disabled =
            currentProject === 0;
    }


    if (nextProject) {

        nextProject.disabled =
            currentProject >=
            maxPosition;
    }


    if (total === 0) {

        if (projectCounter) {

            projectCounter.textContent =
                "00 — 00";
        }

        return;
    }


    const start =
        currentProject + 1;


    const end =
        Math.min(
            currentProject + visible,
            total
        );


    if (projectCounter) {

        projectCounter.textContent =
            `${String(start).padStart(2, "0")} — ${String(end).padStart(2, "0")}`;
    }
}


/* =========================================================
   NEXT PROJECT
========================================================= */

if (nextProject) {

    nextProject.addEventListener(
        "click",
        function () {

            const visible =
                getVisibleProjects();


            const maxPosition =
                Math.max(
                    0,
                    projects.length -
                    visible
                );


            if (
                currentProject <
                maxPosition
            ) {

                currentProject++;

                updateCarousel();
            }
        }
    );
}


/* =========================================================
   PREVIOUS PROJECT
========================================================= */

if (prevProject) {

    prevProject.addEventListener(
        "click",
        function () {

            if (
                currentProject > 0
            ) {

                currentProject--;

                updateCarousel();
            }
        }
    );
}


/* =========================================================
   RESPONSIVE
========================================================= */

window.addEventListener(
    "resize",
    function () {
        updateCarousel();
    }
);


/* =========================================================
   INITIALIZE
========================================================= */

loadProjects();