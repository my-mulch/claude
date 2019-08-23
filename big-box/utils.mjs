import { __Math__, QUATERNION_REGEX } from '../resources/big-box'

export const parseNumber = function (w) {
    w = String(w)

    let plus = 1
    let minus = 0

    const dest = {}
    const tokens = w.match(QUATERNION_REGEX)

    var iMap = { 'i': 'x', 'j': 'y', 'k': 'z' };
    dest['w'] = dest['x'] = dest['y'] = dest['z'] = 0

    for (var i = 0; i < tokens.length; i++) {

        var c = tokens[i];
        var d = tokens[i + 1];

        if (c === ' ' || c === '\t' || c === '\n') {
            /* void */
        } else if (c === '+') {
            plus++;
        } else if (c === '-') {
            minus++;
        } else {

            if (plus + minus === 0) {
                throw new Error('Parse error' + c);
            }
            var g = iMap[c];

            // Is the current token an imaginary sign?
            if (g !== undefined) {

                // Is the following token a number?
                if (d !== ' ' && !isNaN(d)) {
                    c = d;
                    i++;
                } else {
                    c = '1';
                }

            } else {


                g = iMap[d];

                if (g !== undefined) {
                    i++;
                }
            }

            dest[g || 'w'] += parseFloat((minus % 2 ? '-' : '') + c);
            plus = minus = 0;
        }
    }


    return { r: dest['w'], i: dest['x'], j: dest['y'], k: dest['z'] }
}

function stringNumberHelper(n, char, prev) {
    let ret = ''

    if (n !== 0) {

        if (prev !== '')
            ret += n < 0 ? ' - ' : ' + '

        else if (n < 0)
            ret += '-'

        n = Math.abs(n)

        if (1 !== n || char === '')
            ret += n;

        ret += char
    }

    return ret
}

export const stringNumber = function (r, i, j, k) {
    var ret = '';

    ret = stringNumberHelper(r || 0, '', ret);
    ret += stringNumberHelper(i || 0, 'i', ret);
    ret += stringNumberHelper(j || 0, 'j', ret);
    ret += stringNumberHelper(k || 0, 'k', ret);

    if ('' === ret)
        return '0';

    return ret;
}

export const isTypedArray = function ({ data }) {
    return data.constructor === Float32Array
        || data.constructor === Int8Array
        || data.constructor === Int16Array
        || data.constructor === Int32Array
        || data.constructor === Uint8Array
        || data.constructor === Uint16Array
        || data.constructor === Uint32Array
        || data.constructor === Uint8ClampedArray
}

export const shapeRaw = function ({ data, shape = [] }) {
    if (data.constructor !== Array)
        return shape

    return shapeRaw({
        data: data[0],
        shape: shape.concat(data.length)
    })
}

export const shapeAlign = function ({ short, delta }) {
    return short.reshape({
        shape: new Array(delta)
            .fill(1)
            .concat(short.shape)
    })
}

function axesToShape(axis) { return this.shape[axis] }

export const selfAxesAndShape = function ({ axes = [...this.shape.keys()] }) {
    const axesSet = new Set(axes)
    const axesShape = axes
    const axesSize = axes.map(axesToShape, this).reduce(__Math__.multiply)
    const resultShape = []
    const alignedShape = []

    for (let i = 0; i < this.shape.length; i++)
        if (!axesSet.has(i)) {
            axesShape.push(i)
            resultShape.push(this.shape[i])
            alignedShape.push(this.shape[i])
        } else
            alignedShape.push(1)

    return {
        resultShape,
        alignedShape,
        axesShape,
        axesSize,
        fullShape: this.shape,
        fullSize: this.size
    }
}

export const pairAxesAndShape = function (args) {
    const axesMatch = []
    const axesMismatch = []
    const fullShape = []

    const ofShape = this.shape
    const withShape = args.with.shape || this.shape

    for (let i = 0; i < ofShape.length; i++)
        if (ofShape[i] === 1) {
            axesMismatch.push(i)
            fullShape.push(withShape[i])
        }

        else if (withShape[i] === 1) {
            axesMismatch.push(i)
            fullShape.push(ofShape[i])
        }

        else if (ofShape[i] === withShape[i]) {
            axesMatch.push(i)
            fullShape.push(ofShape[i])
        }

    const axesShape = axesMismatch.concat(axesMatch)

    return {
        fullShape,
        axesShape,
        axesSize: axesShape.map(axesToShape, this).reduce(__Math__.multiply),
        fullSize: fullShape.reduce(__Math__.multiply),
    }
}
