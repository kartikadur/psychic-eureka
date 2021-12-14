export const createRules = (inputs: string[]) => {
    const rules: Record<string, string> = {}
    inputs.forEach(line => {
        const [key, val] = line.split(' -> ')
        rules[key] = val
    })
    return rules
}

// const naiveLoop = (input: string, rules: Record<string, string>) => {
//     let newInput = input
//     const freqs: Record<string, number> = {}
//     for (let i = 0; i < newInput.length - 1; i++) {
//         if (newInput.slice(i, i + 2) in rules) {
//             newInput = newInput.slice(0, i + 1) + rules[newInput.slice(i, i + 2)] + newInput.slice(i + 1)
//             i++
//         }
//     }
//     return newInput
// }

export const iterate = (times: number, input: Record<string, number>, rules: Record<string, string>) => {
    let polymer = input
    const loop = (input: Record<string, number>, rules: Record<string, string>) => {
        const freqs: Record<string, number> = {}
        for (let key in input) {
            if (key in rules) {
                // split the previous key and store as two new keys that include the new letter
                const key1 = key.slice(0, 1) + rules[key]
                const key2 = rules[key] + key.slice(1)
                freqs[key1] = freqs[key1] ? freqs[key1] + input[key] : input[key]
                freqs[key2] = freqs[key2] ? freqs[key2] + input[key] : input[key]
            } else {
                // pass keys not in ruleset to account for last letter
                freqs[key] = input[key]
            }
        }
        return freqs
    }
    
    for (let i = 0; i < times; i++) {
        polymer = loop(polymer, rules)
    }
    return polymer
}

export const count = (input: Record<string, number>) => {
    const charCount: Record<string, number> = {}
    Object.keys(input).forEach((k) => {
        charCount[k[0]] = charCount[k[0]] ? charCount[k[0]] + input[k] : input[k]
    })
    return Math.max(...Object.values(charCount)) - Math.min(...Object.values(charCount))
}

export const createPolymer = (input: string) => {
    let polymer: Record<string, number> = {}
    for (let i = 0; i < input.length - 1; i++) {
        polymer[input.slice(i, i + 2)] = polymer[input.slice(i, i + 2)] ? polymer[input.slice(i, i + 2)] + 1 : 1
    }
    // store the last character
    polymer[input.slice(-1)] = 1
    return polymer
}
