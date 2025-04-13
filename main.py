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

set_config(display="text")

random_state = 42
# data = pd.read_csv(f"data_top_10.csv")
# data['recurrence'] = data['recurrence'].astype(bool)

# data.loc[data['duration'] < 0, 'duration'] = 0
    
# Xtrain, Xval = train_test_split(data, test_size=0.33, random_state=random_state)
# Xval, Xtest = train_test_split(data, test_size=0.5, random_state=random_state)

# ytrain = Xtrain[['recurrence', 'duration']]
# Xtrain.drop(columns=['recurrence', 'duration'], inplace=True)

# yval = Xval[['recurrence', 'duration']]
# Xval.drop(columns=['recurrence','duration'], inplace=True)

# ytest = Xtest[['recurrence', 'duration']]
# Xtest.drop(columns=['recurrence', 'duration'], inplace=True)

# ytrain = ytrain.to_records(index=False)
# yval = yval.to_records(index=False)

# rsf = RandomSurvivalForest(n_estimators=100, min_samples_split=10, random_state=random_state, n_jobs=5)
# rsf.fit(Xtrain, ytrain)

#     # Evaluate the model
# score = rsf.score(Xval, yval)
# print(f"{score}")

#     # Save the model
# joblib.dump(rsf, f'rsf_model_top10!.pkl')
from sklearn.model_selection import PredefinedSplit
from skopt import BayesSearchCV
from skopt.space import Integer, Real
from skopt.callbacks import VerboseCallback
import pandas as pd
import joblib

for x in [10]:
    data = pd.read_csv(f"data_last_minute.csv")
    data['recurrence'] = data['recurrence'].astype(bool)
    data.loc[data['duration'] < 0, 'duration'] = 0

    # Vytvoř si train/val split předem
    X_all, Xtest = train_test_split(data, test_size=0.33, random_state=42)
    Xtrain, Xval = train_test_split(X_all, test_size=0.5, random_state=42)

    # Kombinuj train + val do jednoho datasetu
    X = pd.concat([Xtrain, Xval], ignore_index=True)
    y = pd.concat([Xtrain[['recurrence', 'duration']], Xval[['recurrence', 'duration']]], ignore_index=True)
    y = y.to_records(index=False)

    X.drop(columns=['recurrence', 'duration'], inplace=True)

    # PredefinedSplit: -1 = train, 0 = validation
    test_fold = [-1] * len(Xtrain) + [0] * len(Xval)
    ps = PredefinedSplit(test_fold)

    search_space = {
        'n_estimators': Integer(50, 150),
        'min_samples_split': Integer(2, 10),
        'max_depth': Integer(5, 15),
        'max_features': Real(0.3, 0.9),
    }

    rsf = RandomSurvivalForest(random_state=42, n_jobs=5)

    opt = BayesSearchCV(
        estimator=rsf,
        search_spaces=search_space,
        n_iter=2,
        cv=ps,
        # n_jobs=-1,
        random_state=42,
        verbose=0
    )

    def print_step_callback(res):
        i = len(res.x_iters)
        print(f"Step {i}:")
        print(f"  Hyperparameters: {res.x}")
        print(f"  Score: {-res.fun:.4f}")  # musíme mínus, protože BayesSearchCV minimalizuje

    print(f"Start optimization for top_{x}")
    opt.fit(X, y, callback=[print_step_callback, VerboseCallback(n_total=5)])

    best_model = opt.best_estimator_
    print(f"Best score for top_{x}: {opt.best_score_:.4f}")

    joblib.dump(best_model, f'rsf_model_top_last_minute_bayes.pkl')