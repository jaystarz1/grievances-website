/**
 * Blog Engine - Core blog functionality
 * Handles initialization, rendering, and management
 */

class BlogSystem {
    constructor(options = {}) {
        this.config = {
            container: options.container || 'blog-container',
            postsPerPage: options.postsPerPage || 10,
            enableSearch: options.enableSearch !== false,
            enableTags: options.enableTags !== false,
            enableRSS: options.enableRSS !== false,
            enablePagination: options.enablePagination !== false,
            dateFormat: options.dateFormat || 'MMMM DD, YYYY',
            excerptLength: options.excerptLength || 200,
            ...options
        };

        this.currentPage = 1;
        this.currentFilter = null;
        this.currentSearch = '';
        this.posts = [];
        this.filteredPosts = [];
        this.container = null;
        this.initialized = false;
    }

    // Initialize the blog system
    async init() {
        try {
            // Get container element
            this.container = document.getElementById(this.config.container);
            if (!this.container) {
                throw new Error(`Container element #${this.config.container} not found`);
            }

            // Load blog posts
            this.loadPosts();

            // Update tag counts
            if (typeof blogTags !== 'undefined' && blogTags.helpers) {
                blogTags.helpers.updateCounts(this.posts);
            }

            // Set up the UI
            this.render();

            // Set up event listeners
            this.setupEventListeners();

            // Load state from URL
            this.loadStateFromURL();

            // Generate RSS feed if enabled
            if (this.config.enableRSS && typeof RSSGenerator !== 'undefined') {
                this.generateRSSFeed();
            }

            this.initialized = true;
            console.log('Blog system initialized successfully');

        } catch (error) {
            console.error('Failed to initialize blog system:', error);
        }
    }

    // Load blog posts
    loadPosts() {
        if (typeof BlogPostsData !== 'undefined') {
            this.posts = BlogPostsData.getPublished();
        } else if (typeof blogPosts !== 'undefined') {
            this.posts = blogPosts.filter(post => !post.draft);
        } else {
            console.warn('No blog posts data found');
            this.posts = [];
        }
        this.filteredPosts = [...this.posts];
    }

    // Main render function
    render() {
        // Clear container
        this.container.innerHTML = '';

        // Create main structure
        const html = `
            <div class="blog-system">
                ${this.renderHeader()}
                ${this.renderFilters()}
                <div class="blog-content">
                    ${this.renderPosts()}
                </div>
                ${this.renderPagination()}
            </div>
        `;

        this.container.innerHTML = html;
    }

    // Render header with search
    renderHeader() {
        if (!this.config.enableSearch) return '';

        return `
            <div class="blog-header">
                <div class="blog-search-container">
                    <form id="blog-search-form" class="blog-search-form">
                        <input
                            type="search"
                            id="blog-search-input"
                            class="blog-search-input"
                            placeholder="Search posts..."
                            value="${this.currentSearch}"
                        >
                        <button type="submit" class="blog-search-btn">Search</button>
                        ${this.currentSearch ? `
                            <button type="button" id="clear-search" class="blog-clear-btn">Clear</button>
                        ` : ''}
                    </form>
                </div>
                <div class="blog-results-count">
                    ${this.getResultsCountText()}
                </div>
            </div>
        `;
    }

    // Render tag filters
    renderFilters() {
        if (!this.config.enableTags || typeof blogTags === 'undefined') return '';

        let html = '<div class="blog-filters">';

        // Render each category
        Object.entries(blogTags.categories).forEach(([categoryKey, category]) => {
            html += `
                <div class="tag-category" data-category="${categoryKey}">
                    <h3 class="tag-category-title">${category.name}</h3>
                    <div class="tag-list">
            `;

            Object.entries(category.tags).forEach(([tagId, tag]) => {
                const isActive = this.currentFilter === tagId;
                const hasPost = tag.count > 0;

                html += `
                    <button
                        class="tag-btn ${isActive ? 'active' : ''} ${!hasPost ? 'disabled' : ''}"
                        data-tag="${tagId}"
                        ${!hasPost ? 'disabled' : ''}
                    >
                        ${tag.icon || ''} ${tag.label}
                        <span class="tag-count">(${tag.count})</span>
                    </button>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        });

        // Add clear filter button if active
        if (this.currentFilter) {
            html += `
                <button class="clear-filters-btn" id="clear-filters">
                    Clear Filters
                </button>
            `;
        }

        html += '</div>';
        return html;
    }

    // Render blog posts
    renderPosts() {
        // Get posts for current page
        const startIndex = (this.currentPage - 1) * this.config.postsPerPage;
        const endIndex = startIndex + this.config.postsPerPage;
        const postsToShow = this.filteredPosts.slice(startIndex, endIndex);

        if (postsToShow.length === 0) {
            return this.renderNoResults();
        }

        let html = '<div class="blog-posts-grid">';

        postsToShow.forEach(post => {
            html += this.renderPostCard(post);
        });

        html += '</div>';
        return html;
    }

    // Render single post card
    renderPostCard(post) {
        const readingTime = post.readingTime || this.calculateReadingTime(post);
        const excerpt = post.excerpt || this.truncateText(post.content, this.config.excerptLength);
        const formattedDate = this.formatDate(post.publishDate || post.date);

        return `
            <article class="blog-card" data-post-id="${post.id}">
                ${post.image ? `
                    <div class="blog-card-image">
                        <img
                            src="${post.image.url || post.image}"
                            alt="${post.image.alt || post.title}"
                            loading="lazy"
                        >
                    </div>
                ` : ''}
                <div class="blog-card-content">
                    <div class="blog-meta">
                        <span class="blog-date">${formattedDate}</span>
                        <span class="blog-reading-time">${readingTime}</span>
                    </div>
                    <h2 class="blog-title">
                        <a href="${post.url}" class="blog-link">
                            ${post.title}
                        </a>
                    </h2>
                    <p class="blog-excerpt">${excerpt}</p>
                    ${this.renderPostTags(post)}
                    <a href="${post.url}" class="read-more">
                        Read more →
                    </a>
                </div>
            </article>
        `;
    }

    // Render post tags
    renderPostTags(post) {
        if (!post.tags || post.tags.length === 0) return '';

        let html = '<div class="blog-post-tags">';

        post.tags.forEach(tagId => {
            const tag = blogTags?.helpers?.getTag(tagId);
            if (tag) {
                html += `
                    <span class="blog-post-tag" data-tag="${tagId}">
                        ${tag.icon || ''} ${tag.label}
                    </span>
                `;
            }
        });

        html += '</div>';
        return html;
    }

    // Render pagination
    renderPagination() {
        if (!this.config.enablePagination) return '';

        const totalPages = Math.ceil(this.filteredPosts.length / this.config.postsPerPage);

        if (totalPages <= 1) return '';

        let html = '<div class="blog-pagination">';

        // Previous button
        if (this.currentPage > 1) {
            html += `
                <button class="pagination-btn" data-page="${this.currentPage - 1}">
                    ← Previous
                </button>
            `;
        }

        // Page numbers
        html += '<div class="pagination-numbers">';
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= this.currentPage - 2 && i <= this.currentPage + 2)
            ) {
                html += `
                    <button
                        class="pagination-number ${i === this.currentPage ? 'active' : ''}"
                        data-page="${i}"
                    >
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                html += '<span class="pagination-ellipsis">...</span>';
            }
        }
        html += '</div>';

        // Next button
        if (this.currentPage < totalPages) {
            html += `
                <button class="pagination-btn" data-page="${this.currentPage + 1}">
                    Next →
                </button>
            `;
        }

        html += '</div>';
        return html;
    }

    // Render no results message
    renderNoResults() {
        return `
            <div class="blog-no-results">
                <h3>No posts found</h3>
                <p>Try adjusting your search or filters.</p>
                ${this.currentSearch || this.currentFilter ? `
                    <button class="btn" onclick="blogSystem.clearAll()">
                        Clear all filters
                    </button>
                ` : ''}
            </div>
        `;
    }

    // Get results count text
    getResultsCountText() {
        const total = this.posts.length;
        const filtered = this.filteredPosts.length;

        if (filtered === total) {
            return `Showing all ${total} posts`;
        } else {
            return `Showing ${filtered} of ${total} posts`;
        }
    }

    // Set up event listeners
    setupEventListeners() {
        // Search form
        const searchForm = document.getElementById('blog-search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSearch();
            });
        }

        // Clear search
        const clearBtn = document.getElementById('clear-search');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearSearch();
            });
        }

        // Tag filters
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('tag-btn') && !e.target.disabled) {
                const tag = e.target.dataset.tag;
                this.filterByTag(tag);
            }

            if (e.target.classList.contains('clear-filters-btn')) {
                this.clearFilters();
            }

            // Pagination
            if (e.target.dataset.page) {
                this.goToPage(parseInt(e.target.dataset.page));
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.loadStateFromURL();
        });
    }

    // Handle search
    handleSearch() {
        const input = document.getElementById('blog-search-input');
        if (input) {
            this.currentSearch = input.value.trim();
            this.applyFilters();
            this.updateURL();
        }
    }

    // Clear search
    clearSearch() {
        this.currentSearch = '';
        const input = document.getElementById('blog-search-input');
        if (input) input.value = '';
        this.applyFilters();
        this.updateURL();
    }

    // Filter by tag
    filterByTag(tag) {
        if (this.currentFilter === tag) {
            this.currentFilter = null;
        } else {
            this.currentFilter = tag;
        }
        this.applyFilters();
        this.updateURL();
    }

    // Clear filters
    clearFilters() {
        this.currentFilter = null;
        this.applyFilters();
        this.updateURL();
    }

    // Clear all filters and search
    clearAll() {
        this.currentSearch = '';
        this.currentFilter = null;
        this.currentPage = 1;
        this.applyFilters();
        this.updateURL();
    }

    // Apply all filters
    applyFilters() {
        let filtered = [...this.posts];

        // Apply search filter
        if (this.currentSearch) {
            filtered = BlogPostsData?.search(this.currentSearch) ||
                filtered.filter(post => {
                    const searchableText = [
                        post.title,
                        post.excerpt,
                        post.extendedExcerpt,
                        ...(post.tags || []),
                        ...(post.categories || [])
                    ].join(' ').toLowerCase();

                    return searchableText.includes(this.currentSearch.toLowerCase());
                });
        }

        // Apply tag filter
        if (this.currentFilter) {
            filtered = filtered.filter(post =>
                post.tags && post.tags.includes(this.currentFilter)
            );
        }

        this.filteredPosts = filtered;
        this.currentPage = 1; // Reset to first page
        this.render();
    }

    // Go to specific page
    goToPage(page) {
        this.currentPage = page;
        this.render();
        this.updateURL();

        // Scroll to top of blog container
        this.container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Update URL with current state
    updateURL() {
        const params = new URLSearchParams();

        if (this.currentSearch) {
            params.set('search', this.currentSearch);
        }

        if (this.currentFilter) {
            params.set('tag', this.currentFilter);
        }

        if (this.currentPage > 1) {
            params.set('page', this.currentPage);
        }

        const newURL = params.toString() ?
            `${window.location.pathname}?${params.toString()}` :
            window.location.pathname;

        window.history.pushState({}, '', newURL);
    }

    // Load state from URL
    loadStateFromURL() {
        const params = new URLSearchParams(window.location.search);

        this.currentSearch = params.get('search') || '';
        this.currentFilter = params.get('tag') || null;
        this.currentPage = parseInt(params.get('page')) || 1;

        this.applyFilters();
    }

    // Helper: Format date
    formatDate(date) {
        if (!date) return '';

        const d = new Date(date);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return d.toLocaleDateString('en-US', options);
    }

    // Helper: Calculate reading time
    calculateReadingTime(post) {
        const wordsPerMinute = this.config.wordsPerMinute || 225;
        const wordCount = post.wordCount ||
            (post.content ? post.content.split(' ').length : 500);
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return `${minutes} min read`;
    }

    // Helper: Truncate text
    truncateText(text, length) {
        if (!text) return '';
        const cleaned = text.replace(/<[^>]+>/g, ''); // Strip HTML
        if (cleaned.length <= length) return cleaned;
        return cleaned.substr(0, length).trim() + '...';
    }

    // Generate RSS feed
    async generateRSSFeed() {
        if (typeof RSSGenerator === 'undefined') return;

        try {
            const feed = await RSSGenerator.generate(this.posts);
            console.log('RSS feed generated');
        } catch (error) {
            console.error('Failed to generate RSS feed:', error);
        }
    }

    // Public API methods

    // Add a new post
    addPost(postData) {
        const newPost = BlogPostsData?.addPost(postData) || {
            id: `post-${Date.now()}`,
            publishDate: new Date(),
            draft: false,
            ...postData
        };

        this.posts.unshift(newPost);
        this.applyFilters();
        return newPost;
    }

    // Update a post
    updatePost(postId, updates) {
        const post = BlogPostsData?.updatePost(postId, updates);
        if (post) {
            this.loadPosts();
            this.applyFilters();
        }
        return post;
    }

    // Delete a post
    deletePost(postId) {
        const success = BlogPostsData?.deletePost(postId);
        if (success) {
            this.loadPosts();
            this.applyFilters();
        }
        return success;
    }

    // Get related posts
    getRelatedPosts(postId, limit = 3) {
        return BlogPostsData?.getRelated(postId, limit) || [];
    }

    // Generate image for post (placeholder)
    async generateImage(postData) {
        if (typeof ImageGenerator !== 'undefined') {
            return await ImageGenerator.generate(postData);
        }
        console.log('Image generation placeholder - implement in image-generator.js');
        return null;
    }
}

// Create global instance if needed
if (typeof window !== 'undefined') {
    window.BlogSystem = BlogSystem;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogSystem;
}