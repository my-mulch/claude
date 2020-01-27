import numpy as np
from sklearn.datasets import fetch_openml # MNIST data

### load MNIST data from https://www.openml.org/d/554
X, y = fetch_openml('mnist_784', version=1, return_X_y=True)

# The most basic neural network - a matrix multiplication
goals = np.array([1.1, -2.3, 6., 2.3]).reshape(4, 1)
inputs = np.array([0.2, -0.2, 1.1]).reshape(3, 1)
weights = np.random.randn(4, 3)
alpha = 0.01

# Learning
for i in range(1262):
    pred = weights.dot(inputs)
    deltas = pred - goals

    error = deltas ** 2

    if not i % 1000:
        print("----------{}------------".format(i))
        print("pred{}".format(pred.tolist()))
        print("goals{}".format(goals.tolist()))

    # weights[0] -= alpha * 2 * inputs[:, 0] * deltas[0]
    # weights[1] -= alpha * 2 * inputs[:, 0] * deltas[1]
    # weights[2] -= alpha * 2 * inputs[:, 0] * deltas[2]
    # weights[3] -= alpha * 2 * inputs[:, 0] * deltas[3]

    # weights[:, 0] -= alpha * 2 * deltas[:, 0] * inputs[0]
    # weights[:, 1] -= alpha * 2 * deltas[:, 0] * inputs[1]
    # weights[:, 2] -= alpha * 2 * deltas[:, 0] * inputs[2]

    weights -= alpha * 2 * deltas.dot(inputs.T)


# f = open('./guesses', 'wb')
# f.write(guesses.tobytes())
# f.close()
