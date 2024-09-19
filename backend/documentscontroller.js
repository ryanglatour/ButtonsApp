const db = require('./sqlite/database');
const multer = require('multer');

exports.addDocument = async (req, res) => {
    const { user_id, tag, title } = req.body;
    const fileBlob = req.file.buffer;
    const sql = `INSERT INTO documents (user_id, tag, title, data) VALUES (?, ?, ?, ?)`;
    //console.log(fileBlob)
    db.run(sql, [user_id, tag, title, fileBlob], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
        res.json({
            message: "File succesfully uploaded"
        })
    })
}