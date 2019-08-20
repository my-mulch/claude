
export const makeRouter = function (hash) {
    return new Function('args', `
        const i${0} = this.suite[${hash[0]}] || (this.suite[${hash[0]}] = {})

        ${hash.map(function (field, i) {
            return i ? `const i${i} = i${i - 1}[${field}] || (i${i - 1}[${field}] = {})` : ''
        }).join('\n')}
        
        return i${hash.length - 1}[args.meta.method] || i${hash.length - 1}
    `)
}

export const makeCaller = function (methods) {
    return new Function('args', `
        let func = this.route(args)

        if (func.constructor === Object)
            ${makeMethodChecks(methods)}   

        return func(args)
    `)
}

export const makeMethodChecks = function (methods) {

    return `switch(args.meta.method){
        ${Object.entries(methods).map(function ([label, tiers]) {
            return `case '${label}': ${Object.keys(tiers).map(function (criteria, i) {
                return (!i ? '' : 'else ') + `if(${criteria}){ 
                    func = 
                    func[args.meta.method] = 
                    this.methods['${label}']['${criteria}'](args)
                }`
            }).join('\n')} break`
        }).join('\n')}
    }`
}
