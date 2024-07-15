const firebase = require("firebase/app");
const firedatabase = require("firebase/database");
const firestorage = require("firebase/storage");

const firebaseConfig = {
    databaseURL: "https://medico-d0f60-default-rtdb.firebaseio.com/",
    storageBucket: "gs://medico-d0f60.appspot.com/"
};

// Initialize Firebase
const app0 = firebase.initializeApp(firebaseConfig);

const addData = async (req, res) => {
    try {
        console.log("addData called");
        const database = firedatabase.getDatabase(app0);
        if (database) {
            const dbRef = firedatabase.ref(database);

            // Fetch videos
            const snapshot0 = await firedatabase.get(firedatabase.child(dbRef, `BCW/videos`));
            let length = 0;
            if (snapshot0.exists()) {
                const data = snapshot0.val();
                length = Object.keys(data).length;
            }

            // Save new video data
            await firedatabase.set(firedatabase.ref(database, `BCW/videos/video${length}`), req.body);
            console.log("Data saved to videos");

            // Fetch playlists
            const snapshot1 = await firedatabase.get(firedatabase.child(dbRef, `BCW/playlists`));
            if (!snapshot1.exists()) {
                return res.status(200).send({ msg: "Data saved successfully, no playlists found" });
            }

            const playlistData = snapshot1.val();
            let playlistUpdated = false;

            for (const [i, playid] of Object.keys(playlistData).entries()) {
                if (playlistData[playid].pcode == req.body.playlist) {
                    const videoCount = playlistData[playid].vcount + 1;
                    await firedatabase.set(firedatabase.ref(database, `BCW/playlists/${playid}/vcount`), videoCount);
                    console.log("Video count updated in playlists");
                    playlistUpdated = true;
                    break;
                }
            }

            if (!playlistUpdated) {
                console.log("No matching playlist found");
            }

            return res.status(200).send({ msg: "Data saved successfully" });
        } else {
            throw new Error("Database not available");
        }
    } catch (error) {
        console.error("Error in addData:", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
};


const editData = async (req, res) => {
    try {
        console.log("editData called");
        const database = firedatabase.getDatabase(app0);
        if (database) {
            await firedatabase.set(firedatabase.ref(database, `BCW/videos/${req.body.videoid}`), req.body);
            console.log("Data saved to videos");
            res.status(200).send({ msg: "Data saved successfully" });
        }
    } catch (error) {
        console.error("Error in editData:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

const addPlayData = async (req, res) => {
    try {
        console.log("addPlayData called");
        const database = firedatabase.getDatabase(app0);
        if (database) {
            const snapshot0 = await firedatabase.get(firedatabase.child(firedatabase.ref(database), `BCW/playlists`));
            var length = 0;
            if (snapshot0.exists()) {

                const data = snapshot0.val();
                const keys = Object.keys(data);
                length = keys.length;
            }
            await firedatabase.set(firedatabase.ref(database, `BCW/playlists/playlist${length}`), req.body);
            console.log("Data saved to playlists");
            res.status(200).send({ msg: "Data saved successfully" });
        }
    } catch (error) {
        console.error("Error in addPlayData:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

const retriveData = async (req, res) => {
    try {
        console.log("retriveData called");
        const dbRef = firedatabase.ref(firedatabase.getDatabase(app0));
        const snapshot = await firedatabase.get(firedatabase.child(dbRef, `BCW/videos`));
        if (snapshot.exists()) {
            res.status(200).send({ msg: snapshot.val() });
        } else {
            res.status(202).send({ msg: "No data available" });
        }
    } catch (error) {
        console.error("Error in retriveData:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

const retriveAdminData = async (req, res) => {
    try {
        console.log("retriveAdminData called");
        const dbRef = firedatabase.ref(firedatabase.getDatabase(app0));
        const snapshot = await firedatabase.get(firedatabase.child(dbRef, `BCW/admins`));
        if (snapshot.exists()) {
            res.status(200).send({ msg: snapshot.val() });
        } else {
            res.status(202).send({ msg: "No data available" });
        }
    } catch (error) {
        console.error("Error in retriveAdminData:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

const retrivePlaylists = async (req, res) => {
    try {
        console.log("retrivePlaylists called");
        const dbRef = firedatabase.ref(firedatabase.getDatabase(app0));
        const snapshot = await firedatabase.get(firedatabase.child(dbRef, `BCW/playlists`));
        if (snapshot.exists()) {
            res.status(200).send({ msg: snapshot.val() });
        } else {
            res.status(202).send({ msg: "No data available" });
        }
    } catch (error) {
        console.error("Error in retrivePlaylists:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

const saveImg = async (req, res) => {
    try {
        console.log("saveImg called");
        const storage = firestorage.getStorage(app0);
        const dbRef = firedatabase.ref(firedatabase.getDatabase(app0));
        const snapshot0 = await firedatabase.get(firedatabase.child(dbRef, `BCW/videos`));
        var length = 0;
        if (snapshot0.exists()) {

            const data = snapshot0.val();
            const keys = Object.keys(data);
            length = keys.length;
        }

        const storageRef = firestorage.ref(storage, `images/thumbnails/videothumbnails/video${length}.png`);

        const snapshot = await firestorage.uploadBytes(storageRef, req.file.buffer, { contentType: req.file.mimetype });
        const url = await firestorage.getDownloadURL(snapshot.ref);
        console.log(`Image uploaded, URL: ${url}`);
        res.status(200).send({ url: url });
    } catch (error) {
        console.error("Error in saveImg:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

const savePlayImg = async (req, res) => {
    try {
        console.log("savePlayImg called");
        const storage = firestorage.getStorage(app0);
        const dbRef = firedatabase.ref(firedatabase.getDatabase(app0));
        const snapshot0 = await firedatabase.get(firedatabase.child(dbRef, `BCW/playlists`));
        var length = 0;
        if (snapshot0.exists()) {

            const data = snapshot0.val();
            const keys = Object.keys(data);
            length = keys.length;
        }

        const storageRef = firestorage.ref(storage, `images/thumbnails/playthumbnails/video${length}.png`);

        const snapshot = await firestorage.uploadBytes(storageRef, req.file.buffer, { contentType: req.file.mimetype });
        const url = await firestorage.getDownloadURL(snapshot.ref);
        console.log(`Image uploaded, URL: ${url}`);
        res.status(200).send({ url: url });
    } catch (error) {
        console.error("Error in savePlayImg:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

const savePDF = async (req, res) => {
    try {
        console.log("savePlayPdf called");
        const storage = firestorage.getStorage(app0);
        const dbRef = firedatabase.ref(firedatabase.getDatabase(app0));
        const snapshot0 = await firedatabase.get(firedatabase.child(dbRef, `BCW/playlists`));
        var length = 0;
        if (snapshot0.exists()) {
            const data = snapshot0.val();
            const keys = Object.keys(data);
            length = keys.length;
        }

        const storageRef = firestorage.ref(storage, `pdfs/documents/document${length}.pdf`);  // Change path and extension

        const snapshot = await firestorage.uploadBytes(storageRef, req.file.buffer, { contentType: req.file.mimetype });
        const url = await firestorage.getDownloadURL(snapshot.ref);
        console.log(`PDF uploaded, URL: ${url}`);
        res.status(200).send({ url: url });
    } catch (error) {
        console.error("Error in savePlayPdf:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }


}

module.exports = { addData, retriveData, saveImg, retriveAdminData, retrivePlaylists, savePlayImg, addPlayData, editData, savePDF };
