import secrets

def generate_jwt_secret_key(length=64):
    """
    Generate a secure random JWT secret key.
    
    Args:
        length (int): Length of the key in bytes (default: 64).
    
    Returns:
        str: Hex-encoded secret key.
    """
    return secrets.token_hex(length)

if __name__ == "__main__":
    key = generate_jwt_secret_key()
    print(f"Generated JWT Secret Key: {key}")
    print("Add this to your .env file as JWT_SECRET_KEY=<key>")