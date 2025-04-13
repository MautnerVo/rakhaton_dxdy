import pickle
import shap
import json
import numpy as np
from flask import Flask, request
from flask_cors import CORS
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app)

shap_test = pd.read_csv('shap_pred.csv')
for col in shap_test.columns:
    shap_test[col] = shap_test[col].astype("float64")

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
        explainer = shap.Explainer(model.predict, np_data)        
        
        for i in range(len(shap_test)):
            shap_values = explainer(shap_test.iloc[[i]].astype("float64"))

            if i == 0:
                feature_names = shap_values.feature_names
                total_shap = shap_values.values[0].copy()
            else:
                total_shap += shap_values.values[0]
                
        total_shap = -total_shap / (20 * 365)

        feature_importance = list(zip(feature_names, total_shap))
        feature_importance.sort(key=lambda x: x[1], reverse=True)

        importance_json = [
            {"feature": name, "importance": float(importance)}
              for name, importance in feature_importance
        ]

        response = {
            "prediction": pred.tolist(),
            "shap_values": importance_json,
        }

        return json.dumps(response, indent=4, ensure_ascii=False)
    else:
        return 'Bro you should send me json data wtf'

if __name__ == "__main__":
    app.run(host="localhost", port=5000)
