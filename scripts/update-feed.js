#!/usr/bin/env node

/**
 * Update RSS Feed Script
 * Generates RSS, Atom, and JSON feeds from blog posts
 */

const fs = require('fs').promises;
const path = require('path');

// Load configuration
async function loadConfig() {
    try {
        const configPath = path.join(__dirname, '..', 'config.js');
        const config = require(configPath);
        return config;
    } catch (error) {
        console.warn('Could not load config.js, using defaults');
        return {
            siteName: 'Your Blog',
            siteUrl: 'https://yoursite.com',
            siteDescription: 'Blog description',
            author: { name: 'Author', email: 'author@site.com' }
        };
    }
}

// Load blog posts
async function loadPosts() {
    try {
        const postsPath = path.join(__dirname, '..', 'data', 'blog-posts.js');
        const { BlogPostsData } = require(postsPath);
        return BlogPostsData.getRSSPosts(20);
    } catch (error) {
        console.error('Could not load blog posts:', error.message);
        return [];
    }
}

// Load RSS generator
async function loadGenerator() {
    try {
        const generatorPath = path.join(__dirname, '..', 'js', 'rss-generator.js');
        return require(generatorPath);
    } catch (error) {
        console.error('Could not load RSS generator:', error.message);
        return null;
    }
}

// Main function
async function updateFeeds() {
    console.log('📡 Updating RSS feeds...\n');

    try {
        // Load dependencies
        const config = await loadConfig();
        const posts = await loadPosts();
        const RSSGenerator = await loadGenerator();

        if (!RSSGenerator) {
            throw new Error('RSS generator not available');
        }

        if (posts.length === 0) {
            console.warn('⚠️  No published posts found');
            return;
        }

        console.log(`Found ${posts.length} posts to include in feeds\n`);

        // Configure generator
        RSSGenerator.setConfig({
            title: `${config.siteName} - Blog`,
            link: `${config.siteUrl}/blog`,
            description: config.siteDescription,
            managingEditor: config.author.email,
            webMaster: config.author.email,
            atomLink: `${config.siteUrl}/feed.xml`
        });

        // Generate feeds
        const outputDir = path.join(process.cwd());

        // RSS 2.0
        console.log('📝 Generating RSS 2.0 feed...');
        const rssFeed = RSSGenerator.generate(posts);
        await fs.writeFile(path.join(outputDir, 'feed.xml'), rssFeed);
        console.log('✅ RSS feed saved to feed.xml');

        // Atom
        console.log('📝 Generating Atom feed...');
        const atomFeed = RSSGenerator.generateAtom(posts);
        await fs.writeFile(path.join(outputDir, 'atom.xml'), atomFeed);
        console.log('✅ Atom feed saved to atom.xml');

        // JSON Feed
        console.log('📝 Generating JSON feed...');
        const jsonFeed = RSSGenerator.generateJSON(posts);
        await fs.writeFile(path.join(outputDir, 'feed.json'), jsonFeed);
        console.log('✅ JSON feed saved to feed.json');

        // Generate feed discovery HTML
        const feedDiscovery = generateFeedDiscovery(config.siteUrl);
        await fs.writeFile(path.join(outputDir, 'feed-discovery.html'), feedDiscovery);
        console.log('✅ Feed discovery HTML saved');

        console.log('\n✨ All feeds updated successfully!');
        console.log('\nAdd these links to your HTML <head>:');
        console.log(`<link rel="alternate" type="application/rss+xml" title="RSS" href="/feed.xml">`);
        console.log(`<link rel="alternate" type="application/atom+xml" title="Atom" href="/atom.xml">`);
        console.log(`<link rel="alternate" type="application/json" title="JSON Feed" href="/feed.json">`);

    } catch (error) {
        console.error('❌ Error updating feeds:', error.message);
        process.exit(1);
    }
}

// Generate feed discovery HTML snippet
function generateFeedDiscovery(siteUrl) {
    return `<!-- Feed Discovery Links -->
<!-- Add these to your HTML <head> section -->
<link rel="alternate" type="application/rss+xml" title="RSS Feed" href="${siteUrl}/feed.xml">
<link rel="alternate" type="application/atom+xml" title="Atom Feed" href="${siteUrl}/atom.xml">
<link rel="alternate" type="application/json" title="JSON Feed" href="${siteUrl}/feed.json">

<!-- Feed subscription buttons -->
<!-- Add these where you want feed subscription options -->
<div class="feed-subscription">
    <h3>Subscribe to Updates</h3>
    <div class="feed-buttons">
        <a href="${siteUrl}/feed.xml" class="feed-button rss">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.429 5.1v2.4c7.248 0 13.114 5.886 13.114 13.143h2.4C18.943 12.233 11.838 5.1 3.429 5.1zm0 4.8v2.4c3.936 0 7.143 3.207 7.143 7.143h2.4c0-5.256-4.287-9.543-9.543-9.543zM6.171 14.7c-1.508 0-2.742 1.234-2.742 2.743S4.663 20.186 6.171 20.186s2.743-1.235 2.743-2.743S7.679 14.7 6.171 14.7z"/>
            </svg>
            RSS Feed
        </a>
        <a href="${siteUrl}/atom.xml" class="feed-button atom">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="2"/>
                <circle cx="12" cy="5" r="2"/>
                <circle cx="12" cy="19" r="2"/>
                <circle cx="5" cy="12" r="2"/>
                <circle cx="19" cy="12" r="2"/>
                <circle cx="7" cy="7" r="1.5"/>
                <circle cx="17" cy="7" r="1.5"/>
                <circle cx="7" cy="17" r="1.5"/>
                <circle cx="17" cy="17" r="1.5"/>
            </svg>
            Atom Feed
        </a>
        <a href="${siteUrl}/feed.json" class="feed-button json">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 3h14c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2zm7 14c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zm-2-4c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zm4 4c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zm2-4c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zm-4-4c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zm4 0c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1z"/>
            </svg>
            JSON Feed
        </a>
    </div>
</div>

<style>
.feed-subscription {
    margin: 2rem 0;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    text-align: center;
}

.feed-subscription h3 {
    margin-bottom: 1rem;
    color: #333;
}

.feed-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.feed-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    color: #333;
    text-decoration: none;
    transition: all 0.3s ease;
}

.feed-button:hover {
    background: #f0f0f0;
    border-color: #999;
}

.feed-button svg {
    width: 20px;
    height: 20px;
}

.feed-button.rss { border-left: 3px solid #ff9900; }
.feed-button.atom { border-left: 3px solid #4a90e2; }
.feed-button.json { border-left: 3px solid #27ae60; }
</style>`;
}

// Run the script
updateFeeds();