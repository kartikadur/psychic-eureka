const getBitCounts = (inputs: string[]) => {
    let c1: number[] = Array(inputs[0].length).fill(0),
        c0: number[] = Array(inputs[0].length).fill(0)
    inputs.forEach(n => {
        n.split('').forEach((d, i) => { d === '1' ? c1[i]++ : c0[i]++ })
    })
    return [c1, c0]
}
export const power = (inputs: string[]) => {
    let gamma = 0,
        epsilon = 0
    const [c1, c0] = getBitCounts(inputs)
    c1.forEach((c, i) => {
        if (c > c0[i]) {
            gamma |= 1 << (c1.length - i - 1)
        } else {
            epsilon |= 1 << (c1.length - i - 1)
        }
    });
    return gamma * epsilon
}

const getBitCountsV2 = (inputs: string[]) => {
    let sum = Array(inputs[0].length).fill(0)
    inputs.forEach(n => n.split('').forEach((c, i) => sum[i] += +c))
    return sum
}

export const power2 = (inputs: string[]) => {
    let gamma = 0,
        epsilon = 0
    const arrayOfSums = getBitCountsV2(inputs)
    const total = inputs.length
    const chars = inputs[0].length
    arrayOfSums.forEach((sum, i) => {
        if (sum >= total - sum) {
            gamma |= 1 << (chars - i - 1)
        } else {
            epsilon |= 1 << (chars - i - 1)
        }
    });
    return gamma * epsilon
}

const getCountAtPosition = (inputs: string[], i: number) => {
    let c1 = 0,
        c0 = 0
    inputs.forEach(n => n[i] === '1' ? c1++ : c0++)
    return [c1, c0]
}

const filter = (inputs: string[], i: number, bit: '1' | '0', dbg = false) => {
    dbg && console.log(inputs, inputs.map(n => n[i]))
    return inputs.filter(n => n[i] === bit)
}

export const breathableAir = (inputs: string[]) => {
    let o2 = [...inputs]
    let co2 = [...inputs]
    let pos = 0
    while (o2.length > 1) {
        const [c1, c0] = getCountAtPosition(o2, pos)
        const check = c1 >= c0 ? '1' : '0'
        o2 = filter(o2, pos, check)
        pos++
    }
    o2 = filter(o2, inputs[0].length - 1, '1')
    pos = 0
    while (co2.length > 1) {
        const [c1, c0] = getCountAtPosition(co2, pos)
        const check = c1 >= c0 ? '0' : '1'
        co2 = filter(co2, pos, check)
        pos++
    }
    co2 = filter(co2, inputs[0].length - 1, '0')
    
    return (parseInt(o2[0], 2) * parseInt(co2[0], 2))
}