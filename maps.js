const request = require("request");

function toAddress(lat, lng) {
  return new Promise((resolve, reject) => {
    request(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyB6aG9lGJxMpYCAgrEnXgkkvqNkNFaDrjo`,
      (e, r, b) => {
        const json = JSON.parse(b);
        const results = json.results;
        const first = results[0];
        const address = first.formatted_address;
        resolve(address);
      }
    );
  });
}

function toCoordinates(address) {
  return new Promise((resolve, reject) => {
    request(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyB6aG9lGJxMpYCAgrEnXgkkvqNkNFaDrjo`,
      (e, r, b) => {
        const json = JSON.parse(b);
        const results = json.results;
        const first = results[0];
        const geometry = first.geometry;
        const coordinates = geometry.location;
        resolve(coordinates);
      }
    );
  });
}

function autocomplete(query) {
  return new Promise((resolve, reject) => {
    request(
      {
        url: `https://api-skipthedishes.skipthedishes.com/web/customers/geoservice/autocomplete?address=${query}&country=CA`,
        headers: {
          accept: "application/json",
          "accept-language": "en",
          "app-token": "d7033722-4d2e-4263-9d67-d83854deb0fc",
          "content-type": "application/json",
          dnt: 1,
          origin: "https://www.skipthedishes.com",
          referer: "https://www.skipthedishes.com/",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36",
        },
        method: "GET",
      },
      (e, r, b) => {
        const json = JSON.parse(b);
        const addresses = json.addresses;
        resolve(addresses);
      }
    );
  });
}

module.exports = { toAddress, toCoordinates, autocomplete };
