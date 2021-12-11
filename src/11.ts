let map: ReturnType<typeof OctopusGrid>

const OctopusGrid = (height: number, weight: number) => {
    const h = height
    const w = weight
    const line = Array(w).fill(0)
    const values = Array(h).fill(null).map(_ => line.slice())

    const set = (y: number, x: number, v: number) => {
        values[y][x] = v
    }

    const add = (y: number, x: number, v: number) => {
        values[y][x] += v
    }

    const get = (y: number, x: number) => {
        const line = values[y] ?? undefined
        const value = line ? line[x] : undefined
        return value
    }

    const neighbors = (y: number, x: number) => {
        return [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]].filter(([dy, dx]) => get(y + dy, x + dx) !== undefined).map(([dy, dx]) => [y + dy, x + dx])
    }

    const show = (step: number = 0) => {
        console.log(`step ${step}`)
        for (let y = 0; y < h; y++) {
            let line = ''
            for (let x = 0; x < w; x++) {
                line += `${values[y][x]}`
            }
            console.log(`${line}`)
        }
        console.log(`----`)
    }

    const isSynched = () => {
        return values.every(row => row.every(d => d === 0))
    }


    return {
        w, h,
        set,
        add,
        get,
        neighbors,
        isSynched,
        show
    }

}

export const setup = (inputs: number[][]) => {
    map = OctopusGrid(inputs.length, inputs[0].length)
    for (let y = 0; y < map.h; y++) {
        for (let x = 0; x < map.w; x++) {
            map.set(y, x, inputs[y][x])
        }
    }
}

const flash = (primed: number[][]) => {
    let alreadyFlashed = new Set<string>()
    let flashes = 0
    while (primed.length > 0) {
        let [y, x] = primed.shift()!
        if (!alreadyFlashed.has(`${[y, x]}`)) {
            alreadyFlashed.add(`${[y, x]}`)
            map.set(y, x, 0)
            flashes += 1
            map.neighbors(y, x).forEach(([j, i]) => {
                !alreadyFlashed.has(`${[j, i]}`) && map.add(j, i, 1)
                map.get(j, i) > 9 && primed.push([j, i])
            })
        }
    }
    return flashes
}

export const getFlashes = () => {
    let total = 0
    for (let i = 1; i <= 100; i++) {
        const primed: number[][] = []
        for (let y = 0; y < map.h; y++) {
            for (let x = 0; x < map.w; x++) {
                map.add(y, x, 1)
                map.get(y, x) > 9 && primed.push([y, x])
            }
        }
        total += flash(primed)
    }
    return total
}

export const getSteps = () => {
    let step = 0
    while (!map.isSynched()) {
        step += 1
        const primed: number[][] = []
        for (let y = 0; y < map.h; y++) {
            for (let x = 0; x < map.w; x++) {
                map.add(y, x, 1)
                map.get(y, x) > 9 && primed.push([y, x])
            }
        }
        flash(primed)

    }
    return step
}