import { projects } from './data.js';

export function renderFeatured(project, container) {
  if (!project || !container) return;

  container.innerHTML = `
    <div class="featured-card">
      <div class="featured-content">
        <span class="card-tag">FEATURED</span>
        <h1>${project.title}</h1>
        <p>${project.description}</p>
        <a href="${project.link}" target="_blank" class="btn btn-primary">Try It Now</a>
      </div>
      <div class="featured-visual">
        ${project.visual}
      </div>
    </div>
  `;
}

export function renderGrid(projectsList, container) {
  if (!projectsList || !container) return;

  container.innerHTML = projectsList.map(project => `
    <a href="${project.link}" target="_blank" class="card theme-${project.colorTheme}">
      <div class="card-content">
        <div style="display: flex; justify-content: space-between; align-items: start;">
           <span class="card-tag">${project.tags[0].toUpperCase()}</span>
        </div>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
      </div>
      <div class="card-visual">
         ${project.visual}
      </div>
      <div class="btn-card-wrapper">
        <span class="btn-card">Try It Now</span>
      </div>
    </a>
  `).join('');
}

// Initialize
export function init() {
  const featuredContainer = document.getElementById('featured-container');
  const gridContainer = document.getElementById('grid-container');
  const filtersContainer = document.getElementById('filters-container');

  if (featuredContainer && gridContainer && filtersContainer) {
    const featuredProject = projects.find(p => p.featured) || projects[0];
    const otherProjects = projects; // Show all projects in grid

    renderFeatured(featuredProject, featuredContainer);
    renderGrid(otherProjects, gridContainer);

    // Filter Logic
    const allTags = ['All', ...new Set(otherProjects.flatMap(p => p.tags))];

    filtersContainer.innerHTML = allTags.map(tag =>
      `<button class="filter-btn ${tag === 'All' ? 'active' : ''}" data-filter="${tag}">${tag}</button>`
    ).join('');

    filtersContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-btn')) {
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Filter projects
        const filter = e.target.dataset.filter;
        const filteredProjects = filter === 'All'
          ? otherProjects
          : otherProjects.filter(p => p.tags.includes(filter));

        renderGrid(filteredProjects, gridContainer);
      }
    });

    // Viewer Logic
    const viewer = document.getElementById('project-viewer');
    const frame = document.getElementById('project-frame');
    const closeBtn = document.getElementById('close-viewer');
    const viewerTitle = document.getElementById('viewer-title');

    function openProject(project) {
      viewerTitle.textContent = project.title;
      frame.src = project.link;
      viewer.classList.remove('hidden');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeProject() {
      viewer.classList.add('hidden');
      frame.src = ''; // Stop content
      document.body.style.overflow = '';
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeProject);
    }

    // Auto-hide header logic
    let hideHeaderTimeout;
    const viewerHeader = document.querySelector('.viewer-header');

    function showHeader() {
      if (viewerHeader) {
        viewerHeader.classList.remove('hidden-ui');
      }
    }

    function scheduleHideHeader() {
      clearTimeout(hideHeaderTimeout);
      hideHeaderTimeout = setTimeout(() => {
        if (viewerHeader && !viewer.classList.contains('hidden')) {
          viewerHeader.classList.add('hidden-ui');
        }
      }, 3000); // Hide after 3 seconds of inactivity
    }

    // Show header when mouse moves to top 100px or when mouse moves
    viewer.addEventListener('mousemove', (e) => {
      if (e.clientY < 100) {
        showHeader();
        scheduleHideHeader();
      } else {
        // Show briefly on any movement, then schedule hide
        showHeader();
        scheduleHideHeader();
      }
    });

    // Show header when viewer opens
    viewer.addEventListener('transitionend', () => {
      if (!viewer.classList.contains('hidden')) {
        showHeader();
        scheduleHideHeader();
      }
    });

    // Delegate clicks for projects
    document.addEventListener('click', (e) => {
      // Check if clicked element is a project link/button or inside one
      const target = e.target.closest('a[href]');

      // Only handle clicks on project links within the main element
      if (target && target.closest('main') && !e.target.closest('.card-tag')) {
        const link = target.getAttribute('href');
        const project = projects.find(p => p.link === link);

        if (project && !project.external) {
          // Only open non-external projects in the viewer
          // External projects will use their default target="_blank" behavior
          e.preventDefault();
          e.stopPropagation(); // Prevent event bubbling
          openProject(project);
        }
        // If project.external is true, let the default link behavior happen (open in new tab)
      }
    }, { capture: true }); // Use capture phase to catch events early
  }
}

init();
