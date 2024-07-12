

// const firebaseConfig = {
//     apiKey: "AIzaSyA9BuEnmsaCczb7zEWY_FlXoyy4ogrWtHc",
//     authDomain: "medico-d0f60.firebaseapp.com",
//     databaseURL: "https://medico-d0f60-default-rtdb.firebaseio.com",
//     projectId: "medico-d0f60",
//     storageBucket: "medico-d0f60.appspot.com",
//     messagingSenderId: "405826067657",
//     appId: "1:405826067657:web:767052c258060a3d9a4118",
//     measurementId: "G-Q8XVV063PX"
// };

const firebase = require("firebase/app");
const firedatabase = require("firebase/database");
const firestorage = require("firebase/storage");


const firebaseConfig = {
    // ...
    // The value of `databaseURL` depends on the location of the database
    databaseURL: "https://medico-d0f60-default-rtdb.firebaseio.com/",
    storageBucket: "gs://medico-d0f60.appspot.com/"
};

// Initialize Firebase
const app0 = firebase.initializeApp(firebaseConfig);

const addData = async (req, res) => {
    try {

        // Initialize Realtime Database and get a reference to the service
        const database = firedatabase.getDatabase(app0);
        if (database) {

            firedatabase.get(firedatabase.child(firedatabase.ref(database), `BCW/videos`)).then((snapshot0) => {
                if (snapshot0.exists()) {
                    const data = snapshot0.val()
                    const keys = Object.keys(data);
                    const length = keys.length;

                    const dataSaved = firedatabase.set(firedatabase.ref(database, `BCW/videos/video${length}`), req.body);

                    if (dataSaved) {

                        firedatabase.get(firedatabase.child(firedatabase.ref(database), `BCW/playlists`)).then((snapshot0) => {
                            if (snapshot0.exists()) {
                                const data = snapshot0.val()
                                const keys = Object.keys(data);
                                const length = keys.length;
                                const reqplayid = '';
                                const videoCount = 0;

                                for(let i = 0; i<length; i++){
                                    var playid = "playlist"+i;
                                    if(data[playid].pcode == req.body.playlist){
                                        reqplayid = playid;
                                        videoCount = data[playid].vcount+1;
                                        break;
                                    }
                                }
                                const dataSaved = firedatabase.set(firedatabase.ref(database, `BCW/playlists/${reqplayid}/vcount`), videoCount);

                                if (dataSaved) {
            
                                    // console.log("Data saved successfully");
                                    res.status(200).send({ msg: "Data saved successfully" });
                                }


                            }
                        });

                    }
                }
            });




        }

    } catch (error) {
        // console.log(error);
    }

}
const editData = async (req, res) => {
    try {

        // Initialize Realtime Database and get a reference to the service
        const database = firedatabase.getDatabase(app0);
        if (database) {


            const dataSaved = firedatabase.set(firedatabase.ref(database, `BCW/videos/${req.body.videoid}`), req.body);

            if (dataSaved) {

                // console.log("Data saved successfully");
                res.status(200).send({ msg: "Data saved successfully" });
            }




        }

    } catch (error) {
        // console.log(error);
    }

}
const addPlayData = async (req, res) => {
    try {

        // Initialize Realtime Database and get a reference to the service
        const database = firedatabase.getDatabase(app0);
        if (database) {

            firedatabase.get(firedatabase.child(firedatabase.ref(database), `BCW/playlists`)).then((snapshot0) => {
                if (snapshot0.exists()) {
                    const data = snapshot0.val()
                    const keys = Object.keys(data);
                    const length = keys.length;

                    const dataSaved = firedatabase.set(firedatabase.ref(database, `BCW/playlists/playlist${length}`), req.body);

                    if (dataSaved) {

                        // console.log("Data saved successfully");
                        res.status(200).send({ msg: "Data saved successfully" });
                    }
                }
            });




        }

    } catch (error) {
        // console.log(error);
    }

}

const retriveData = async (req, res) => {
    try {

        const dbRef = firedatabase.ref(firedatabase.getDatabase(app0));

        firedatabase.get(firedatabase.child(dbRef, `BCW/videos`)).then((snapshot) => {
            if (snapshot.exists()) {
                // console.log(snapshot.val());
                res.status(200).send({ msg: snapshot.val() });

            } else {
                // console.log("No data available");
                res.status(202).send({ msg: "No data available" });
            }
        }).catch((error) => {
            console.error(error);
        });

    } catch (error) {
        console.error(error);
    }
}


const retriveAdminData = async (req, res) => {
    try {

        const dbRef = firedatabase.ref(firedatabase.getDatabase(app0));

        firedatabase.get(firedatabase.child(dbRef, `BCW/admins`)).then((snapshot) => {
            if (snapshot.exists()) {
                // console.log(snapshot.val());
                res.status(200).send({ msg: snapshot.val() });

            } else {
                // console.log("No data available");
                res.status(202).send({ msg: "No data available" });
            }
        }).catch((error) => {
            console.error(error);
        });

    } catch (error) {
        console.error(error);
    }
}


var count = "X";

const retrivePlaylists = async (req, res) => {

    try {

        const dbRef = firedatabase.ref(firedatabase.getDatabase(app0));

        firedatabase.get(firedatabase.child(dbRef, `BCW/playlists`)).then((snapshot) => {
            if (snapshot.exists()) {
                // console.log(snapshot.val());
                res.status(200).send({ msg: snapshot.val() });

            } else {
                // console.log("No data available");
                res.status(202).send({ msg: "No data available" });
            }
        }).catch((error) => {
            console.error(error);
        });

    } catch (error) {
        console.error(error);
    }

}


const saveImg = async (req, res) => {
    try {
        // TODO: Replace the following with your app's Firebase project configuration
        // See: https://firebase.google.com/docs/web/learn-more#config-object

        // const app2 = firebase.initializeApp(firebaseConfig0);

        // Get a reference to the storage service, which is used to create references in your storage bucket
        const storage = firestorage.getStorage(app0);


        try {

            const dbRef = firedatabase.ref(firedatabase.getDatabase(app0));

            firedatabase.get(firedatabase.child(dbRef, `BCW/videos`)).then((snapshot0) => {
                if (snapshot0.exists()) {
                    const data = snapshot0.val()
                    const keys = Object.keys(data);
                    const length = keys.length;


                    // Create a storage reference from our storage service
                    const storageRef = firestorage.ref(storage, `images/thumbnails/videothumbnails/video${length}.png`);

                    // const bucket= firestorage.bucket();



                    firestorage.uploadBytes(storageRef, req.file.buffer, {
                        contentType: req.file.mimetype,
                    }).then((snapshot) => {

                        firestorage.getDownloadURL(snapshot.ref)
                            .then((url) => {
                                // console.log(`image uploaded url : ${url}`);
                                res.status(200).send({ url: url });
                            })


                    });




                } else {
                    // console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });

        } catch (error) {
            console.error(error);
        }




    } catch (error) {
        console.error(error);
    }
}
const savePlayImg = async (req, res) => {
    try {
        // TODO: Replace the following with your app's Firebase project configuration
        // See: https://firebase.google.com/docs/web/learn-more#config-object

        // const app2 = firebase.initializeApp(firebaseConfig0);

        // Get a reference to the storage service, which is used to create references in your storage bucket
        const storage = firestorage.getStorage(app0);


        try {

            const dbRef = firedatabase.ref(firedatabase.getDatabase(app0));

            firedatabase.get(firedatabase.child(dbRef, `BCW/playlists`)).then((snapshot0) => {
                if (snapshot0.exists()) {
                    const data = snapshot0.val()
                    const keys = Object.keys(data);
                    const length = keys.length;


                    // Create a storage reference from our storage service
                    const storageRef = firestorage.ref(storage, `images/thumbnails/playthumbnails/video${length}.png`);

                    // const bucket= firestorage.bucket();



                    firestorage.uploadBytes(storageRef, req.file.buffer, {
                        contentType: req.file.mimetype,
                    }).then((snapshot) => {

                        firestorage.getDownloadURL(snapshot.ref)
                            .then((url) => {
                                // console.log(`image uploaded url : ${url}`);
                                res.status(200).send({ url: url });
                            })


                    });




                } else {
                    // console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });

        } catch (error) {
            console.error(error);
        }




    } catch (error) {
        console.error(error);
    }
}


module.exports = { addData, retriveData, saveImg, retriveAdminData, retrivePlaylists, savePlayImg, addPlayData, editData };