const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT
});

async function uploadFile(file, filename) {
    try {
        // Check if ImageKit is properly configured
        if (!process.env.IMAGE_KIT_PUBLIC_KEY || !process.env.IMAGE_KIT_PRIVATE_KEY || !process.env.IMAGE_KIT_URL_ENDPOINT) {
            throw new Error('ImageKit configuration missing')
        }

        const result = await imagekit.upload({
            file: file, // buffer from multer
            fileName: filename
        });
        return result
    } catch (error) {
        console.error('Storage service error:', error)
        throw error
    }
}

module.exports = {
    uploadFile
}