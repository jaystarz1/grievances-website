/**
 * RSS Feed Generator
 * Generates RSS/XML feeds from blog posts
 */

const RSSGenerator = {
    // Default configuration
    config: {
        title: "Blog RSS Feed",
        link: "https://yoursite.com/blog",
        description: "Latest blog posts",
        language: "en-us",
        copyright: "Copyright 2025",
        managingEditor: "editor@yoursite.com",
        webMaster: "webmaster@yoursite.com",
        ttl: 60, // Time to live in minutes
        atomLink: "https://yoursite.com/feed.xml"
    },

    // Override configuration
    setConfig: function(newConfig) {
        this.config = { ...this.config, ...newConfig };
    },

    // Escape XML special characters
    escapeXML: function(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    },

    // Format date for RSS (RFC 822)
    formatRSSDate: function(date) {
        if (!date) return new Date().toUTCString();
        return new Date(date).toUTCString();
    },

    // Generate CDATA section
    cdata: function(content) {
        return `<![CDATA[${content}]]>`;
    },

    // Generate RSS feed XML
    generate: function(posts, options = {}) {
        const config = { ...this.config, ...options };
        const items = posts.slice(0, options.limit || 20); // Limit feed items

        // Build RSS XML
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">\n';
        xml += '  <channel>\n';

        // Channel information
        xml += `    <title>${this.escapeXML(config.title)}</title>\n`;
        xml += `    <link>${this.escapeXML(config.link)}</link>\n`;
        xml += `    <description>${this.escapeXML(config.description)}</description>\n`;
        xml += `    <language>${config.language}</language>\n`;
        xml += `    <copyright>${this.escapeXML(config.copyright)}</copyright>\n`;

        if (config.managingEditor) {
            xml += `    <managingEditor>${this.escapeXML(config.managingEditor)}</managingEditor>\n`;
        }

        if (config.webMaster) {
            xml += `    <webMaster>${this.escapeXML(config.webMaster)}</webMaster>\n`;
        }

        xml += `    <lastBuildDate>${this.formatRSSDate(new Date())}</lastBuildDate>\n`;
        xml += `    <generator>Agnostic Blog System RSS Generator</generator>\n`;

        if (config.ttl) {
            xml += `    <ttl>${config.ttl}</ttl>\n`;
        }

        // Atom link for feed autodiscovery
        xml += `    <atom:link href="${this.escapeXML(config.atomLink)}" rel="self" type="application/rss+xml" />\n`;

        // Add image if provided
        if (config.image) {
            xml += '    <image>\n';
            xml += `      <url>${this.escapeXML(config.image.url)}</url>\n`;
            xml += `      <title>${this.escapeXML(config.image.title || config.title)}</title>\n`;
            xml += `      <link>${this.escapeXML(config.image.link || config.link)}</link>\n`;
            if (config.image.width) {
                xml += `      <width>${config.image.width}</width>\n`;
            }
            if (config.image.height) {
                xml += `      <height>${config.image.height}</height>\n`;
            }
            xml += '    </image>\n';
        }

        // Add items (blog posts)
        items.forEach(post => {
            xml += this.generateItem(post, config);
        });

        xml += '  </channel>\n';
        xml += '</rss>';

        return xml;
    },

    // Generate individual RSS item
    generateItem: function(post, config) {
        let item = '    <item>\n';

        // Title
        item += `      <title>${this.escapeXML(post.title)}</title>\n`;

        // Link
        const postUrl = post.url.startsWith('http') ?
            post.url :
            `${config.link.replace(/\/blog\/?$/, '')}${post.url}`;
        item += `      <link>${this.escapeXML(postUrl)}</link>\n`;

        // Description (excerpt)
        const description = post.excerpt || post.extendedExcerpt || '';
        item += `      <description>${this.cdata(description)}</description>\n`;

        // Full content if available
        if (post.content) {
            item += `      <content:encoded>${this.cdata(post.content)}</content:encoded>\n`;
        }

        // Author
        const author = post.author || config.managingEditor || 'editor@site.com';
        item += `      <author>${this.escapeXML(author)}</author>\n`;

        // GUID (globally unique identifier)
        item += `      <guid isPermaLink="true">${this.escapeXML(postUrl)}</guid>\n`;

        // Publication date
        item += `      <pubDate>${this.formatRSSDate(post.publishDate || post.date)}</pubDate>\n`;

        // Categories/Tags
        if (post.categories) {
            post.categories.forEach(category => {
                item += `      <category>${this.escapeXML(category)}</category>\n`;
            });
        }

        if (post.tags) {
            post.tags.forEach(tag => {
                item += `      <category>${this.escapeXML(tag)}</category>\n`;
            });
        }

        // Enclosure for images
        if (post.image) {
            const imageUrl = post.image.url || post.image;
            if (imageUrl) {
                const fullImageUrl = imageUrl.startsWith('http') ?
                    imageUrl :
                    `${config.link.replace(/\/blog\/?$/, '')}${imageUrl}`;

                item += `      <enclosure url="${this.escapeXML(fullImageUrl)}" type="image/jpeg" />\n`;
            }
        }

        item += '    </item>\n';
        return item;
    },

    // Generate Atom feed (alternative format)
    generateAtom: function(posts, options = {}) {
        const config = { ...this.config, ...options };
        const items = posts.slice(0, options.limit || 20);

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<feed xmlns="http://www.w3.org/2005/Atom">\n';

        // Feed metadata
        xml += `  <title>${this.escapeXML(config.title)}</title>\n`;
        xml += `  <link href="${this.escapeXML(config.atomLink)}" rel="self" />\n`;
        xml += `  <link href="${this.escapeXML(config.link)}" />\n`;
        xml += `  <updated>${new Date().toISOString()}</updated>\n`;
        xml += `  <id>${this.escapeXML(config.link)}</id>\n`;

        if (config.author) {
            xml += '  <author>\n';
            xml += `    <name>${this.escapeXML(config.author.name || 'Author')}</name>\n`;
            if (config.author.email) {
                xml += `    <email>${this.escapeXML(config.author.email)}</email>\n`;
            }
            xml += '  </author>\n';
        }

        // Add entries
        items.forEach(post => {
            xml += this.generateAtomEntry(post, config);
        });

        xml += '</feed>';
        return xml;
    },

    // Generate Atom entry
    generateAtomEntry: function(post, config) {
        const postUrl = post.url.startsWith('http') ?
            post.url :
            `${config.link.replace(/\/blog\/?$/, '')}${post.url}`;

        let entry = '  <entry>\n';
        entry += `    <title>${this.escapeXML(post.title)}</title>\n`;
        entry += `    <link href="${this.escapeXML(postUrl)}" />\n`;
        entry += `    <id>${this.escapeXML(postUrl)}</id>\n`;
        entry += `    <updated>${new Date(post.publishDate || post.date).toISOString()}</updated>\n`;

        if (post.excerpt) {
            entry += `    <summary>${this.escapeXML(post.excerpt)}</summary>\n`;
        }

        if (post.content) {
            entry += `    <content type="html">${this.cdata(post.content)}</content>\n`;
        }

        if (post.author) {
            entry += '    <author>\n';
            entry += `      <name>${this.escapeXML(post.author)}</name>\n`;
            entry += '    </author>\n';
        }

        entry += '  </entry>\n';
        return entry;
    },

    // Generate JSON feed (modern alternative)
    generateJSON: function(posts, options = {}) {
        const config = { ...this.config, ...options };
        const items = posts.slice(0, options.limit || 20);

        const feed = {
            version: "https://jsonfeed.org/version/1",
            title: config.title,
            home_page_url: config.link,
            feed_url: config.atomLink,
            description: config.description,
            author: {
                name: config.author?.name || "Author"
            },
            items: items.map(post => {
                const postUrl = post.url.startsWith('http') ?
                    post.url :
                    `${config.link.replace(/\/blog\/?$/, '')}${post.url}`;

                return {
                    id: post.id || postUrl,
                    url: postUrl,
                    title: post.title,
                    summary: post.excerpt,
                    content_html: post.content,
                    date_published: new Date(post.publishDate || post.date).toISOString(),
                    author: {
                        name: post.author || config.author?.name
                    },
                    tags: [...(post.tags || []), ...(post.categories || [])]
                };
            })
        };

        return JSON.stringify(feed, null, 2);
    },

    // Save feed to file (Node.js)
    saveToFile: async function(feed, filepath) {
        if (typeof require !== 'undefined') {
            const fs = require('fs').promises;
            await fs.writeFile(filepath, feed, 'utf-8');
            console.log(`Feed saved to ${filepath}`);
        } else {
            console.warn('File saving is only available in Node.js environment');
        }
    },

    // Create download link (browser)
    createDownloadLink: function(feed, filename = 'feed.xml', type = 'application/rss+xml') {
        if (typeof window !== 'undefined') {
            const blob = new Blob([feed], { type });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            URL.revokeObjectURL(url);
        }
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RSSGenerator;
}

if (typeof window !== 'undefined') {
    window.RSSGenerator = RSSGenerator;
}