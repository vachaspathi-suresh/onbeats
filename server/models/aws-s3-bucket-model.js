const aws = require("aws-sdk");
const crypto = require("crypto");
const util = require("util");
const randomBytes = util.promisify(crypto.randomBytes);

const region = "ap-south-1";
const bucketName = "onbeats";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID_VALUE;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY_VALUE;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

const generateUploadURL = async (folder, extension) => {
  const rawBytes = await randomBytes(16);
  const imageName = rawBytes.toString("hex");

  const params = {
    Bucket: bucketName,
    Key: folder + "/" + imageName + "." + extension,
    Expires: 60,
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", params);
  return {url : uploadURL,fileName:imageName + "." + extension};
};

const deleteFile = async (folder,filename) =>{
  try {
    await s3.deleteObject({Bucket:bucketName,Key:folder+"/"+filename}).promise();
    return true;
  } catch (err) {
    console.log(err);
    return new Error("Unable to delete the Song");
  }
}

exports.generateUploadURL = generateUploadURL;
exports.deleteFile = deleteFile;
