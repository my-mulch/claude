import numpy as np

goals = np.array([1.1, -2.3]).reshape(2, 1)
inputs = np.array([0.2])
weights = np.array([-20., -20.]).reshape(2, 1)

alpha = 0.1

# Visualize Error Space
X, Y = np.mgrid[-40:40:1000j, -40:40:1000j]

grid = np.vstack([X.ravel(), Y.ravel()])
errors = np.linalg.norm((grid * inputs - goals) ** 2, axis=0)

plot = np.vstack((
    X.reshape(1, -1),
    errors.reshape(1, -1),
    Y.reshape(1, -1),
)).T.astype(np.float32)

f = open('./errors', 'wb')
f.write(plot.tobytes())
f.close()

guesses = np.zeros((1111, 3), dtype=np.float32)

# Learning
for i in range(1111):
    pred = weights * inputs
    delta = pred - goals

    error = delta ** 2

    guesses[i] = np.array([weights[0], np.linalg.norm(error), weights[1]])

    if not i % 100:
        print("----------{}------------".format(i))
        print("pred{}".format(pred.tolist()))
        print("goals{}".format(goals.tolist()))

    grad = 2 * inputs * delta
    weights -= grad * alpha

f = open('./guesses', 'wb')
f.write(guesses.tobytes())
f.close()
