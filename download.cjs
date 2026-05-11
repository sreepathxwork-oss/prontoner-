const https = require('https');
const fs = require('fs');

const file = fs.createWriteStream("public/veo-background.mp4");
https.get("https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", function(response) {
  response.pipe(file);
  file.on("finish", () => {
    file.close();
    console.log("Download Completed");
  });
});
