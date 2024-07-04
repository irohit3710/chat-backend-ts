import { S3Client, ListBucketsCommand, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { CONFIG } from "../config/environment";
import * as fs from "fs";
import { v4 as uuidv4 } from 'uuid';

export const s3 = new S3Client({ 
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: CONFIG.blockStorage.accessKey || "",
        secretAccessKey: CONFIG.blockStorage.secretKey || "",
    }
});

// list out all objects
export async function listBuckets() {
    try {
        const data = await s3.send(new ListBucketsCommand({}));
        console.log("Success", data.Buckets);
    } catch (err) {
        console.log("Error", err);
    }
}


// to upload object
export async function uploadFile(bucketName: string, fileKey: string, fileData: any, contentType?: any) {
    try {
        // const fileStream = fs.createReadStream(filePath);
        const uuid_key = uuidv4();
        const fileSplitName: any = fileKey.split(".")
        let filename = fileSplitName[0] + "_" + uuid_key + "." + fileSplitName[fileSplitName.length - 1]
        let uploadParams:any = {
            Bucket: bucketName,
            Key: filename,
            Body: fileData,
        };
        if(contentType){
            uploadParams["ContentType"] = contentType;
        }
        const file =  await s3.send(new PutObjectCommand(uploadParams));
        console.log("Successfully uploaded", fileKey, "to", bucketName);
        const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodeURIComponent(filename)}`;
        return {fileUrl, filename};
    } catch (err) {
        console.log("Error", err);
    }
}

// to download file in specific path 
export async function downloadFile(bucketName: string, fileKey: string, downloadPath: string) {
    try {
        const data: any = await s3.send(new GetObjectCommand({ Bucket: bucketName, Key: fileKey }));
        const fileStream = fs.createWriteStream(downloadPath);
        data.Body.pipe(fileStream);
        console.log("Successfully downloaded", fileKey, "from", bucketName);
    } catch (err) {
        console.log("Error", err);
    }
}