/**
 * Blog Posts Data
 * Add new posts to the beginning of this array
 */

const blogPosts = [
    // CAF Grievance Blog Posts
    {
        id: "digital-submission-2024",
        title: "2024 Digital Grievance Submission: What You Need to Know",
        excerpt: "The CAF has introduced a new digital submission system for grievances. Learn about the key changes, benefits, and how to navigate the new online portal effectively.",
        extendedExcerpt: "The Canadian Armed Forces has modernized the grievance process with a comprehensive digital submission system. This guide covers everything you need to know about the new platform.",
        content: "Full content loaded dynamically",
        author: "Jay Tarzwell",
        date: "December 2024",
        publishDate: new Date("2024-12-15"),
        updateDate: null,
        image: {
            url: "/images/book-cover-ebook-opt.jpg",
            alt: "Digital grievance submission system",
            width: 1200,
            height: 630
        },
        url: "/blog/digital-grievance-submission-2024",
        slug: "digital-grievance-submission-2024",
        readingTime: "8 min read",
        wordCount: 1800,
        tags: ["Digital Transformation", "Grievance Process", "Updates"],
        categories: ["Process Updates"],
        featured: true,
        draft: false,
        seo: {
            title: "2024 CAF Digital Grievance Submission System Guide",
            description: "Complete guide to the new CAF digital grievance submission system introduced in 2024. Learn features, benefits, and how to navigate the online portal.",
            keywords: ["CAF digital grievance", "online grievance submission", "military grievance portal"]
        },
        customFields: {}
    },
    {
        id: "procedural-fairness-deep-dive",
        title: "Procedural Fairness in Military Grievances: A Deep Dive",
        excerpt: "Understanding the principles of procedural fairness is crucial for anyone involved in the CAF grievance process. This comprehensive guide explores the legal framework and practical applications.",
        extendedExcerpt: "Explore the fundamental principles of procedural fairness and natural justice in the Canadian military grievance system, with practical examples and guidance.",
        content: "Full content loaded dynamically",
        author: "Jay Tarzwell",
        date: "December 2024",
        publishDate: new Date("2024-12-01"),
        updateDate: null,
        image: {
            url: "/images/book-cover-ebook-opt.jpg",
            alt: "Procedural fairness in military law",
            width: 1200,
            height: 630
        },
        url: "/blog/procedural-fairness-military-grievances",
        slug: "procedural-fairness-military-grievances",
        readingTime: "12 min read",
        wordCount: 2700,
        tags: ["Procedural Fairness", "Legal Framework", "Natural Justice"],
        categories: ["Legal Analysis"],
        featured: true,
        draft: false,
        seo: {
            title: "Procedural Fairness in CAF Military Grievances - Complete Guide",
            description: "Master the principles of procedural fairness and natural justice in Canadian Armed Forces grievances. Essential reading for grievors and decision-makers.",
            keywords: ["procedural fairness", "natural justice", "military grievances", "CAF legal rights"]
        },
        customFields: {}
    },
    {
        id: "common-grievance-mistakes",
        title: "7 Common Mistakes That Sink Military Grievances",
        excerpt: "Learn from the most frequent errors that undermine otherwise valid grievances. This guide helps you avoid pitfalls that could derail your case.",
        extendedExcerpt: "Avoid the seven most common mistakes that can turn a strong grievance into a dismissed case. Essential reading for anyone filing a CAF grievance.",
        content: "Full content loaded dynamically",
        author: "Jay Tarzwell",
        date: "November 2024",
        publishDate: new Date("2024-11-20"),
        updateDate: null,
        image: {
            url: "/images/book-cover-ebook-opt.jpg",
            alt: "Common military grievance mistakes",
            width: 1200,
            height: 630
        },
        url: "/blog/common-military-grievance-mistakes",
        slug: "common-military-grievance-mistakes",
        readingTime: "10 min read",
        wordCount: 2250,
        tags: ["Grievance Writing", "Tips", "Common Errors"],
        categories: ["Practical Guides"],
        featured: false,
        draft: false,
        seo: {
            title: "7 Common Mistakes in CAF Military Grievances to Avoid",
            description: "Discover the seven most common mistakes that sink military grievances and learn how to avoid them. Essential guide for CAF members filing grievances.",
            keywords: ["grievance mistakes", "CAF grievance tips", "military grievance errors"]
        },
        customFields: {}
    },
    {
        id: "mgerc-precedents-guide",
        title: "Understanding MGERC Precedents: A Practical Guide",
        excerpt: "The Military Grievances External Review Committee provides invaluable precedents for grievances. Learn how to research and apply these decisions to strengthen your case.",
        extendedExcerpt: "Master the art of researching and applying MGERC precedents to strengthen your grievance. This guide shows you how to leverage past decisions effectively.",
        content: "Full content loaded dynamically",
        author: "Jay Tarzwell",
        date: "November 2024",
        publishDate: new Date("2024-11-10"),
        updateDate: null,
        image: {
            url: "/images/book-cover-ebook-opt.jpg",
            alt: "MGERC precedents research guide",
            width: 1200,
            height: 630
        },
        url: "/blog/mgerc-precedents-practical-guide",
        slug: "mgerc-precedents-practical-guide",
        readingTime: "9 min read",
        wordCount: 2025,
        tags: ["MGERC", "Precedents", "Research"],
        categories: ["Research Guides"],
        featured: false,
        draft: false,
        seo: {
            title: "How to Use MGERC Precedents in Your Military Grievance",
            description: "Learn how to research and apply Military Grievances External Review Committee precedents to strengthen your CAF grievance case.",
            keywords: ["MGERC precedents", "military grievance research", "CAF case law"]
        },
        customFields: {}
    },
    {
        id: "administrative-investigations-rights",
        title: "Your Rights During Administrative Investigations",
        excerpt: "Administrative investigations can be stressful and confusing. Know your rights, responsibilities, and how these investigations relate to the grievance process.",
        extendedExcerpt: "Comprehensive guide to your rights during CAF administrative investigations, including how to protect yourself and when investigations become grievable.",
        content: "Full content loaded dynamically",
        author: "Jay Tarzwell",
        date: "October 2024",
        publishDate: new Date("2024-10-25"),
        updateDate: null,
        image: {
            url: "/images/book-cover-ebook-opt.jpg",
            alt: "Rights during administrative investigations",
            width: 1200,
            height: 630
        },
        url: "/blog/rights-during-administrative-investigations",
        slug: "rights-during-administrative-investigations",
        readingTime: "11 min read",
        wordCount: 2475,
        tags: ["Administrative Investigations", "Rights", "Process"],
        categories: ["Legal Rights"],
        featured: false,
        draft: false,
        seo: {
            title: "Your Rights During CAF Administrative Investigations",
            description: "Understand your rights and responsibilities during Canadian Armed Forces administrative investigations. Essential guide for military members under investigation.",
            keywords: ["administrative investigation rights", "CAF investigation process", "military legal rights"]
        },
        customFields: {}
    }
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