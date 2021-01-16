const request = require("request");

// const token = "2f9028f80f1ed8276a7b2bb21e29cb522a653119";
// const id = "90244d8c3d0195f";
// const secret = "cb2b9ab9e56723ed08983e6bf5f2350bb129fce0";

// request(
//   {
//     method: "POST",
//     url: "https://api.imgur.com/oauth2/token",
//     headers: {},
//     formData: {
//       refresh_token: token,
//       client_id: id,
//       client_secret: secret,
//       grant_type: "refresh_token",
//     },
//   },
//   (e, r, b) => {
//     const json = JSON.parse(b);
//     console.log(json);
//   }
// );

function upload(base64) {
  return new Promise((resolve, reject) => {
    request(
      {
        method: "POST",
        url: "https://api.imgur.com/3/image",
        headers: {
          Token: "5c08340c93f36b53f7fce9877f7c83c9de7a800c",
          Authorization: "Client-ID 90244d8c3d0195f",
        },
        formData: {
          image: base64,
        },
      },
      (e, r, b) => {
        const json = JSON.parse(b);
        console.log(json);
        const link = json.link;
        resolve(link);
      }
    );
  });
}

function deleteImg(hash) {
  return new Promise((resolve, reject) => {
    request(
      {
        method: "DELETE",
        url: `https://api.imgur.com/3/image/${hash}`,
        headers: {
          Authorization: "Bearer 5c08340c93f36b53f7fce9877f7c83c9de7a800c",
        },
        formData: {},
      },
      (e, r, b) => {
        const json = JSON.parse(b);
        resolve(json);
      }
    );
  });
}

module.exports = { upload, deleteImg };
