import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk');

const bucketName = process.env.ATTACHEMENT_S3_BUCKET;
const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})

// getting the expiration time from ENV varaible 
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

/**
 * Returns back the S3 signed URL for a certain attachment in a certain TODO item 
 * @param todoId TODO item for which the signedURL should be generated (to upload then attachment)
 * @returns signedURL 
 */
export function getUploadUrl(todoId: string) {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: todoId,
        Expires: urlExpiration
    })
}
