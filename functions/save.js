const AWS = require("aws-sdk");
require("dotenv").load();
require("isomorphic-fetch");
const Buffer = require("buffer/").Buffer;
const Dropbox = require("dropbox").Dropbox;
const matter = require("gray-matter");
const showdown = require("showdown");
const converter = new showdown.Converter();

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

exports.handler = function(event, context, callback) {
    getContents("").then(function(res) {
        //console.log(res);

        // save the file
        var params = {
            Body: JSON.stringify(res),
            Bucket: process.env.S3_BUCKET,
            Key: "data.json",
            ContentType: "application/json",
            ACL: "public-read",
        };

        s3.putObject(params, function(err, data) {
            if (err) console.log(err, err.stack);
            else console.log(data);
        });

        callback(null, {
            statusCode: 200,
            body: "OK",
        });
    });
};

async function getContents(mypath) {
    const posts = [];

    const files = await dbx.filesListFolder({
        path: mypath,
        recursive: true,
    });

    for (const entry of files.entries) {
        const { name, path_lower } = entry;

        //console.log(entry);

        if (entry[".tag"] === "file") {
            const content = await dbx.filesDownload({
                path: path_lower,
            });

            let ext = getExtension(path_lower);

            if (ext == "txt" || ext == "md" || ext == "markdown") {
                let data = matter(content.fileBinary.toString());
                data.content = converter.makeHtml(data.content); // convert markdown to html
                data.orig = content.fileBinary.toString();
                data.path = entry.path_lower;
                posts.push(data);
            } else if (ext == "jpg" || ext == "png" || ext == "gif") {
                let mypath = entry.path_lower.substring(1);

                // save the file
                var params = {
                    Body: content.fileBinary,
                    Bucket: process.env.S3_BUCKET,
                    Key: mypath,
                    ContentType: "image/png",
                    ACL: "public-read",
                };

                s3.putObject(params, function(err, data) {
                    if (err) console.log(err, err.stack);
                    else console.log(data);
                });
            }
        }
    }

    return posts;
}

function getExtension(filename) {
    return filename.split(".").pop();
}