const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET
});

module.exports.saveImage = async (filePath)=> {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'artist-platform',   // Organize uploads in a folder
            use_filename: true,          // Keep original filename
            unique_filename: false       // Disable unique naming if desired
        });

        return result.secure_url;  // Return HTTPS URL of uploaded image
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Image upload failed');
    }
}