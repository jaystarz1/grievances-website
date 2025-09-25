# Agnostic Blog System

A complete, portable blog system that can be integrated into any webpage. Based on The Chatbot Genius blog architecture but made completely agnostic.

## Features
- Blog post data management (JSON-based)
- Tag/category system with filtering
- Search functionality
- RSS feed generation
- AI image generation placeholder
- SEO optimization
- Responsive design
- No framework dependencies

## Quick Start

1. Copy the entire `agnostic-blog-system` folder to your project
2. Configure your settings in `config.js`
3. Add blog posts to `data/blog-posts.js`
4. Include the necessary files in your HTML
5. Initialize the blog system

## File Structure

```
agnostic-blog-system/
├── README.md                   # This file
├── config.js                   # Main configuration
├── data/
│   ├── blog-posts.js          # Blog post data
│   └── tags.js                # Tag definitions
├── js/
│   ├── blog-engine.js         # Core blog functionality
│   ├── search.js              # Search engine
│   ├── rss-generator.js       # RSS feed generator
│   └── image-generator.js     # AI image generation (placeholder)
├── css/
│   └── blog.css               # Blog-specific styles
├── templates/
│   ├── blog-post.html         # Single post template
│   └── blog-listing.html      # Blog listing template
└── scripts/
    ├── create-post.js         # Create new blog post
    └── update-feed.js         # Update RSS feed
```

## Integration Steps

### 1. Basic Setup

Include the required files in your HTML:

```html
<!-- CSS -->
<link rel="stylesheet" href="agnostic-blog-system/css/blog.css">

<!-- JavaScript -->
<script src="agnostic-blog-system/data/blog-posts.js"></script>
<script src="agnostic-blog-system/data/tags.js"></script>
<script src="agnostic-blog-system/js/blog-engine.js"></script>
<script src="agnostic-blog-system/js/search.js"></script>
```

### 2. Initialize Blog on Page

```html
<div id="blog-container"></div>

<script>
// Initialize blog system
const blogSystem = new BlogSystem({
    container: 'blog-container',
    postsPerPage: 10,
    enableSearch: true,
    enableTags: true,
    enableRSS: true
});

blogSystem.init();
</script>
```

### 3. Add New Blog Post

```javascript
// Run from command line:
node agnostic-blog-system/scripts/create-post.js

// Or programmatically:
blogSystem.addPost({
    title: "Your Post Title",
    excerpt: "Short description",
    content: "Full content...",
    tags: ["tag1", "tag2"],
    image: "path/to/image.jpg"
});
```

## Configuration

Edit `config.js` to customize:

```javascript
const blogConfig = {
    // Site information
    siteName: "Your Site Name",
    siteUrl: "https://yoursite.com",
    author: "Your Name",

    // Features
    enableSearch: true,
    enableTags: true,
    enableRSS: true,
    enableImageGeneration: false,

    // API Keys (for image generation)
    imageAPIKey: process.env.AI_IMAGE_API_KEY || "",
    imageAPIType: "OPENAI", // or "STABILITY", "REPLICATE"

    // Paths
    blogPath: "/blog",
    imagePath: "/blog/images",

    // Display
    postsPerPage: 10,
    dateFormat: "MMMM YYYY"
};
```

## API Integration

### Image Generation

The system includes a placeholder for AI image generation. To enable:

1. Set your API key in environment variables or config
2. Enable image generation in config
3. The system will call the image generation API when creating posts

```javascript
// Image generation happens automatically when enabled
// Or manually trigger:
await blogSystem.generateImage(postData);
```

### RSS Feed

RSS feed is automatically generated at `/feed.xml` when posts are added/updated.

## Customization

### Styling

All styles are in `css/blog.css` with CSS variables for easy theming:

```css
:root {
    --blog-primary-color: #1a1f71;
    --blog-accent-color: #f9c74f;
    --blog-text-color: #333;
    --blog-bg-color: #f8f9fa;
}
```

### Templates

Modify templates in the `templates/` folder to match your site design.

## License

MIT License - Use freely in your projects