import pickle
import shap
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
        if 'pldelka' in data:
            data['pldelka'] = float(data['pldelka'])
        if 'plpocetlecebH' in data:
            data['plpocetlecebH'] = float(data['plpocetlecebH'])
        if 'plpocetleceb' in data:
            data['plpocetleceb'] = float(data['plpocetleceb'])
        if 'plct' in data:
            data['plct'] = float(data['plct'])
        if 'plpocetlecebC' in data:
            data['plpocetlecebC'] = float(data['plpocetlecebC'])
        if 'tnmklasifikacenkodnula' in data:
            data['tnmklasifikacenkodnula'] = float(data['tnmklasifikacenkodnula'])
        if 'plpocetlecebR' in data:
            data['plpocetlecebR'] = float(data['plpocetlecebR'])
        if 'plsono' in data:
            data['plsono'] = float(data['plsono'])
        if 'plpocetlecebT' in data:
            data['plpocetlecebT'] = float(data['plpocetlecebT'])
        if 'novotvarporadi' in data:
            data['novotvarporadi'] = float(data['novotvarporadi'])
        
        print(data)
        np_data = np.array(list(data.values())).reshape(1, -1)

        pred = model.predict_survival_function(np_data, return_array=True)
        explanation = shap.Explainer(model.predict, np_data)
        print(explanation)
        shap_values = explanation(np_data)
        print(shap_values)
        feature_names = shap_values.feature_names
        shap_values = shap_values.values[0]
        feature_importance = list(zip(feature_names, shap_values))

        print(feature_importance)
        return json.dumps(pred.tolist())
    else:
        return 'Bro you should send me json data wtf'

if __name__ == "__main__":
    app.run(host="localhost", port=5000)
