import { projects } from './data.js';
import { initParticles } from './particles.js';

// Debug logger with timestamp
const debug = {
  log: (...args) => console.log(`[Lab ${new Date().toLocaleTimeString()}]`, ...args),
  error: (...args) => console.error(`[Lab ERROR ${new Date().toLocaleTimeString()}]`, ...args),
  warn: (...args) => console.warn(`[Lab WARN ${new Date().toLocaleTimeString()}]`, ...args),
  info: (...args) => console.info(`[Lab INFO ${new Date().toLocaleTimeString()}]`, ...args)
};

export function renderFeatured(project, container) {
  if (!project) {
    debug.error('renderFeatured: No project provided');
    return;
  }
  if (!container) {
    debug.error('renderFeatured: Container element not found');
    return;
  }

  debug.log(`Rendering featured project: ${project.title}`);

  const targetAttr = project.external ? 'target="_blank"' : '';

  container.innerHTML = `
    <div class="featured-card">
      <div class="featured-content">
        <span class="card-tag">FEATURED</span>
        <h1>${project.title}</h1>
        <p>${project.description}</p>
        <a href="${project.link}" ${targetAttr} class="btn btn-primary">Try It Now</a>
      </div>
      <div class="featured-visual">
        ${project.visual}
      </div>
    </div>
  `;
}

export function renderGrid(projectsList, container) {
  if (!projectsList || projectsList.length === 0) {
    debug.warn('renderGrid: No projects to render');
    return;
  }
  if (!container) {
    debug.error('renderGrid: Container element not found');
    return;
  }

  debug.log(`Rendering ${projectsList.length} projects in grid`);

  try {
    container.innerHTML = projectsList.map(project => {
      const targetAttr = project.external ? 'target="_blank"' : '';
      return `
        <a href="${project.link}" ${targetAttr} class="card theme-${project.colorTheme}">
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
      `;
    }).join('');
  } catch (error) {
    debug.error('renderGrid: Failed to render projects', error);
  }
}

// Initialize
export function init() {
  debug.info('🚀 Initializing My Experiments Lab...');
  debug.log(`Loaded ${projects.length} projects from data.js`);

  const featuredContainer = document.getElementById('featured-container');
  const gridContainer = document.getElementById('grid-container');
  const filtersContainer = document.getElementById('filters-container');

  if (!featuredContainer) {
    debug.error('Init failed: featured-container element not found');
    return;
  }
  if (!gridContainer) {
    debug.error('Init failed: grid-container element not found');
    return;
  }
  if (!filtersContainer) {
    debug.error('Init failed: filters-container element not found');
    return;
  }

  try {
    const featuredProject = projects.find(p => p.featured) || projects[0];
    const otherProjects = projects; // Show all projects in grid

    if (!featuredProject) {
      debug.error('No featured project found and no projects available');
      return;
    }

    debug.log(`Featured project: ${featuredProject.title}`);

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

    debug.info('✅ Initialization complete!');

  } catch (error) {
    debug.error('❌ Fatal initialization error:', error);
    throw error; // Re-throw to see stack trace
  }
}

// Start the app
try {
  init();
} catch (error) {
  debug.error('Failed to initialize app:', error);
}

// Initialize particle parallax background
try {
  debug.log('Initializing particle background...');
  initParticles();
  debug.info('✓ Particle background initialized');
} catch (error) {
  debug.error('Failed to initialize particles:', error);
}
