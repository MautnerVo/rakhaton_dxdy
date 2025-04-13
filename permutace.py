import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split

import joblib
from sklearn import set_config
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OrdinalEncoder

from sksurv.ensemble import RandomSurvivalForest

from skopt import gp_minimize
from skopt.space import Real, Integer

from sklearn.inspection import permutation_importance

random_state = 42   

data = pd.read_csv("data_final_rec(1).csv")
data = data.sample(frac=1, random_state=5).reset_index(drop=True)
data['recurrence'] = data['recurrence'].astype(bool)

data.loc[data['duration'] < 0, 'duration'] = 0
Xtrain, Xval = train_test_split(data, test_size=0.33, random_state=random_state)
Xval, Xtest = train_test_split(data, test_size=0.5, random_state=random_state)

ytrain = Xtrain[['recurrence', 'duration']]
Xtrain.drop(columns=['recurrence', 'duration'], inplace=True)

yval = Xval[['recurrence', 'duration']]
Xval.drop(columns=['recurrence','duration'], inplace=True)

ytest = Xtest[['recurrence', 'duration']]
Xtest.drop(columns=['recurrence', 'duration'], inplace=True)

ytrain = ytrain.to_records(index=False)
yval = yval.to_records(index=False)

rsf = joblib.load('rsf_model_top!.pkl')

print("jdu na to")

import shap
import matplotlib.pyplot as plt

Xval = Xval.apply(lambda col: col.astype(int) if col.dtype == bool else col)
Xtrain = Xtrain.apply(lambda col: col.astype(int) if col.dtype == bool else col)

total_shap = np.zeros(Xval.shape[1])
base_value = 0.0

#shuffle dataset rows

for i in range(len(Xval[:5000])):
    # Create the SHAP explainer object for the i-th test sample
    explainer = shap.Explainer(rsf.predict, Xtrain.iloc[[i]])
    shap_values = explainer(Xval.iloc[[i]])
    
    # Initialize the total_shap array with the first iteration
    if i == 0:
        feature_names = shap_values.feature_names  # List of feature names
        data_example = shap_values.data[0]  # First sample's data
        base_value = shap_values.base_values[0]  # Base value from the first explainer
        total_shap = shap_values.values[0].copy()  # SHAP values of the first sample
    else:
        # Accumulate SHAP values for all samples
        total_shap += abs(shap_values.values[0])

    if i % 100 == 0:
        print(f"Done {i}")

print("final total:")
print(total_shap)

# Zip total_shap with feature names
feature_importance = list(zip(feature_names, total_shap))
print("lol")

# Sort feature importance by the SHAP values in descending order (absolute value)
sorted_feature_importance = sorted(feature_importance, key=lambda x: abs(x[1]), reverse=True)

# Print the sorted feature importance (top 10)
print("Sorted Feature Importance (Top 10):")
for name, importance in sorted_feature_importance[:100]:
    print(f"{name}: {importance}")

# Save the sorted feature importance to a text file
with open("sorted_feature_importance.txt", "w") as f:
    for name, importance in sorted_feature_importance:
        f.write(f"{name}: {importance}\n")

print("Feature importance saved to 'sorted_feature_importance.txt'")


# Average the SHAP values over all samples
avg_shap = total_shap / len(Xval)

# Create a new Explanation object
avg_explanation = shap.Explanation(
    values=avg_shap,
    base_values=base_value,
    data=data_example,
    feature_names=feature_names
)
total_explanation = shap.Explanation(
    values = total_shap,
    base_values=base_value,
    data=data_example,
    feature_names=feature_names
)
# print(total_explanation.shape)

shap.plots.waterfall(total_explanation)
plt.savefig("watefall_total.png", dpi=300, bbox_inches = "tight")

shap.plots.waterfall(avg_explanation)
plt.savefig("waterfall_avg.png", dpi=300, bbox_inches="tight")


feature_importance = total_explanation.feature_names

# Seřazení podle SHAP hodnot v sestupném pořadí
feature_importance_sorted = sorted(feature_importance, key=lambda x: x[1], reverse=True)

# Vytisknutí nebo uložení seřazených hodnot
with open("feature_importance.txt", "w") as f:
    for feature in feature_importance_sorted:
        f.write(f"{feature}\n")

print("Feature importance saved to 'feature_importance.txt'.")