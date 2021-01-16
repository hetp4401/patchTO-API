const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const { toAddress, toCoordinates, autocomplete } = require("./maps");
const { db, auth } = require("./firebase");
const { upload, deleteImg } = require("./image");

//--------------------------------GEOCODE------------------------------------
app.get("/api/address/:lat/:lng", async (req, res) => {
  const lat = req.params.lat;
  const lng = req.params.lng;
  const address = await toAddress(lat, lng);
  res.send({ address: address });
});

app.get("/api/coordinates/:address", async (req, res) => {
  const address = req.params.address;
  const coordinates = await toCoordinates(address);
  res.send({ coordinates: coordinates });
});

app.get("/api/autocomplete/:query", async (req, res) => {
  const query = req.params.query;
  const addresses = await autocomplete(query);
  res.send({ addresses: addresses });
});

//--------------------------------FIREBASE----------------------------------------
//firebase auth create new user
app.get("/api/auth/create/:user/:pass", (req, res) => {
  const email = req.params.user;
  const password = req.params.pass;

  auth()
    .createUserWithEmailAndPassword(email, password)
    .then((user) => {
      res.send({ created: "success" });
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      res.send({ created: errorCode });
    });
});

//firebase auth login
app.get("/api/auth/login/:user/:pass", (req, res) => {
  const email = req.params.user;
  const password = req.params.pass;
  auth()
    .signInWithEmailAndPassword(email, password)
    .then((user) => {
      res.send({ login: "success" });
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      res.send({ login: errorMessage });
    });
});

//firebase real-time DB stores marker data
app.get("/api/pins/all", async (req, res) => {
  const pins = db.collection("pins");
  const snapshot = await pins.get();
  const data = [];
  snapshot.forEach((doc) => {
    data.push({ ...doc.data(), id: doc.id });
  });
  res.send(data);
});

app.get(
  "/api/pins/create/:lat/:long/:name/:desc/:date/:address",
  async (req, res) => {
    const lat = req.params.lat;
    const long = req.params.long;
    const name = req.params.name;
    const desc = req.params.desc;
    const date = req.params.date;
    const address = req.params.address;

    const added = await db.collection("pins").add({
      latlng: {
        latitude: lat,
        longitude: long,
      },
      values: {
        name,
        description: desc,
      },
      date: date,
      address: address,
      upvotes: [],
      downvotes: [],
    });

    res.send(added.id);
  }
);

app.get("/api/pins/upvote/:pid/:uid", async (req, res) => {
  const pid = req.params.pid;
  const uid = req.params.uid;
  const ref = db.collection("pins").doc(pid);
  const doc = await ref.get();
  const data = doc.data();
  const upvotes = data.upvotes;
  const downvotes = data.downvotes;

  if (!upvotes.includes(pid)) {
    if (downvotes.includes(pid)) {
      const index = downvotes.indexOf(pid);
      downvotes.splice(index, 1);
    }
    upvotes.push(pid);

    const resp = await ref.set(data);
  }

  res.send("worked");
});

//------------------------------IMAGE------------------------------------------
app.get("/api/upload/:test", async (req, res) => {
  console.log(req.params.test);
  //const image = req.body.image;
  // const link = await upload(base64);
  res.send({ link: "ewef" });
});

app.delete("/api/deleteImg/:hash", async (req, res) => {
  const hash = req.params.hash;
  const json = await deleteImg(hash);
  res.send(json);
});

//-----------------------------INITIALIZE--------------------------------

app.get("/", (req, res) => {
  res.send("Get Started...");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("working on 5000");
});
