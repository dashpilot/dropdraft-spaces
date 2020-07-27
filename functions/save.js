const AWS = require("aws-sdk");
require("dotenv").load();
require("isomorphic-fetch");
const matter = require("gray-matter");
const Dropbox = require("dropbox").Dropbox;

// Configure client for use with Spaces
const spacesEndpoint = new AWS.Endpoint(process.env.S3_ENDPOINT);
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
});

// Setup our interface for the Dropbox API with our token
// If there's no token, we'll just go ahead and exit this script now.
if (!process.env.DBX_ACCESS_TOKEN) {
    console.log(
        "Error: could not find a Dropbox access token. Make sure you have a `.env` file with a `DBX_ACCESS_TOKEN` key/value pair for accessing the Dropbox API."
    );
    process.exit(1);
}
const dbx = new Dropbox({
    accessToken: process.env.DBX_ACCESS_TOKEN,
});

exports.handler = async(event, context) => {
    let posts = [];

    // Get all the posts in the root of our our Dropbox App's directory and save
    // them all to our local posts folder.
    dbx
        .filesListFolder({
            path: "",
        })
        .then((response) => {
            response.entries.forEach((entry) => {
                const { name, path_lower } = entry;

                if (entry[".tag"] === "file") {
                    return dbx
                        .filesDownload({
                            path: path_lower,
                        })
                        .then((data) => {
                            const filecontents = data.fileBinary.toString();
                            let mypost = matter(filecontents);
                            console.log(mypost);
                        })
                        .catch((error) => {
                            console.log("Error: file failed to download", name, error);
                        });
                }
            });

            console.log(posts);

            // save the file
            var params = {
                Body: JSON.stringify(posts),
                Bucket: process.env.S3_BUCKET,
                Key: "data.json",
                ContentType: "application/json",
                ACL: "public-read",
            };

            s3.putObject(params, function(err, data) {
                if (err) console.log(err, err.stack);
                else console.log(data);
            });
        })
        .catch((error) => {
            console.log(error);
        });
};