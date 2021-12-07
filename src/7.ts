export const align = (inputs: number[]) => {
    const counts: { [key: string]: number } = {}
    const min = Math.min(...inputs)
    const max = Math.max(...inputs)
    inputs.forEach(i => {
        counts[i] = counts[i] ? counts[i] + 1 : 1
    })

    let minFuel = Number.POSITIVE_INFINITY
    // let num = undefined
    for (let s = min; s <= max; s++) {
        let fuel = 0
        Object.keys(counts).forEach(k => {
            fuel += Math.abs(s - +k) * counts[k]
        })
        if (fuel < minFuel) {
            // num = s
            minFuel = fuel
        }
    }
    return minFuel
}

const sum = (n: number): number => n ? n + sum(n - 1) : 0

export const alignSum = (inputs: number[]) => {
    const counts: { [key: string]: number } = {}
    const min = Math.min(...inputs)
    const max = Math.max(...inputs)
    inputs.forEach(i => {
        counts[i] = counts[i] ? counts[i] + 1 : 1
    })

    let minFuel = Number.POSITIVE_INFINITY
    for (let s = min; s <= max; s++) {
        let fuel = 0
        Object.keys(counts).forEach(k => {
            fuel += sum(Math.abs(s - +k)) * counts[k]
        })
        if (fuel < minFuel) {
            minFuel = fuel
        }
    }
    return minFuel
}