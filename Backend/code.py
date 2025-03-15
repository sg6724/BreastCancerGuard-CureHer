"""
This module trains and saves the models needed for the breast cancer diagnosis system.
Run this script to generate all model files required by the FastAPI backend.
"""

import pandas as pd
import numpy as np
from sklearn.metrics import accuracy_score
from sklearn.metrics import calinski_harabasz_score, silhouette_score
from ucimlrepo import fetch_ucirepo
from sklearn.preprocessing import MinMaxScaler
from sklearn.mixture import GaussianMixture
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

# Create models directory if it doesn't exist
os.makedirs("models", exist_ok=True)

def load_data():
    breast_cancer_wisconsin_original = fetch_ucirepo(id=15)
    X = breast_cancer_wisconsin_original.data.features
    y = breast_cancer_wisconsin_original.data.targets

    df = pd.concat([X, y], axis=1)
    df.drop_duplicates(inplace=True)

    if 'Bare_nuclei' in df.columns:
        df['Bare_nuclei'] = df['Bare_nuclei'].replace('?', np.nan).astype(float)
        df['Bare_nuclei'] = df['Bare_nuclei'].fillna(df['Bare_nuclei'].mean())

    Q1 = np.percentile(df['Mitoses'], 25)
    Q3 = np.percentile(df['Mitoses'], 75)
    IQR = Q3 - Q1
    lower_bound = Q1 - (1.5 * IQR)
    upper_bound = Q3 + (1.5 * IQR)
    df['Mitoses'] = np.clip(df['Mitoses'], lower_bound, upper_bound)

    X = df.iloc[:, :-1]
    y = df['Class']

    mm = MinMaxScaler()
    X_scaled = pd.DataFrame(mm.fit_transform(X), columns=X.columns)
    
    # Save the scaler
    joblib.dump(mm, "Backend/models/scaler.pkl")

    return X_scaled, y, df

def optimize_gmm(X, y):
    print("Optimizing Gaussian Mixture Model parameters...")

    # Parameters to tune
    n_components_range = range(2, 5)
    covariance_types = ['full', 'tied', 'diag', 'spherical']

    best_score = -1
    best_params = {}

    results = []

    # Try different combinations
    for n_components in n_components_range:
        for covariance_type in covariance_types:
            print(f"  Testing n_components={n_components}, covariance_type={covariance_type}")

            # Create model
            gmm = GaussianMixture(
                n_components=n_components,
                covariance_type=covariance_type,
                random_state=42,
                max_iter=200,
                n_init=10
            )

            # Fit and predict
            gmm.fit(X)
            cluster_labels = gmm.predict(X)

            # Map clusters to actual classes (0->2, 1->4)
            cluster_to_class = {}
            for cluster in range(n_components):
                cluster_data = y[cluster_labels == cluster]
                if len(cluster_data) > 0:
                    most_common_class = cluster_data.mode()[0]
                    cluster_to_class[cluster] = most_common_class
                else:
                    cluster_to_class[cluster] = 2  # Default to benign

            # Map predictions to actual class labels
            mapped_predictions = np.array([cluster_to_class[cluster] for cluster in cluster_labels])

            # Calculate metrics
            accuracy = accuracy_score(y, mapped_predictions)

            if len(np.unique(cluster_labels)) > 1:
                silhouette = silhouette_score(X, cluster_labels)
                calinski = calinski_harabasz_score(X, cluster_labels)
            else:
                silhouette = 0
                calinski = 0

            results.append({
                'n_components': n_components,
                'covariance_type': covariance_type,
                'accuracy': accuracy,
                'silhouette': silhouette,
                'calinski_harabasz': calinski
            })

            if accuracy > best_score:
                best_score = accuracy
                best_params = {
                    'n_components': n_components,
                    'covariance_type': covariance_type
                }

    results_df = pd.DataFrame(results)
    print("\nGMM Parameter Search Results:")
    print(results_df.sort_values('accuracy', ascending=False).head())

    print(f"\nBest GMM Parameters: {best_params}")
    print(f"Best Accuracy: {best_score:.4f}")

    best_gmm = GaussianMixture(
        n_components=best_params['n_components'],
        covariance_type=best_params['covariance_type'],
        random_state=42,
        max_iter=200,
        n_init=10
    )

    return best_gmm, best_params, best_score

def optimize_random_forest(X, y):
    print("Optimizing RandomForest for feature importance analysis...")

    # Set up parameter grid
    param_grid = {
        'n_estimators': [50, 100, 200],
        'max_depth': [None, 10, 20],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4]
    }

    # Initialize GridSearchCV
    grid_search = GridSearchCV(
        RandomForestClassifier(random_state=42),
        param_grid=param_grid,
        cv=5,
        scoring='accuracy',
        n_jobs=-1
    )

    # Fit grid search
    grid_search.fit(X, y)

    print(f"Best RF Parameters: {grid_search.best_params_}")
    print(f"Best RF Accuracy: {grid_search.best_score_:.4f}")

    return grid_search.best_estimator_

def get_cluster_to_diagnosis_mapping(cluster_labels, true_labels):
    """Create mapping from cluster ID to diagnosis"""
    cluster_to_diagnosis = {}
    for cluster in np.unique(cluster_labels):
        cluster_data = true_labels[cluster_labels == cluster]
        percent_malignant = np.mean(cluster_data == 4)
        if percent_malignant > 0.5:
            cluster_to_diagnosis[cluster] = "Malignant"
        else:
            cluster_to_diagnosis[cluster] = "Benign"
    
    return cluster_to_diagnosis

def save_models(best_model, best_rf, cluster_labels, true_labels, feature_names):
    """Save all models and metadata"""
    # Save the clustering model
    joblib.dump(best_model, "Backend/models/cluster_model.pkl")
    
    # Save the random forest model
    joblib.dump(best_rf, "Backend/models/rf_model.pkl")
    
    # Get and save cluster to diagnosis mapping
    cluster_to_diagnosis = get_cluster_to_diagnosis_mapping(cluster_labels, true_labels)
    joblib.dump(cluster_to_diagnosis, "Backend/models/cluster_to_diagnosis.joblib")
    
    # Calculate and save feature importance
    feature_importance = pd.DataFrame({
        'Feature': feature_names,
        'Importance': best_rf.feature_importances_
    }).sort_values('Importance', ascending=False)
    
    joblib.dump(feature_importance, "Backend/models/feature_importance.joblib")
    
    print("\nAll models saved successfully to the 'models' directory")
    
    return cluster_to_diagnosis, feature_importance

def main():
    # Load and prepare data
    X, y, df = load_data()

    # Optimize GMM
    print("\n--- Optimizing Gaussian Mixture Model ---")
    best_gmm, gmm_params, gmm_score = optimize_gmm(X, y)

    # Apply the best models
    print("\n--- Applying Best Models ---")

    # GMM
    best_gmm.fit(X)
    gmm_labels = best_gmm.predict(X)

    # Optimize Random Forest for feature importance
    best_rf = optimize_random_forest(X, y)
    
    # Save all models and metadata
    cluster_to_diagnosis, feature_importance = save_models(
        best_gmm, best_rf, gmm_labels, y.values, X.columns
    )

    print("\nBreast Cancer Diagnostic System models trained and saved.")

if __name__ == "__main__":
    main()