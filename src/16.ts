export const hextobin = (input: string) => input.split('').map(i => parseInt(i, 16).toString(2).padStart(4, '0')).join('')
const bintodec = (input: string) => +parseInt(input, 2).toString(10)
const hextodec = (input: string) => +parseInt(input, 16).toString(10)
const bintohex = (input: string) => parseInt(input, 2).toString(16)

// only send concerned bits
const getVersion = (input: string) => parseInt(input, 2)
const getType = (input: string) => parseInt(input, 2)

const getValues = (input: string, pos: number): [number, number] => {
    let literal = '',
        shouldRead = true
    while (shouldRead) {
        shouldRead = !!+input[pos]
        literal += bintohex(input.slice(pos + 1, pos + 5))
        pos += 5
    }
    return [hextodec(literal), pos]
}

const getOperatorValues = (input: string, pos: number): [number[], number] => {
    const values = []
    if (input[pos] === '1') {
        // next 11 bits is count of subpackets
        const count = bintodec(input.slice(pos + 1, pos + 12))
        let newPos = pos + 12
        let val = null
        for (let i = 0; i < count; i++) {
            [val, newPos] = evaluate(input, newPos)
            values.push(val)
        }
        pos = newPos
    } else {
        // next 15 bits is length of literals
        const length = bintodec(input.slice(pos + 1, pos + 16))
        let newPos = pos + 16
        const until = newPos + length
        let val = null
        while (newPos < until) {
            [val, newPos] = evaluate(input, newPos)
            values.push(val)
        }
        pos = newPos

    }
    return [values, pos]
}


const parseOperatorOrValues = (input: string, type: number, pos: number): [number, number] => {
    if (type === 4) return getValues(input, pos)
    const [values, newPos] = getOperatorValues(input, pos)
    switch (type) {
        case 0:
            return [values.reduce((p, c) => p + c), newPos]
        case 1:
            return [values.reduce((p, c) => p * c), newPos]
        case 2:
            return [Math.min(...values), newPos]
        case 3:
            return [Math.max(...values), newPos]
        case 5:
            return [values[0] > values[1] ? 1 : 0, newPos]
        case 6:
            return [values[0] < values[1] ? 1 : 0, newPos]
        case 7:
            return [values[0] === values[1] ? 1 : 0, newPos]
        default:
            throw new Error(`Invalid type: ${type}`)
    }
}

export const evaluate = (input: string, pos: number = 0): [number, number] => {
    const v = getVersion(input.slice(pos, pos + 3))
    const type = getType(input.slice(pos + 3, pos + 6))
    return parseOperatorOrValues(input, type, pos + 6)

}

export const parse = (input: string) => {
    let version_total = 0;
    let i = 0
    let stack = []
    while (i < input.length && !(input.length - i < 12)) {
        version_total += getVersion(input.slice(i, i + 3))
        const type = getType(input.slice(i + 3, i + 6))
        if (type === 4) {
            i += 6
            while (input[i] !== '0') {
                i += 5
            }
            i += 5
        } else {
            i += +input[i + 6] ? 18 : 22
        }
    }
    return version_total
}