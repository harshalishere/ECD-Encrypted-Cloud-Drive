import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

class FileEncryptor:
    def __init__(self, key: bytes):
        """Initialize with a 256-bit key."""
        self.aesgcm = AESGCM(key)

    def encrypt(self, data: bytes) -> tuple[bytes, bytes]:
        """
        Encrypts raw data.
        Returns: (encrypted_data, nonce)
        """
        # AES-GCM requires a unique "nonce" (number used once) for every encryption
        nonce = os.urandom(12) 
        ciphertext = self.aesgcm.encrypt(nonce, data, None)
        return ciphertext, nonce

    def decrypt(self, ciphertext: bytes, nonce: bytes) -> bytes:
        """
        Decrypts data.
        """
        return self.aesgcm.decrypt(nonce, ciphertext, None)