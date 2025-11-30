import os
import random
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Firebase
from firebase_config import db
from google.cloud import firestore

# Helper functions
from utils_auth import generate_otp, generate_password


app = Flask(__name__)
CORS(app)

# ---------------------------
# SHUFFLE CARDS
# ---------------------------
@app.route("/shuffle", methods=["GET"])
def shuffle_cards():
    values = []
    for i in range(1, 13):
        values.append(i)
        values.append(i)
    values.append("X")

    random.shuffle(values)
    return jsonify({"cards": values})


# ---------------------------
# SCORE CALCULATION
# ---------------------------
@app.route("/score", methods=["POST"])
def score():
    data = request.json
    moves = data.get("moves")
    matched_pairs = data.get("matched")
    score_val = matched_pairs * 10 - moves
    return jsonify({"score": score_val})


# ---------------------------
# SIGNUP – WITHOUT EMAIL (TESTING)
# ---------------------------
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email")

    if not email:
        return jsonify({"success": False, "message": "Email required"}), 400

    user_ref = db.collection("users").document(email)
    user_doc = user_ref.get()

    if user_doc.exists:
        return jsonify({"success": False, "message": "User already exists"}), 400

    otp = generate_otp(4)
    password = generate_password()

    user_ref.set({
        "email": email,
        "otp": otp,
        "password": password,
        "totalScore": 0,
        "verified": False
    })

    # ✅ TESTING MODE: Return OTP and password in response instead of emailing
    return jsonify({
        "success": True,
        "message": "Account created! Use the OTP below to verify.",
        "otp": otp,
        "password": password
    }), 201


# ---------------------------
# VERIFY OTP
# ---------------------------
@app.route("/verify-otp", methods=["POST"])
def verify_otp():
    data = request.json
    email = data.get("email")
    otp_entered = data.get("otp")

    user_ref = db.collection("users").document(email)
    user_doc = user_ref.get()

    if not user_doc.exists:
        return jsonify({"success": False, "message": "User not found"}), 404

    saved_otp = str(user_doc.to_dict().get("otp"))

    if str(otp_entered) == saved_otp:
        user_ref.update({"verified": True})
        return jsonify({"success": True, "message": "OTP Verified!"})

    return jsonify({"success": False, "message": "Invalid OTP"}), 400


# ---------------------------
# LOGIN
# ---------------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password_entered = data.get("password")

    if not email or not password_entered:
        return jsonify({"success": False, "message": "Missing fields"}), 400

    user_ref = db.collection("users").document(email)
    user_doc = user_ref.get()

    if not user_doc.exists:
        return jsonify({"success": False, "message": "User not found"}), 404

    user_data = user_doc.to_dict()

    if not user_data.get("verified"):
        return jsonify({"success": False, "message": "User not verified"}), 403

    if password_entered != user_data.get("password"):
        return jsonify({"success": False, "message": "Incorrect password"}), 400

    return jsonify({
        "success": True,
        "message": "Login successful",
        "email": email
    })


# ---------------------------
# GET USER DATA
# ---------------------------
@app.route("/user/<email>", methods=["GET"])
def get_user(email):
    user_ref = db.collection("users").document(email)
    user_doc = user_ref.get()

    if not user_doc.exists:
        return jsonify({"success": False, "message": "User not found"}), 404

    return jsonify({"success": True, "user": user_doc.to_dict()})


# ---------------------------
# UPDATE USER SCORE
# ---------------------------
@app.route("/user/<email>/score", methods=["POST"])
def update_score(email):
    data = request.json
    new_score = data.get("score", 0)

    user_ref = db.collection("users").document(email)
    user_doc = user_ref.get()

    if not user_doc.exists:
        return jsonify({"success": False, "message": "User not found"}), 404

    prev = user_doc.to_dict().get("totalScore", 0)
    updated_total = prev + new_score

    user_ref.update({"totalScore": updated_total})

    return jsonify({"success": True, "totalScore": updated_total})


# ---------------------------
# LEADERBOARD
# ---------------------------
@app.route("/leaderboard", methods=["GET"])
def leaderboard():
    users = db.collection("users") \
        .order_by("totalScore", direction=firestore.Query.DESCENDING) \
        .limit(10) \
        .stream()

    results = []
    for u in users:
        d = u.to_dict()
        results.append({
            "email": d.get("email"),
            "totalScore": d.get("totalScore", 0)
        })

    return jsonify({"success": True, "leaderboard": results})


# ---------------------------
# FIRESTORE TEST
# ---------------------------
@app.route("/test-firestore")
def test_firestore():
    try:
        db.collection("test").document("ping").set({"msg": "hello"})
        return "Firestore connected!"
    except Exception as e:
        return f"Error: {str(e)}"


# ---------------------------
# START SERVER
# ---------------------------
if __name__ == "__main__":
    app.run(debug=True)
