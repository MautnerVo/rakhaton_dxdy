import pickle
import json
import numpy as np
from flask import Flask, request
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)

with open('rsf.pkl', 'rb') as model_file:
    model = joblib.load(model_file)
print(model)

@app.route("/predict", methods=["GET", "POST"])
def predict():
    if request.method == "POST":
        data = request.get_json()
        np_data = np.array(list(data.values()))

        pred = model.predict(np_data)
        return json.dumps(pred.tolist())
    else:
        return 'Bro you should send me json data wtf'

if __name__ == "__main__":
    app.run(host="localhost", port=5000)
