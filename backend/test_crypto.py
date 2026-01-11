from app.core.crypto_utils import CryptoUtils
from app.services.encryption import FileEncryptor

def test_system():
    # 1. Simulate User Inputs
    password = "super-secure-password-123"
    print(f"🔒 Password: {password}")

    # 2. Generate Key
    salt = CryptoUtils.generate_salt()
    key = CryptoUtils.derive_key(password, salt)
    print(f"🔑 Derived Key (Hex): {key.hex()}")

    # 3. Simulate a File
    original_data = b"This is a secret document content."
    print(f"📄 Original Data: {original_data}")

    # 4. Encrypt
    encryptor = FileEncryptor(key)
    encrypted_data, nonce = encryptor.encrypt(original_data)
    print(f"🛡️ Encrypted Data: {encrypted_data[:20]}... (truncated)")

    # 5. Decrypt
    # To decrypt, we need the SAME key and the SAME nonce
    decryptor = FileEncryptor(key)
    decrypted_data = decryptor.decrypt(encrypted_data, nonce)
    print(f"🔓 Decrypted Data: {decrypted_data}")

    assert original_data == decrypted_data
    print("\n✅ SUCCESS: The Crypto Engine is working perfectly!")

if __name__ == "__main__":
    test_system()