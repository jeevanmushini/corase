/**
 * upload-to-cloudinary.js
 * One-time script: uploads all product images from public/products/
 * to Cloudinary under the "corase/products" folder.
 * Run: node --env-file=.env.local upload-to-cloudinary.js
 */

const { v2: cloudinary } = require("cloudinary");
const path = require("path");
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PRODUCTS_DIR = path.join(__dirname, "public", "products");

async function uploadAll() {
  const files = fs
    .readdirSync(PRODUCTS_DIR)
    .filter((f) => /\.(png|jpg|jpeg|webp|avif)$/i.test(f));

  console.log(`\nFound ${files.length} images to upload...\n`);

  const results = {};

  for (const file of files) {
    const filePath = path.join(PRODUCTS_DIR, file);
    const publicId = `corase/products/${path.basename(file, path.extname(file))}`;

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
        // Eager transforms: pre-generate optimised versions on upload
        eager: [
          { format: "avif", quality: "auto", width: 800, crop: "limit" },
          { format: "webp", quality: "auto", width: 800, crop: "limit" },
        ],
        eager_async: false,
      });

      // Build delivery URL with auto format + quality + resize
      const optimisedUrl = cloudinary.url(publicId, {
        fetch_format: "auto",
        quality: "auto",
        width: 800,
        crop: "limit",
        secure: true,
      });

      results[file] = {
        publicId,
        originalUrl: result.secure_url,
        optimisedUrl,
        originalSize: `${(fs.statSync(filePath).size / 1024).toFixed(0)} KB`,
        cloudinarySize: `~${Math.round(result.bytes / 1024)} KB`,
      };

      console.log(`✅ ${file}`);
      console.log(`   Original: ${results[file].originalSize}`);
      console.log(`   Cloudinary: ${results[file].cloudinarySize}`);
      console.log(`   URL: ${optimisedUrl}\n`);
    } catch (err) {
      console.error(`❌ Failed to upload ${file}:`, err.message);
    }
  }

  console.log("\n═══════════════════════════════════════");
  console.log("COPY THESE URLs INTO seed.js:");
  console.log("═══════════════════════════════════════");
  for (const [file, data] of Object.entries(results)) {
    console.log(`${file.replace(/\.(png|jpg|jpeg)$/i, "")}: "${data.optimisedUrl}"`);
  }

  // Auto-save a JSON mapping file
  fs.writeFileSync(
    path.join(__dirname, "cloudinary-urls.json"),
    JSON.stringify(results, null, 2)
  );
  console.log("\n✅ Saved URL map to cloudinary-urls.json\n");
}

uploadAll().catch(console.error);
