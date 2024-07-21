# Import necessary modules
import pyrebase
from flask import Flask, flash, redirect, render_template, request, session, abort, url_for, jsonify
from datetime import datetime
import re
import json


import AStar as AS

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter



# Create a new Flask application
app = Flask(__name__)
# Set the secret key for the Flask app. This is used for session security.
app.secret_key = "omdklapegdskfuefqkmaqplh"



# Configuration for Firebase
config = {
  "apiKey": "AIzaSyD1O_5v-8efALgqOc0_gLLDVh2G0Bnm664",
  "authDomain": "irespond-c4529.firebaseapp.com",
  "databaseURL": "https://irespond-c4529-default-rtdb.asia-southeast1.firebasedatabase.app",
  "projectId": "irespond-c4529",
  "storageBucket": "irespond-c4529.appspot.com",
  "messagingSenderId": "526534523749",
  "appId": "1:526534523749:web:7fee852ea316cedb917f8c",
  "measurementId": "G-LMX84V2E20"}

# Initialize Firebase
firebase = pyrebase.initialize_app(config)

# Get reference to the auth service and database service
auth = firebase.auth()
db = firebase.database()

# Use the application default credentials.
cred = credentials.Certificate('static/irespond-c4529-firebase-adminsdk-7zg5m-08b916abcc.json')

firebase_admin.initialize_app(cred)
fbFirestore = firestore.client()

# Route for the login page
@app.route("/")
def login():
    return render_template("login.html")

# Route for the signup page
@app.route("/signup")
def signup():
    return render_template("signup.html")

# Route for the dispatch page
@app.route("/admin")
def admin():
    # Check if user is logged in
    if session.get("is_logged_in", False):
        return render_template("error.html", email=session["email"], name=session["name"], level=session["level"])
    else:
        # If user is not logged in, redirect to login page
        return redirect(url_for('login'))
    
@app.route("/map_curr")
def map_curr():
    # Check if user is logged in
    if session.get("is_logged_in", False):
        return render_template("map_curr.html", email=session["email"], name=session["name"], level=session["level"])
    else:
        # If user is not logged in, redirect to login page
        return redirect(url_for('login'))

# Route for the dispatch page
@app.route("/dispatcher", methods=['GET','POST'])
def dispatcher():

    # Check if user is logged in
    if session.get("is_logged_in", False):
        dispatcher_id = session["uid"]
        reports = (
                        fbFirestore.collection('reports')
                        .where("alert", "==", "ON")
                        .where("dispatcher", "==", dispatcher_id)
                        .stream()
                        
                    )
        coords = []
        

            

        for reportRef in reports:
              
            coords.append("{latitude},{longitude},{url},{report_id},{label},{prob},{address},{timestamp},{saved_label},{saved_prob}".format(latitude=reportRef.to_dict()['lat'], longitude=reportRef.to_dict()['long'], url=reportRef.to_dict()['image_url'], report_id=reportRef.to_dict()['report_id'], label="label", prob="probability", address=reportRef.to_dict()['address'], timestamp=reportRef.to_dict()['timestamp'], saved_label=reportRef.to_dict()['image_class'], saved_prob=reportRef.to_dict()['prob']))
            print(coords)


        return render_template("dispatcher.html", email=session["email"], name=session["name"], level=session["level"], coords=coords)
    else:
        # If user is not logged in, redirect to login page
        return redirect(url_for('login'))

# Route for the widget page
@app.route("/image_details", methods=['GET','POST'])
def image_details():
    # Check if user is logged in
    if session.get("is_logged_in", False):
        image_list = [];
        timestamp_list = [];
        if request.method == 'POST':
        
            report_id = request.form.get('report_id_image')
            label = request.form.get('label_image')
            prob = request.form.get('prob_image')
            address = request.form.get('address_image')
            date_time = request.form.get('date_time_image')

            imageList = (
            fbFirestore.collection('image_metadata')
                .where("report_id", "==", report_id)
                .stream()
                        
                )
                
            for imageRef in imageList:
                image_list.append("{image_url}".format(image_url=imageRef.to_dict()['image_url']))
                timestamp_list.append("{timestamp}".format(timestamp=imageRef.to_dict()['timestamp']))
                print(image_list)


        return render_template("update_image.html", email=session["email"], name=session["name"], level=session["level"], report_id=report_id, label=label, prob=prob, address=address, image_list=image_list, timestamp=date_time)
    else:
        # If user is not logged in, redirect to login page
        return redirect(url_for('login'))

@app.route("/update", methods=['GET','POST'])
def update():
    # Check if user is logged in
    if session.get("is_logged_in", False):
        if request.method == 'POST':
            report_id = request.form.get('update_report_id')
            saved_label = request.form.get('update_label')
            #prob = request.form.get('update_prob')

            update_report = fbFirestore.collection('reports').document(report_id)
            report_field_update = {
                        "image_class": saved_label,
                        "prob": "Not Applicable"

                    }
            update_report.update(report_field_update)

            update_image_metadata = (fbFirestore.collection('image_metadata').where("report_id", "==",report_id).stream())
            for image_metadataRef in update_image_metadata:
                image_id = u'{}'.format(image_metadataRef.to_dict()['image_id'])

                update_each_image_metadata = fbFirestore.collection('image_metadata').document(image_id)
                image_metadata_field_update = {
                            "image_class": saved_label,
                            "prob": "Not Applicable"

                        }
                update_each_image_metadata.update(image_metadata_field_update)

            

        return redirect(url_for('dispatcher'))
    else:
        # If user is not logged in, redirect to login page
        return redirect(url_for('login'))
    
@app.route("/update_feedback", methods=['GET','POST'])
def update_feedback():
    # Check if user is logged in
    if session.get("is_logged_in", False):
        if request.method == 'POST':
            report_id = request.form.get('input_report_id')
            feedback = request.form.get('txt_feedback')
            #prob = request.form.get('update_prob')

            update_report_feedback = fbFirestore.collection('reports').document(report_id)
            feedback_field_update = {
                        "feedback": feedback,
                        "alert": "OFF"

                    }
            update_report_feedback.update(feedback_field_update)


            

        return render_template("dispatcher_landing.html", email=session["email"], name=session["name"], level=session["level"])
    else:
        # If user is not logged in, redirect to login page
        return redirect(url_for('login'))
    
@app.route("/forms")
def forms():
    # Check if user is logged in
    if session.get("is_logged_in", False):
        return render_template("index.html", email=session["email"], name=session["name"], level=session["level"])
    else:
        # If user is not logged in, redirect to login page
        return redirect(url_for('login'))

# Function to check password strength
def check_password_strength(password):
    # At least one lower case letter, one upper case letter, one digit, one special character, and at least 8 characters long
    return re.match(r'^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$', password) is not None

# Route for login result
@app.route("/result", methods=["POST", "GET"])
def result():
    if request.method == "POST":
        result = request.form
        email = result["email"]
        password = result["pass"]
        try:
            # Authenticate user
            user = auth.sign_in_with_email_and_password(email, password)
            session["is_logged_in"] = True
            session["email"] = user["email"]
            session["uid"] = user["localId"]
            # Fetch user data
            data = db.child("users").get().val()
            # Update session data
            if data and session["uid"] in data:
                session["name"] = data[session["uid"]]["name"]
                session["level"] = data[session["uid"]]["level"]
                # Update last login time
                db.child("users").child(session["uid"]).update({"last_logged_in": datetime.now().strftime("%m/%d/%Y, %H:%M:%S")})
            else:
                session["name"] = "User"
            # Redirect to welcome page
            return redirect(url_for(session["level"]))
        
        except Exception as e:
            print("Error occurred: ", e)
            return redirect(url_for('login'))
    else:
        # If user is logged in, redirect to welcome page
        if session.get("is_logged_in", False):
            return redirect(url_for(session["level"]))
        else:
            return redirect(url_for('login'))

# Route for user registration
@app.route("/register", methods=["POST", "GET"])
def register():
    if request.method == "POST":
        result = request.form
        email = result["email"]
        password = result["pass"]
        name = result["name"]
        if not check_password_strength(password):
            print("Password does not meet strength requirements")
            return redirect(url_for('signup'))
        try:
            # Create user account
            auth.create_user_with_email_and_password(email, password)
            # Authenticate user
            user = auth.sign_in_with_email_and_password(email, password)
            session["is_logged_in"] = False
            session["email"] = user["email"]
            session["uid"] = user["localId"]
            session["name"] = name
            # Save user data
            data = {"name": name, "email": email, "last_logged_in": datetime.now().strftime("%m/%d/%Y, %H:%M:%S"), "level": "dispatcher", "uid": session["uid"]}
            db.child("users").child(session["uid"]).set(data)
            return redirect(url_for('login'))
        except Exception as e:
            print("Error occurred during registration: ", e)
            return redirect(url_for('signup'))
    else:
        # If user is logged in, redirect to welcome page
        if session.get("is_logged_in", False):
            return redirect(url_for(session["level"]))
        else:
            return redirect(url_for('signup'))

# Route for password reset
@app.route("/reset_password", methods=["GET", "POST"])
def reset_password():
    if request.method == "POST":
        email = request.form["email"]
        try:
            # Send password reset email
            auth.send_password_reset_email(email)
            return render_template("reset_password_done.html")  # Show a page telling user to check their email
        except Exception as e:
            print("Error occurred: ", e)
            return render_template("reset_password.html", error="An error occurred. Please try again.")  # Show error on reset password page
    else:
        return render_template("reset_password.html")  # Show the password reset page

# Route for logout
@app.route("/logout")
def logout():
    # Update last logout time
    db.child("users").child(session["uid"]).update({"last_logged_out": datetime.now().strftime("%m/%d/%Y, %H:%M:%S")})
    session["is_logged_in"] = False
    return redirect(url_for('login'))


# CNN and AStar

@app.route('/submit', methods = ['POST'])
def crunchData():
	# Get data
	data = request.get_json(force=True)
	adjacencyMatrix = data['adjacency']
	distanceMatrix = data['distance']
	start = int(data['start'])
	end = int(data['end'])

	# Find shortest path
	listOfShortestPath = AS.AStar(adjacencyMatrix, distanceMatrix, start, end)
	
	return jsonify(listOfShortestPath)




if __name__ == "__main__":
    app.run(debug=True)
