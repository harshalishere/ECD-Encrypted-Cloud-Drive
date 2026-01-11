import boto3
import os
from dotenv import load_dotenv
from fastapi import HTTPException

# 1. Load Environment Variables
load_dotenv()

AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
AWS_REGION = os.getenv("AWS_REGION")

# 2. Create the S3 Client
s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=AWS_REGION
)

class S3Service:
    @staticmethod
    def upload_file(file_bytes: bytes, object_name: str):
        """Uploads encrypted bytes to S3"""
        try:
            s3_client.put_object(
                Bucket=AWS_BUCKET_NAME,
                Key=object_name,
                Body=file_bytes
            )
            return True
        except Exception as e:
            print(f"❌ S3 Upload Error: {e}")
            raise HTTPException(status_code=500, detail="Failed to upload to cloud storage")

    @staticmethod
    def download_file(object_name: str) -> bytes:
        """Downloads encrypted bytes from S3"""
        try:
            response = s3_client.get_object(Bucket=AWS_BUCKET_NAME, Key=object_name)
            return response['Body'].read()
        except Exception as e:
            print(f"❌ S3 Download Error: {e}")
            raise HTTPException(status_code=404, detail="File not found in cloud storage")

    @staticmethod
    def delete_file(object_name: str):
        """Deletes file from S3"""
        try:
            s3_client.delete_object(Bucket=AWS_BUCKET_NAME, Key=object_name)
        except Exception as e:
            print(f"❌ S3 Delete Error: {e}")
            raise HTTPException(status_code=500, detail="Failed to delete from cloud")