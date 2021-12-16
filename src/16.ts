// const data01 = `C200B40A82`
// const data02 = `04005AC33890`
// const data03 = `880086C3E88112`
// const data04 = `CE00C43D881120`
// const data05 = `D8005AC2A8F0`
// const data06 = `F600BC2D8F`
// const data07 = `9C005AC2F8F0`
// const data08 = `9C0141080250320F1802104A08`

let position = 0

export const hextobin = (input: string) => input.split('').map(i => parseInt(i, 16).toString(2).padStart(4, '0')).join('')
const bintodec = (input: string) => +parseInt(input, 2).toString(10)
const hextodec = (input: string) => +parseInt(input, 16).toString(10)
const bintohex = (input: string) => {
    position += 5
    return parseInt(input, 2).toString(16)
}

// only send concerned bits
const getVersion = (input: string) => parseInt(input, 2)
const getType = (input: string) => parseInt(input, 2)
const getValues = (input: string): number => {
    let literal = '',
        shouldRead = true
    while (shouldRead) {
        shouldRead = !!+input[position]
        literal += bintohex(input.slice(position + 1, position + 5))
    }
    return hextodec(literal)
}

const getOperatorValues = (input: string): number[] => {
    const values = []
    if (input[position] === '1') {
        // next 11 bits is count of subpackets
        const count = bintodec(input.slice(position + 1, position + 12))
        position += 12
        for (let i = 0; i < count; i++) {
            values.push(evaluate(input)!)
        }
    } else {
        // next 15 bits is length of literals
        const length = bintodec(input.slice(position + 1, position + 16))
        position += 16
        const until = position + length
        while (position < until) {
            values.push(evaluate(input)!)
        }

    }
    return values
}


const parseOperatorOrValues = (input: string, type: number) => {
    if (type === 4) return getValues(input)
    const values = getOperatorValues(input)
    switch (type) {
        case 0:
            return values.reduce((p, c) => p + c)
        case 1:
            return values.reduce((p, c) => p * c)
        case 2:
            return Math.min(...values)
        case 3:
            return Math.max(...values)
        case 5:
            return values[0] > values[1] ? 1 : 0
        case 6:
            return values[0] < values[1] ? 1 : 0
        case 7:
            return values[0] === values[1] ? 1 : 0
        default:
            throw new Error(`Invalid type: ${type}`)
    }
}

export const evaluate = (input: string) => {
    const v = getVersion(input.slice(position, position + 3))
    const type = getType(input.slice(position + 3, position + 6))
    position += 6
    return parseOperatorOrValues(input, type)

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