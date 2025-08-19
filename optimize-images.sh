#!/bin/bash
# CRITICAL IMAGE OPTIMIZATION - Fix 19MB and 14MB images killing your SEO
# Run with: bash optimize-images.sh

echo "🚨 CRITICAL: Fixing massive image files that are destroying your page speed..."
echo "Current issues: 19MB and 14MB images - Google will penalize this!"
echo "=========================================================="

# Check for required tools
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install imagemagick
    else
        sudo apt-get update && sudo apt-get install imagemagick -y
    fi
fi

if ! command -v cwebp &> /dev/null; then
    echo "❌ WebP tools not found. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install webp
    else
        sudo apt-get update && sudo apt-get install webp -y
    fi
fi

# Create optimized directory
mkdir -p images/optimized

# Show current disaster
echo ""
echo "🔴 CURRENT FILE SIZES (This is killing your rankings!):"
echo "=========================================================="
ls -lh images/*.jpg 2>/dev/null | awk '{print $9 ": " $5}'
echo ""

# CRITICAL: Fix the 19MB book-cover-paperback-spread.jpg
if [ -f "images/book-cover-paperback-spread.jpg" ]; then
    echo "🔧 Fixing 19MB book-cover-paperback-spread.jpg..."
    
    # Aggressive optimization - target under 200KB
    convert images/book-cover-paperback-spread.jpg \
        -resize 1600x1200\> \
        -quality 75 \
        -strip \
        -interlace Plane \
        -sampling-factor 4:2:0 \
        -define jpeg:dct-method=float \
        images/optimized/book-cover-paperback-spread-opt.jpg
    
    # Create WebP (even smaller)
    cwebp -q 75 -m 6 images/optimized/book-cover-paperback-spread-opt.jpg \
        -o images/optimized/book-cover-paperback-spread.webp 2>/dev/null
    
    original_size=$(ls -lh images/book-cover-paperback-spread.jpg | awk '{print $5}')
    new_size=$(ls -lh images/optimized/book-cover-paperback-spread-opt.jpg | awk '{print $5}')
    webp_size=$(ls -lh images/optimized/book-cover-paperback-spread.webp | awk '{print $5}')
    
    echo "  ✅ Reduced: $original_size → JPG: $new_size, WebP: $webp_size"
fi

# CRITICAL: Fix the 14MB book-cover-ebook.jpg
if [ -f "images/book-cover-ebook.jpg" ]; then
    echo "🔧 Fixing 14MB book-cover-ebook.jpg..."
    
    # Aggressive optimization - target under 150KB
    convert images/book-cover-ebook.jpg \
        -resize 1000x1500\> \
        -quality 78 \
        -strip \
        -interlace Plane \
        -sampling-factor 4:2:0 \
        -define jpeg:dct-method=float \
        images/optimized/book-cover-ebook-opt.jpg
    
    # Create WebP
    cwebp -q 78 -m 6 images/optimized/book-cover-ebook-opt.jpg \
        -o images/optimized/book-cover-ebook.webp 2>/dev/null
    
    original_size=$(ls -lh images/book-cover-ebook.jpg | awk '{print $5}')
    new_size=$(ls -lh images/optimized/book-cover-ebook-opt.jpg | awk '{print $5}')
    webp_size=$(ls -lh images/optimized/book-cover-ebook.webp | awk '{print $5}')
    
    echo "  ✅ Reduced: $original_size → JPG: $new_size, WebP: $webp_size"
fi

# Fix the 2.3MB author photo
if [ -f "images/book-photo-author.jpg" ]; then
    echo "🔧 Fixing 2.3MB book-photo-author.jpg..."
    
    convert images/book-photo-author.jpg \
        -resize 800x800\> \
        -quality 82 \
        -strip \
        -interlace Plane \
        images/optimized/book-photo-author-opt.jpg
    
    cwebp -q 82 images/optimized/book-photo-author-opt.jpg \
        -o images/optimized/book-photo-author.webp 2>/dev/null
    
    original_size=$(ls -lh images/book-photo-author.jpg | awk '{print $5}')
    new_size=$(ls -lh images/optimized/book-photo-author-opt.jpg | awk '{print $5}')
    webp_size=$(ls -lh images/optimized/book-photo-author.webp | awk '{print $5}')
    
    echo "  ✅ Reduced: $original_size → JPG: $new_size, WebP: $webp_size"
fi

# Process any other large images
echo ""
echo "🔧 Optimizing other images..."
for img in images/*.jpg; do
    if [ -f "$img" ]; then
        filename=$(basename "$img" .jpg)
        
        # Skip if already processed
        if [[ "$filename" == "book-cover-paperback-spread" ]] || \
           [[ "$filename" == "book-cover-ebook" ]] || \
           [[ "$filename" == "book-photo-author" ]]; then
            continue
        fi
        
        # Check file size - only process if over 500KB
        size_kb=$(du -k "$img" | cut -f1)
        if [ $size_kb -gt 500 ]; then
            echo "  Processing $filename (${size_kb}KB)..."
            
            convert "$img" \
                -resize 1920x1920\> \
                -quality 82 \
                -strip \
                images/optimized/"${filename}-opt.jpg"
            
            cwebp -q 82 images/optimized/"${filename}-opt.jpg" \
                -o images/optimized/"${filename}.webp" 2>/dev/null
        fi
    fi
done

# Create tiny placeholders for lazy loading
echo ""
echo "🎨 Creating blur placeholders for lazy loading..."
for img in images/optimized/*-opt.jpg; do
    if [ -f "$img" ]; then
        filename=$(basename "$img" -opt.jpg)
        convert "$img" -resize 20x20 -blur 0x8 -quality 50 \
            "images/optimized/${filename}-placeholder.jpg"
    fi
done

echo ""
echo "=========================================================="
echo "✅ OPTIMIZATION COMPLETE - Your page speed is saved!"
echo "=========================================================="
echo ""
echo "📊 RESULTS:"
echo "-----------"

# Calculate total savings
original_total=$(du -ch images/*.jpg 2>/dev/null | grep total | awk '{print $1}')
optimized_total=$(du -ch images/optimized/*-opt.jpg 2>/dev/null | grep total | awk '{print $1}')

echo "Original total: $original_total"
echo "Optimized total: $optimized_total"
echo ""
echo "🎯 FILE SIZES ACHIEVED:"
ls -lh images/optimized/*-opt.jpg 2>/dev/null | awk '{print $9 ": " $5}'

echo ""
echo "📝 IMMEDIATE NEXT STEPS:"
echo "========================"
echo "1. BACKUP originals: mkdir images/backup && cp images/*.jpg images/backup/"
echo "2. REPLACE with optimized: cp images/optimized/*-opt.jpg images/"
echo "3. UPDATE your HTML to use WebP with fallback:"
echo ""
echo "   <picture>"
echo '     <source srcset="images/book-cover-ebook.webp" type="image/webp">'
echo '     <img src="images/book-cover-ebook-opt.jpg" alt="..." loading="lazy">'
echo "   </picture>"
echo ""
echo "4. TEST page speed at: https://pagespeed.web.dev/"
echo ""
echo "⚡ This should boost your PageSpeed score from ~25 to 85+!"
echo "🏆 Result: Better rankings, more traffic, more conversions!"