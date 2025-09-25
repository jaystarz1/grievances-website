/**
 * Blog Tag System
 * Define tag categories and their tags
 */

const blogTags = {
    // Tag categories with their tags
    categories: {
        topics: {
            name: "Topics",
            description: "Main subject areas",
            tags: {
                "ai": { label: "Artificial Intelligence", count: 0 },
                "web-development": { label: "Web Development", count: 0 },
                "mobile": { label: "Mobile Development", count: 0 },
                "data-science": { label: "Data Science", count: 0 },
                "cloud": { label: "Cloud Computing", count: 0 },
                "security": { label: "Security", count: 0 },
                "devops": { label: "DevOps", count: 0 },
                "design": { label: "Design", count: 0 }
            }
        },

        difficulty: {
            name: "Difficulty Level",
            description: "Content complexity",
            tags: {
                "beginner": { label: "Beginner", count: 0, color: "#27ae60" },
                "intermediate": { label: "Intermediate", count: 0, color: "#f39c12" },
                "advanced": { label: "Advanced", count: 0, color: "#e74c3c" },
                "expert": { label: "Expert", count: 0, color: "#8e44ad" }
            }
        },

        type: {
            name: "Content Type",
            description: "Type of content",
            tags: {
                "tutorial": { label: "Tutorial", count: 0, icon: "📚" },
                "guide": { label: "Guide", count: 0, icon: "📖" },
                "case-study": { label: "Case Study", count: 0, icon: "🔍" },
                "opinion": { label: "Opinion", count: 0, icon: "💭" },
                "news": { label: "News", count: 0, icon: "📰" },
                "review": { label: "Review", count: 0, icon: "⭐" },
                "tool": { label: "Tool", count: 0, icon: "🛠️" },
                "announcement": { label: "Announcement", count: 0, icon: "📢" }
            }
        },

        language: {
            name: "Programming Languages",
            description: "Languages and technologies",
            tags: {
                "javascript": { label: "JavaScript", count: 0 },
                "python": { label: "Python", count: 0 },
                "typescript": { label: "TypeScript", count: 0 },
                "react": { label: "React", count: 0 },
                "nodejs": { label: "Node.js", count: 0 },
                "html-css": { label: "HTML/CSS", count: 0 },
                "sql": { label: "SQL", count: 0 },
                "graphql": { label: "GraphQL", count: 0 }
            }
        }
    },

    // Helper functions
    helpers: {
        // Get all tags flattened
        getAllTags: function() {
            const allTags = {};
            Object.values(blogTags.categories).forEach(category => {
                Object.entries(category.tags).forEach(([key, tag]) => {
                    allTags[key] = { ...tag, category: category.name };
                });
            });
            return allTags;
        },

        // Get tag by ID
        getTag: function(tagId) {
            for (const category of Object.values(blogTags.categories)) {
                if (category.tags[tagId]) {
                    return {
                        ...category.tags[tagId],
                        id: tagId,
                        category: category.name
                    };
                }
            }
            return null;
        },

        // Get tags for a category
        getTagsByCategory: function(categoryKey) {
            return blogTags.categories[categoryKey]?.tags || {};
        },

        // Update tag counts based on posts
        updateCounts: function(posts) {
            // Reset all counts
            Object.values(blogTags.categories).forEach(category => {
                Object.values(category.tags).forEach(tag => {
                    tag.count = 0;
                });
            });

            // Count tag usage
            posts.forEach(post => {
                if (post.tags && !post.draft) {
                    post.tags.forEach(tagId => {
                        for (const category of Object.values(blogTags.categories)) {
                            if (category.tags[tagId]) {
                                category.tags[tagId].count++;
                                break;
                            }
                        }
                    });
                }
            });
        },

        // Get popular tags
        getPopularTags: function(limit = 10) {
            const allTags = this.getAllTags();
            return Object.entries(allTags)
                .sort((a, b) => b[1].count - a[1].count)
                .slice(0, limit)
                .map(([id, tag]) => ({ id, ...tag }));
        },

        // Search tags
        searchTags: function(query) {
            const searchTerm = query.toLowerCase();
            const results = [];

            Object.values(blogTags.categories).forEach(category => {
                Object.entries(category.tags).forEach(([id, tag]) => {
                    if (
                        id.includes(searchTerm) ||
                        tag.label.toLowerCase().includes(searchTerm)
                    ) {
                        results.push({
                            id,
                            ...tag,
                            category: category.name
                        });
                    }
                });
            });

            return results;
        },

        // Add a custom tag
        addTag: function(categoryKey, tagId, tagData) {
            if (blogTags.categories[categoryKey]) {
                blogTags.categories[categoryKey].tags[tagId] = {
                    label: tagData.label,
                    count: 0,
                    ...tagData
                };
                return true;
            }
            return false;
        },

        // Add a custom category
        addCategory: function(categoryKey, categoryData) {
            blogTags.categories[categoryKey] = {
                name: categoryData.name,
                description: categoryData.description || "",
                tags: categoryData.tags || {}
            };
            return true;
        }
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = blogTags;
}

if (typeof window !== 'undefined') {
    window.blogTags = blogTags;
}