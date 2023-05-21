const dotenv = require('dotenv')
const cloudinary = require('cloudinary')
dotenv.config()

cloudinary.config({
    cloud_name: "djjtc1xxa",
    api_key: '451528253494259',
    api_secret:"N3oEEn7hDCHrZOuDFwgZPAT6LkM"
})

exports.uploads = (file, folder) => {
    console.log('cloudniary');
    try {
        return new Promise(resolve => {
            cloudinary.uploader.upload(file, (result) => {
                resolve({
                    url: result.url,
                    id: result.public_id
                })
            },
                {
                    resource_type: "auto",
                    folder: folder
                }
            )
        })
    } catch (error) {

    }

}