
export const __split__ = function (o1 = [], o2 = []) {
    return [
        // First and second half of A
        o1.slice(0, o1.length / 2),
        o1.slice(o1.length / 2),

        // First and second half of B
        o2.slice(0, o2.length / 2),
        o2.slice(o2.length / 2),
    ]
}
