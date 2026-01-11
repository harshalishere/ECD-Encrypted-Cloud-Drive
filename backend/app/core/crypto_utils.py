import os
import base64
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend

class CryptoUtils:
    @staticmethod
    def generate_salt():
        """Generates a random 16-byte salt."""
        return os.urandom(16)

    @staticmethod
    def derive_key(password: str, salt: bytes) -> bytes:
        """
        Turns a user password + salt into a 32-byte (256-bit) AES key.
        This is deterministic: Same password + Same salt = Same Key.
        """
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32, # 32 bytes = 256 bits
            salt=salt,
            iterations=100_000,
            backend=default_backend()
        )
        return kdf.derive(password.encode())

    @staticmethod
    def encode_salt(salt: bytes) -> str:
        """Helper to store bytes as string in DB"""
        return base64.b64encode(salt).decode('utf-8')

    @staticmethod
    def decode_salt(salt_str: str) -> bytes:
        """Helper to read string from DB back to bytes"""
        return base64.b64decode(salt_str)