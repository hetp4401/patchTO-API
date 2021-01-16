const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const { toAddress, toCoordinates, autocomplete } = require("./maps");
const { db, auth } = require("./firebase");
const { upload, deleteImg } = require("./image");

app.get("/", (req, res) => {
  res.send("Get Started...");
});

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

//firebase auth create new user
app.get("/auth/create/:user/:pass", (req, res) => {
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
app.get("/auth/login/:user/:pass", (req, res) => {
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
app.get("/data/read/pins", async (req, res) => {
  const pins = db.collection("pins");
  const snapshot = await pins.get();
  const data = [];
  snapshot.forEach((doc) => {
    data.push(doc.data());
  });
  res.send(data);
});

app.get(
  "/data/write/pins/:lat/:long/:name/:desc/:date/:address",
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
    });

    res.send(added.id);
  }
);

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

app.listen(process.env.PORT || 5000, () => {
  console.log("working on 5000");
});
