# firebase_config.py

import firebase_admin
from firebase_admin import credentials, firestore

# Load Firebase Credentials
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
cred_path = os.path.join(BASE_DIR, "memory-game-bc08c-firebase-adminsdk-fbsvc-0fe31a139e.json")

cred = credentials.Certificate(cred_path)

# Initialize app only once
try:
    firebase_admin.get_app()
except ValueError:
    firebase_admin.initialize_app(cred)

# Firestore database instance
db = firestore.client()
