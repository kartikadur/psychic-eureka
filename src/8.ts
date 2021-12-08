export const countDigits = (inputs: string[]) => {
    let total = 0
    inputs.forEach(i => {
        const s = i[1].split(' ')
        s.forEach(d => {
            if (d.length === 2 || d.length === 3 || d.length === 4 || d.length === 7) {
                total++
            }
        })
    })
    return total
}

const hasSubset = (stack: string, needle: string) => {
    return needle.split('').every(d => stack.includes(d))
}

export const getDigits = (inputs: string[]) => {
    let total = 0
    inputs.forEach(i => {
        const numbers = Array(4)
        const encoded = i[0].split(' ').sort((a, b) => a.length > b.length ? 1 : b.length > a.length ? - 1 : 0)
        // 1, 4, 7, 8
        const decoded = { [encoded[0]]: 1, [encoded[1]]: 7, [encoded[2]]: 4, [encoded[9]]: 8 }

        let partial5 = encoded[2]
        partial5 = partial5.split('').filter(d => !encoded[0].includes(d)).join('')

        // 2, 3, 5
        for (let x = 3; x < 6; x++) {
            if (hasSubset(encoded[x], encoded[0])) {
                decoded[encoded[x]] = 3
            } else if (hasSubset(encoded[x], partial5)) {
                decoded[encoded[x]] = 5
            } else {
                decoded[encoded[x]] = 2
            }
        }
        // 0, 6, 9 
        for (let x = 6; x < 9; x++) {
            if (hasSubset(encoded[x], encoded[2])) {
                decoded[encoded[x]] = 9
            } else if (hasSubset(encoded[x], encoded[0])) {
                decoded[encoded[x]] = 0
            } else {
                decoded[encoded[x]] = 6
            }

        }
        // console.log(decoded)
        i[1].split(' ').forEach((d, y) => {
            for (let m in decoded) {
                if (m.length === d.length && m.split('').every(x => d.includes(x))) {
                    numbers[y] = decoded[m]
                }
            }
        })
        total += +numbers.join('')
    })
    return total
}