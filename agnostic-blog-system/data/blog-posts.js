/**
 * Blog Posts Data
 * Add new posts to the beginning of this array
 */

const blogPosts = [
    // Example post structure - copy and modify for new posts
    {
        id: "post-1",
        title: "Example Blog Post Title",
        excerpt: "A brief description of the blog post that appears in listings.",
        extendedExcerpt: "A longer description that can be used for SEO and social media sharing. This provides more context about the post content.",
        content: "Full HTML content of the blog post (optional - can be loaded from separate file)",
        author: "Author Name",
        date: "January 2025",
        publishDate: new Date("2025-01-01"),
        updateDate: null,
        image: {
            url: "/blog/images/example-post.jpg",
            alt: "Descriptive alt text for the image",
            width: 1200,
            height: 630
        },
        url: "/blog/example-post",
        slug: "example-post",
        readingTime: "5 min read",
        wordCount: 1125,
        tags: ["tutorial", "beginner", "web-development"],
        categories: ["Technology", "Web Development"],
        featured: false,
        draft: false,

        // SEO Metadata
        seo: {
            title: "Custom SEO Title (optional)",
            description: "Custom meta description (optional)",
            keywords: ["keyword1", "keyword2"],
            ogImage: null, // Use different image for social media if needed
        },

        // Custom fields (add any additional data you need)
        customFields: {}
    },

    // Add more posts here...
];

// Helper functions
const BlogPostsData = {
    // Get all published posts
    getPublished: function() {
        return blogPosts.filter(post => !post.draft);
    },

    // Get featured posts
    getFeatured: function() {
        return blogPosts.filter(post => post.featured && !post.draft);
    },

    // Get posts by tag
    getByTag: function(tag) {
        return blogPosts.filter(post =>
            !post.draft && post.tags && post.tags.includes(tag)
        );
    },

    // Get posts by category
    getByCategory: function(category) {
        return blogPosts.filter(post =>
            !post.draft && post.categories && post.categories.includes(category)
        );
    },

    // Get post by ID or slug
    getPost: function(identifier) {
        return blogPosts.find(post =>
            post.id === identifier || post.slug === identifier
        );
    },

    // Get recent posts
    getRecent: function(count = 5) {
        return blogPosts
            .filter(post => !post.draft)
            .sort((a, b) => b.publishDate - a.publishDate)
            .slice(0, count);
    },

    // Get related posts (by tags)
    getRelated: function(postId, limit = 3) {
        const post = this.getPost(postId);
        if (!post || !post.tags) return [];

        return blogPosts
            .filter(p => p.id !== postId && !p.draft)
            .map(p => {
                const sharedTags = p.tags ?
                    p.tags.filter(tag => post.tags.includes(tag)).length : 0;
                return { post: p, score: sharedTags };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(item => item.post);
    },

    // Search posts
    search: function(query) {
        const searchTerm = query.toLowerCase();
        return blogPosts.filter(post => {
            if (post.draft) return false;

            const searchableText = [
                post.title,
                post.excerpt,
                post.extendedExcerpt,
                ...(post.tags || []),
                ...(post.categories || [])
            ].join(' ').toLowerCase();

            return searchableText.includes(searchTerm);
        });
    },

    // Get all unique tags
    getAllTags: function() {
        const tags = new Set();
        blogPosts.forEach(post => {
            if (post.tags && !post.draft) {
                post.tags.forEach(tag => tags.add(tag));
            }
        });
        return Array.from(tags);
    },

    // Get all unique categories
    getAllCategories: function() {
        const categories = new Set();
        blogPosts.forEach(post => {
            if (post.categories && !post.draft) {
                post.categories.forEach(cat => categories.add(cat));
            }
        });
        return Array.from(categories);
    },

    // Get posts for RSS feed
    getRSSPosts: function(limit = 20) {
        return this.getRecent(limit);
    },

    // Add a new post
    addPost: function(postData) {
        const newPost = {
            id: `post-${Date.now()}`,
            publishDate: new Date(),
            draft: false,
            ...postData
        };
        blogPosts.unshift(newPost);
        return newPost;
    },

    // Update a post
    updatePost: function(postId, updates) {
        const index = blogPosts.findIndex(p => p.id === postId);
        if (index !== -1) {
            blogPosts[index] = {
                ...blogPosts[index],
                ...updates,
                updateDate: new Date()
            };
            return blogPosts[index];
        }
        return null;
    },

    // Delete a post
    deletePost: function(postId) {
        const index = blogPosts.findIndex(p => p.id === postId);
        if (index !== -1) {
            blogPosts.splice(index, 1);
            return true;
        }
        return false;
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { blogPosts, BlogPostsData };
}

if (typeof window !== 'undefined') {
    window.blogPosts = blogPosts;
    window.BlogPostsData = BlogPostsData;
}