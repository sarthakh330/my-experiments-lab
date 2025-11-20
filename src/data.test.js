import { describe, it, expect } from 'vitest';
import { projects } from './data.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Projects Data Validation', () => {
  describe('Project Structure', () => {
    it('should have at least one project', () => {
      expect(projects).toBeDefined();
      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThan(0);
    });

    it('should have all required fields for each project', () => {
      projects.forEach((project) => {
        expect(project).toHaveProperty('id');
        expect(project).toHaveProperty('title');
        expect(project).toHaveProperty('description');
        expect(project).toHaveProperty('tags');
        expect(project).toHaveProperty('link');
        expect(project).toHaveProperty('colorTheme');
        expect(project).toHaveProperty('featured');
        expect(project).toHaveProperty('visual');
      });
    });

    it('should have unique project IDs', () => {
      const ids = projects.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have at least one featured project', () => {
      const featuredProjects = projects.filter(p => p.featured);
      expect(featuredProjects.length).toBeGreaterThan(0);
    });
  });

  describe('Link Validation', () => {
    it('should have valid link formats', () => {
      projects.forEach((project) => {
        expect(typeof project.link).toBe('string');
        expect(project.link.length).toBeGreaterThan(0);
      });
    });

    it('should not have links to localhost ports other than the dev server', () => {
      const invalidLocalhostPattern = /localhost:\d{4}/;

      projects.forEach((project) => {
        if (invalidLocalhostPattern.test(project.link)) {
          // If it's a localhost link, it should explicitly be marked as external
          // or the test should fail
          throw new Error(
            `Project "${project.title}" links to external localhost (${project.link}). ` +
            `This will cause "connection refused" errors. ` +
            `Either host the project in the /public directory with a relative link, ` +
            `or remove the project until the external server is available.`
          );
        }
      });
    });

    it('should have valid relative paths in /public directory', () => {
      const publicDir = path.join(__dirname, '..', 'public');

      projects.forEach((project) => {
        // Only check relative links (starting with /)
        if (project.link.startsWith('/') && !project.link.startsWith('//')) {
          const relativePath = project.link.replace(/^\//, '');
          const fullPath = path.join(publicDir, relativePath);

          // Check if the directory or file exists
          const exists = fs.existsSync(fullPath);

          if (!exists) {
            // Try with index.html appended
            const indexPath = path.join(fullPath, 'index.html');
            const indexExists = fs.existsSync(indexPath);

            expect(indexExists).toBe(true,
              `Project "${project.title}" links to "${project.link}" but the path doesn't exist. ` +
              `Expected to find either: ${fullPath} or ${indexPath}`
            );
          }
        }
      });
    });

    it('should use clean URLs without index.html', () => {
      projects.forEach((project) => {
        if (project.link.includes('index.html')) {
          throw new Error(
            `Project "${project.title}" link includes "index.html". ` +
            `Use clean URLs like "/dragon-flight/" instead of "/dragon-flight/index.html"`
          );
        }
      });
    });

    it('should have trailing slashes for directory links', () => {
      projects.forEach((project) => {
        if (project.link.startsWith('/') && !project.link.startsWith('//')) {
          if (!project.link.endsWith('/') && !project.link.includes('.')) {
            throw new Error(
              `Project "${project.title}" link should end with a trailing slash: "${project.link}/"`
            );
          }
        }
      });
    });
  });

  describe('Tag Validation', () => {
    it('should have tags as an array', () => {
      projects.forEach((project) => {
        expect(Array.isArray(project.tags)).toBe(true);
        expect(project.tags.length).toBeGreaterThan(0);
      });
    });

    it('should have valid tag strings', () => {
      projects.forEach((project) => {
        project.tags.forEach((tag) => {
          expect(typeof tag).toBe('string');
          expect(tag.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('Visual Content', () => {
    it('should have valid SVG or HTML visual content', () => {
      projects.forEach((project) => {
        expect(typeof project.visual).toBe('string');
        expect(project.visual.length).toBeGreaterThan(0);
        // Should contain basic HTML/SVG markers
        expect(
          project.visual.includes('<') && project.visual.includes('>')
        ).toBe(true);
      });
    });
  });

  describe('Color Themes', () => {
    it('should have valid color theme strings', () => {
      const validThemes = ['blue', 'orange', 'pink', 'green', 'purple', 'red', 'yellow'];

      projects.forEach((project) => {
        expect(typeof project.colorTheme).toBe('string');
        expect(project.colorTheme.length).toBeGreaterThan(0);

        // Optional: enforce specific themes
        // expect(validThemes).toContain(project.colorTheme);
      });
    });
  });
});
