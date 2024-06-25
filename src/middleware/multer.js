const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let destinationFolder;
        switch (file.fieldname) {
            case "profile":
                destinationFolder = "./src/upload/profiles";
                break;
            case "products":
                destinationFolder = "./src/upload/products";
                break;
            case "document":
            default:
                destinationFolder = "./src/upload/documents";
        }

        cb(null, destinationFolder);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;