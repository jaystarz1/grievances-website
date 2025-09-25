/**
 * Blog System Configuration
 * Customize these settings for your website
 */

const blogConfig = {
    // Site Information
    siteName: "Your Site Name",
    siteUrl: "https://yoursite.com",
    siteDescription: "Your site description",
    author: {
        name: "Your Name",
        email: "your@email.com",
        bio: "Your bio here"
    },

    // Features
    features: {
        search: true,           // Enable search functionality
        tags: true,            // Enable tag filtering
        rss: true,             // Enable RSS feed generation
        imageGeneration: false, // Enable AI image generation
        analytics: false,       // Enable analytics tracking
        comments: false        // Enable comments system
    },

    // API Configuration
    api: {
        // Image Generation API (set in environment variables)
        imageAPIKey: process.env.AI_IMAGE_API_KEY || "",
        imageAPIType: "OPENAI", // Options: "OPENAI", "STABILITY", "REPLICATE"

        // Analytics (if enabled)
        analyticsID: "", // e.g., "G-XXXXXXXXXX" for Google Analytics
    },

    // Paths Configuration
    paths: {
        blogBase: "/blog",              // Base path for blog
        postsPath: "/blog/posts",       // Individual posts path
        imagesPath: "/blog/images",     // Blog images path
        apiEndpoint: "/api/blog",       // API endpoint (if using)
        feedPath: "/feed.xml"           // RSS feed path
    },

    // Display Settings
    display: {
        postsPerPage: 10,               // Posts per page in listing
        excerptLength: 200,             // Characters in excerpt
        relatedPostsCount: 3,           // Related posts to show
        dateFormat: "MMMM DD, YYYY",    // Date display format
        readingTimeWPM: 225,            // Words per minute for reading time
        lazyLoadImages: true            // Lazy load images
    },

    // SEO Settings
    seo: {
        defaultImage: "/default-blog-image.jpg",
        twitterHandle: "@yourhandle",
        locale: "en_US",
        enableStructuredData: true
    },

    // Image Generation Settings
    imageGeneration: {
        width: 1200,
        height: 630,
        quality: 80,
        format: "jpg", // Options: "jpg", "png", "webp"
        style: "dramatic comic-style illustration", // Default style prompt addition
        autoGenerate: false // Auto-generate on post creation
    },

    // Tag Categories
    tagCategories: {
        topics: {
            name: "Topics",
            color: "#4c5fd5"
        },
        difficulty: {
            name: "Difficulty",
            color: "#f39c12"
        },
        type: {
            name: "Content Type",
            color: "#27ae60"
        }
    },

    // Custom Fields (add your own metadata fields)
    customFields: {
        // Example: department, category, etc.
    },

    // Hooks (functions called at various points)
    hooks: {
        beforePostCreate: null,    // Function called before creating a post
        afterPostCreate: null,     // Function called after creating a post
        beforeImageGenerate: null, // Function called before generating image
        afterImageGenerate: null   // Function called after generating image
    }
};

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = blogConfig;
}

// Make available in browser
if (typeof window !== 'undefined') {
    window.blogConfig = blogConfig;
}