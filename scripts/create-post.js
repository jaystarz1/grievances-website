#!/usr/bin/env node

/**
 * Create Blog Post Script
 * Interactive CLI to create new blog posts
 */

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Helper to prompt user
const prompt = (question) => new Promise((resolve) => {
    rl.question(question, resolve);
});

// Slugify title for URL
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
}

// Generate post ID
function generateId() {
    return `post-${Date.now()}`;
}

// Main function
async function createPost() {
    console.log('\n📝 Blog Post Creator\n');

    try {
        // Gather post information
        const title = await prompt('Post title: ');
        const author = await prompt('Author name (default: Your Name): ') || 'Your Name';
        const excerpt = await prompt('Short excerpt (1-2 sentences): ');
        const tags = (await prompt('Tags (comma-separated): ')).split(',').map(t => t.trim());
        const categories = (await prompt('Categories (comma-separated): ')).split(',').map(c => c.trim());
        const featured = (await prompt('Featured post? (y/n): ')).toLowerCase() === 'y';
        const draft = (await prompt('Save as draft? (y/n): ')).toLowerCase() === 'y';

        // Generate post data
        const postId = generateId();
        const slug = slugify(title);
        const publishDate = new Date();
        const filename = `${slug}.html`;

        // Create post object
        const postData = {
            id: postId,
            title,
            excerpt,
            extendedExcerpt: excerpt,
            author,
            date: publishDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            publishDate,
            image: {
                url: `/blog/images/${slug}.jpg`,
                alt: `${title} header image`
            },
            url: `/blog/${slug}`,
            slug,
            readingTime: '5 min read',
            tags: tags.filter(t => t),
            categories: categories.filter(c => c),
            featured,
            draft
        };

        // Create HTML content
        const htmlContent = generateHTML(postData);

        // Save files
        const blogDir = path.join(process.cwd(), 'agnostic-blog-system');
        const postsDataPath = path.join(blogDir, 'data', 'blog-posts.js');
        const htmlPath = path.join(blogDir, 'templates', filename);

        // Read existing posts
        let postsContent = await fs.readFile(postsDataPath, 'utf-8');

        // Find the blogPosts array
        const arrayStart = postsContent.indexOf('const blogPosts = [');
        const arrayEnd = postsContent.indexOf('];', arrayStart);

        if (arrayStart === -1 || arrayEnd === -1) {
            throw new Error('Could not find blogPosts array in data file');
        }

        // Insert new post at the beginning of array
        const newPostJS = JSON.stringify(postData, null, 8)
            .replace(/^/gm, '    ')
            .trim();

        const updatedContent =
            postsContent.slice(0, arrayStart + 'const blogPosts = ['.length) +
            '\n    ' + newPostJS + ',' +
            postsContent.slice(arrayStart + 'const blogPosts = ['.length, arrayEnd) +
            postsContent.slice(arrayEnd);

        // Save updated posts data
        await fs.writeFile(postsDataPath, updatedContent);
        console.log(`✅ Post data saved to ${postsDataPath}`);

        // Save HTML template
        await fs.writeFile(htmlPath, htmlContent);
        console.log(`✅ HTML template saved to ${htmlPath}`);

        // Generate image if configured
        console.log('\n🎨 Image generation placeholder activated');
        console.log('   Configure your API key in config.js to enable automatic image generation');

        console.log('\n✨ Blog post created successfully!');
        console.log(`   ID: ${postId}`);
        console.log(`   Slug: ${slug}`);
        console.log(`   Status: ${draft ? 'Draft' : 'Published'}`);

    } catch (error) {
        console.error('❌ Error creating post:', error.message);
    } finally {
        rl.close();
    }
}

// Generate HTML template
function generateHTML(post) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title}</title>
    <meta name="description" content="${post.excerpt}">
    <meta name="author" content="${post.author}">
    <meta property="og:title" content="${post.title}">
    <meta property="og:description" content="${post.excerpt}">
    <meta property="og:type" content="article">
    <meta property="article:published_time" content="${post.publishDate.toISOString()}">

    <!-- Include blog CSS -->
    <link rel="stylesheet" href="../css/blog.css">
</head>
<body>
    <article class="blog-post">
        <header class="blog-post-header">
            ${post.image ? `
            <div class="blog-post-hero">
                <img src="${post.image.url}" alt="${post.image.alt}" />
            </div>
            ` : ''}
            <div class="blog-post-meta">
                <time datetime="${post.publishDate.toISOString()}">${post.date}</time>
                <span class="blog-post-author">By ${post.author}</span>
                <span class="blog-post-reading-time">${post.readingTime}</span>
            </div>
            <h1 class="blog-post-title">${post.title}</h1>
            ${post.tags.length > 0 ? `
            <div class="blog-post-tags">
                ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            ` : ''}
        </header>

        <div class="blog-post-content">
            <!-- Add your content here -->
            <p>${post.excerpt}</p>

            <h2>Introduction</h2>
            <p>Start writing your blog post content here...</p>

            <h2>Main Content</h2>
            <p>Continue with your main points...</p>

            <h2>Conclusion</h2>
            <p>Wrap up your post...</p>
        </div>

        <footer class="blog-post-footer">
            <div class="blog-post-share">
                <h3>Share this post</h3>
                <!-- Add share buttons here -->
            </div>

            <div class="blog-post-related">
                <h3>Related Posts</h3>
                <!-- Related posts will be populated by JavaScript -->
                <div id="related-posts"></div>
            </div>
        </footer>
    </article>

    <!-- Include blog JavaScript -->
    <script src="../data/blog-posts.js"></script>
    <script src="../js/blog-engine.js"></script>
    <script>
        // Display related posts
        const blogSystem = new BlogSystem();
        const relatedPosts = blogSystem.getRelatedPosts('${post.id}');
        // Render related posts...
    </script>
</body>
</html>`;
}

// Run the script
createPost();