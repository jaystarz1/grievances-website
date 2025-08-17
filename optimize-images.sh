#!/bin/bash

# Image Optimization Script for Grievances Website
# This script will optimize all images in the images/ directory

echo "🖼️  Starting image optimization..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick is not installed. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install imagemagick
    else
        # Linux
        sudo apt-get update && sudo apt-get install imagemagick -y
    fi
fi

# Create optimized directory
mkdir -p images/optimized

# Optimize book cover ebook (target: 200KB max)
echo "Optimizing book-cover-ebook.jpg..."
convert images/book-cover-ebook.jpg \
    -resize 1200x1800\> \
    -quality 85 \
    -strip \
    -interlace Plane \
    -gaussian-blur 0.05 \
    -colorspace sRGB \
    images/optimized/book-cover-ebook.jpg

# Optimize book cover paperback spread (target: 250KB max)
echo "Optimizing book-cover-paperback-spread.jpg..."
convert images/book-cover-paperback-spread.jpg \
    -resize 2400x1600\> \
    -quality 82 \
    -strip \
    -interlace Plane \
    -gaussian-blur 0.05 \
    -colorspace sRGB \
    images/optimized/book-cover-paperback-spread.jpg

# Optimize author photo (target: 150KB max)
echo "Optimizing book-photo-author.jpg..."
convert images/book-photo-author.jpg \
    -resize 800x800\> \
    -quality 88 \
    -strip \
    -interlace Plane \
    -colorspace sRGB \
    images/optimized/book-photo-author.jpg

# Create WebP versions for modern browsers
echo "Creating WebP versions..."
for img in images/optimized/*.jpg; do
    filename=$(basename "$img" .jpg)
    convert "$img" -quality 85 "images/optimized/${filename}.webp"
    echo "Created ${filename}.webp"
done

# Create tiny placeholder images for lazy loading (base64 encoded)
echo "Creating placeholder images..."
for img in images/optimized/*.jpg; do
    filename=$(basename "$img" .jpg)
    convert "$img" -resize 20x20 -blur 0x8 "images/optimized/${filename}-placeholder.jpg"
    echo "Created ${filename}-placeholder.jpg"
done

# Show file sizes
echo ""
echo "📊 Optimization Results:"
echo "========================"
echo "Original sizes:"
ls -lh images/*.jpg | grep -v optimized

echo ""
echo "Optimized sizes:"
ls -lh images/optimized/*.jpg | grep -v placeholder | grep -v webp

echo ""
echo "WebP sizes:"
ls -lh images/optimized/*.webp

echo ""
echo "✅ Optimization complete!"
echo ""
echo "Next steps:"
echo "1. Move optimized images to main images folder: mv images/optimized/* images/"
echo "2. Update HTML to use picture elements with WebP fallback"
echo "3. Implement lazy loading with placeholder images"
