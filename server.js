const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Databases = require("./database");
const mailer = require("./mailsender");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const corsOptions = {
    origin: "https://bcw-tech-official.vercel.app",
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
}

const app = express();
app.use(cors(corsOptions));
const router = express.Router();



app.use(express.json());



router.route("/upload").post(Databases.addData);
router.route("/editvideo").post(Databases.editData);
router.route("/upload/playlist").post(Databases.addPlayData);
router.route("/upload/img").post(upload.single("image"), Databases.saveImg);
router.route("/upload/playimg").post(upload.single("image"), Databases.savePlayImg);
router.route("/contactus").post(mailer.sendEmail);
router.route("/read").get(Databases.retriveData);
router.route("/read/playlists").get(Databases.retrivePlaylists);
router.route("/read/admindata").get(Databases.retriveAdminData);

const PORT = 4000;

app.use("/admin", router);




const path = require("path");
app.get("/", (req, res) => {
    res.status(200).send("Server is Working");
});


app.listen(PORT, () => {
    console.log(`Server is live at port ${PORT}`);
})
