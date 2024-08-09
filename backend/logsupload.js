const multer = require('multer');
const path = require('path');;
const fs = require('fs');

// Define the storage without setting the destination yet
  const storage = multer.diskStorage({
    filename: function(req, file, cb) {
      cb(null, `${file.originalname}`);
    },
    destination: (req, file, cb) => {
        const destPath = path.join(__dirname, './Files/');
        fs.mkdirSync(destPath, { recursive: true }); // Ensure directory exists
        cb(null, destPath);
    }
  });
  
  // Initialize multer without setting the destination
  const upload = multer({ storage: storage });
  
  const uploadFile = (req, res) => {
    try {
        upload.single('file')(req, res, function (err) {
            if (err instanceof multer.MulterError) {
              return res.status(500).send({ message: err.message });
            } else if (err) {
              return res.status(500).send({ message: err.message || 'File upload error.' });
            }
        

        res.status(200).json({ message: 'File uploaded successfully', path: req.file.path });
        
      })}
      catch (error) {
        res.status(500).json({error: error.message, message: "Error occurred uploading files"})
      }
  };

  module.exports = {
    uploadFile,
  };


