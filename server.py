import time
from flask import Flask, request, make_response
from flask_cors import CORS

import json
import numpy as np

app = Flask(__name__)
CORS(app)

cache = {}


def cache_and_serve(array):
    addr, _ = array.__array_interface__['data']

    cache[addr] = array

    return make_response(array.tobytes(), {
        'Access-Control-Expose-Headers': 'metadata',
        'metadata': json.dumps({
            'addr': addr,
            'size': array.size,
            'shape': array.shape,
            'dtype': str(array.dtype),
            'strides': array.strides,
        })
    })


@app.route("/array", methods=["GET"])
def array():
    args = json.loads(request.headers.get('args'))

    array = np.array(object=args.get('object'), dtype=args.get('dtype'),
                     copy=args.get('copy'), order=args.get('order'),
                     subok=args.get('subok'), ndmin=args.get('ndmin'))

    return cache_and_serve(array)


@app.route("/reshape", methods=["GET"])
def reshape():
    args = json.loads(request.headers.get('args'))

    array = cache[args.get('header')['addr']]
    array = array.reshape(*args.get('shape'))

    return cache_and_serve(array)


@app.route("/dot", methods=["GET"])
def dot():
    args = json.loads(request.headers.get('args'))

    array = np.dot(a=cache[args.get('a')['addr']],
                   b=cache[args.get('b')['addr']])

    return cache_and_serve(array)


@app.route("/ones", methods=["GET"])
def ones():
    args = json.loads(request.headers.get('args'))

    array = np.ones(shape=args.get('shape'),
                    dtype=args.get('dtype'),
                    order=args.get('order'))

    return cache_and_serve(array)


@app.route("/randn", methods=["GET"])
def randn():
    args = json.loads(request.headers.get('args'))

    array = np.random.randn(*args.get('dims'))

    return cache_and_serve(array)


@app.route("/toString", methods=["GET"])
def toString():
    args = json.loads(request.headers.get('args'))

    array = cache[args.get('addr')]

    return np.array_repr(array)
