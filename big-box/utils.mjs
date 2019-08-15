import { __Math__ } from './resources'

export const parseComplex = function (a, b) {

    var z = { 're': 0, 'im': 0 };

    if (a === undefined || a === null) {
        z['re'] = z['im'] = 0;
    } else if (b !== undefined) {
        z['re'] = a;
        z['im'] = b;
    } else
        switch (typeof a) {

            case 'object':

                if ('im' in a && 're' in a) {
                    z['re'] = a['re'];
                    z['im'] = a['im'];
                } else if ('abs' in a && 'arg' in a) {
                    if (!Number.isFinite(a['abs']) && Number.isFinite(a['arg'])) {
                        return Complex['INFINITY'];
                    }
                    z['re'] = a['abs'] * Math.cos(a['arg']);
                    z['im'] = a['abs'] * Math.sin(a['arg']);
                } else if ('r' in a && 'phi' in a) {
                    if (!Number.isFinite(a['r']) && Number.isFinite(a['phi'])) {
                        return Complex['INFINITY'];
                    }
                    z['re'] = a['r'] * Math.cos(a['phi']);
                    z['im'] = a['r'] * Math.sin(a['phi']);
                } else if (a.length === 2) { // Quick array check
                    z['re'] = a[0];
                    z['im'] = a[1];
                } else {
                    parser_exit();
                }
                break;

            case 'string':

                z['im'] = /* void */
                    z['re'] = 0;

                var tokens = a.match(/\d+\.?\d*e[+-]?\d+|\d+\.?\d*|\.\d+|./g);
                var plus = 1;
                var minus = 0;

                if (tokens === null) {
                    parser_exit();
                }

                for (var i = 0; i < tokens.length; i++) {

                    var c = tokens[i];

                    if (c === ' ' || c === '\t' || c === '\n') {
                        /* void */
                    } else if (c === '+') {
                        plus++;
                    } else if (c === '-') {
                        minus++;
                    } else if (c === 'i' || c === 'I') {

                        if (plus + minus === 0) {
                            parser_exit();
                        }

                        if (tokens[i + 1] !== ' ' && !isNaN(tokens[i + 1])) {
                            z['im'] += parseFloat((minus % 2 ? '-' : '') + tokens[i + 1]);
                            i++;
                        } else {
                            z['im'] += parseFloat((minus % 2 ? '-' : '') + '1');
                        }
                        plus = minus = 0;

                    } else {

                        if (plus + minus === 0 || isNaN(c)) {
                            parser_exit();
                        }

                        if (tokens[i + 1] === 'i' || tokens[i + 1] === 'I') {
                            z['im'] += parseFloat((minus % 2 ? '-' : '') + c);
                            i++;
                        } else {
                            z['re'] += parseFloat((minus % 2 ? '-' : '') + c);
                        }
                        plus = minus = 0;
                    }
                }

                // Still something on the stack
                if (plus + minus > 0) {
                    parser_exit();
                }
                break;

            case 'number':
                z['im'] = 0;
                z['re'] = a;
                break;

            default:
                parser_exit();
        }

    if (isNaN(z['re']) || isNaN(z['im'])) {
        // If a calculation is NaN, we treat it as NaN and don't throw
        //parser_exit();
    }

    return z;
}

export const stringComplex = function (a, b) {
    var ret = '';

    if (a !== 0) {
        ret += a;
    }

    if (b !== 0) {

        if (a !== 0) {
            ret += b < 0 ? ' - ' : ' + ';
        } else if (b < 0) {
            ret += '-';
        }

        b = Math.abs(b);

        if (1 !== b) {
            ret += b;
        }
        ret += 'i';
    }

    if (!ret)
        return '0';

    return ret;
}

export const initTyped = function ({ meta, rawArray }) {
    const data = meta.complex ? new meta.type(meta.size * 2) : new meta.type(meta.size)

    for (let i = 0; i < data.length; i++) {
        const cn = parseComplex(rawArray[i % rawArray.length])

        data[i] = cn.re

        if (meta.complex) {
            data[i + 1] = cn.im
            i++
        }
    }

    return data
}

export const initRangeTyped = function ({ meta, start, stop, step }) {
    const data = new meta.type(meta.size)

    for (let i = start, j = 0; i < stop; i += step, j++)
        data[j] = i

    return data
}

export const shapeRaw = function (A, shape = []) {
    if (A.constructor === Number || A.constructor === String)
        return shape

    return shapeRaw(A[0], shape.concat(A.length))
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
