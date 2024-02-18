import pickle
from sklearn.externals import joblib
import tensorflow as tf


with open('model.pkl', 'rb') as file:

    model = pickle.load(file)
