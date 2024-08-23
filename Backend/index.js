const express = require('express')
const app = express()
const multer = require('multer')
const docxToPdf = require('docx-pdf');
const path = require("path");
const cors = require("cors");


app.use(cors());

// -----  set file storage ----------------
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });


app.post('/convertFile', upload.single('file'), (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded",
            });
        }
        // ----- Defining output file path 
        let outputPath = path.join(__dirname, "files", `${req.file.originalname}.pdf`)
        docxToPdf(req.file.path, outputPath, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).join({
                    message: "Error converting docx to pdf",
                });
            }
            res.download(outputPath, () => {
                console.log("file dawnloaded")
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
})

app.get('/', function (req, res) {
    res.send('Hello World')
})
app.listen(3000)