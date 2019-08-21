
export default function () {
    return new Function('args', [
        `for (let r = 0; 
            r < args.of.shape[0]; 
            r++)`,

        `for (let c = 0; 
            c < args.with.shape[1]; 
            c++)`,

        `for (let s = 0; 
            s < args.of.shape[1]; 
            s++) {`,

        `}`,

        `return args.result`

    ].join('\n'))
}
