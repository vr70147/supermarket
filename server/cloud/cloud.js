const cloudinary = require('cloudinary');
    
// define Cloudinary
cloudinary.config({ 
    cloud_name: 'supermarketapp', 
    api_key: '784319497175699', 
    api_secret: '_zTQ2GSn3mb--OMytCzS0GujV70' 
});

// Upload image
module.exports.uploadImage = async( imageName ) => {
    try {
        let pictureUploaded =  await cloudinary.uploader.upload( `./images/${imageName}` );
        console.log(pictureUploaded)
        if( pictureUploaded ){
            return pictureUploaded;
        }
    }
    catch(err) {
        return err;
    }
    
}
