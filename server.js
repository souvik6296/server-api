const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Databases = require("./database");
const mailer = require("./mailsender");
const request = require('request');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const corsOptions = {
    origin: "https://bcw.souvikgupta.xyz",
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization"
};

const app = express();

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Middleware to parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set CORS headers for all responses
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://bcw.souvikgupta.xyz");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

const router = express.Router();

// Define routes
router.route("/upload").post(Databases.addData);
router.route("/editvideo").post(Databases.editData);
router.route("/upload/playlist").post(Databases.addPlayData);
router.route("/upload/img").post(upload.single("image"), Databases.saveImg);
router.route("/upload/playimg").post(upload.single("image"), Databases.savePlayImg);
router.route("/upload/pdf").post(upload.single("pdf"), Databases.savePDF);
router.route("/contactus").post(mailer.sendEmail);
router.route("/read").get(Databases.retriveData);
router.route("/read/playlists").get(Databases.retrivePlaylists);
router.route("/read/admindata").get(Databases.retriveAdminData);

const PORT = 4000;

app.use("/admin", router);

app.get("/", (req, res) => {
    res.status(200).send("Server is Working nice");
});

app.get('/proxy', (req, res) => {
    const url = req.query.url;
    request({ url }).pipe(res);
  });

app.listen(PORT, () => {
    console.log(`Server is live at port ${PORT}`);
});
