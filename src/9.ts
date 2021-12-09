const lowPoints: number[][] = []
let map: ReturnType<typeof HeightMap>


const HeightMap = (width: number, height: number) => {
    const w = width
    const h = height
    const line = Array(w).fill(0)
    const values = Array(h).fill(null).map(_ => line.slice())

    const add = (y: number, x: number, v: number) => {
        values[y][x] = v
    }

    const get = (y: number, x: number) => {
        const line = values[y] ?? undefined
        const value = line ? line[x] : undefined
        return value
    }

    const neighbors = (y: number, x: number) => {
        return [[-1, 0], [1, 0], [0, -1], [0, 1]].filter(([dy, dx]) => get(y + dy, x + dx) !== undefined).map(([dy, dx]) => [y + dy, x + dx])
    }

    const show = () => {
        console.log(values)
    }

    return {
        h,
        w,
        add,
        get,
        neighbors,
        show
    }
}

export const setupMap = (inputs: number[][]) => {
    const width = inputs[0].length
    const height = inputs.length
    map = HeightMap(width, height)
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            map.add(y, x, inputs[y][x])
        }
    }
}

export const valleys = () => {
    let sum = 0
    for (let y = 0; y < map.h; y++)
        for (let x = 0; x < map.w; x++) {
            const val = map.get(y, x)
            if (map.neighbors(y, x).every(([y, x]) => val < map.get(y, x))) {
                sum += val + 1
                lowPoints.push([y, x])
            }
        }
    return sum
}

export const basins = () => {
    const stack: number[][] = []
    const checked = new Set()
    const countList: number[] = []
    for (let i = 0; i < lowPoints.length; i++) {
        let count = 0
        let start = lowPoints[i]
        stack.push(start)
        while (stack.length > 0) {
            let p = stack.shift()!
            if (!checked.has(p.toString())) {
                checked.add(p.toString())
                let newPoints = map.neighbors(p[0], p[1]).filter(([y, x]) => map.get(y, x) < 9 && map.get(y, x) > map.get(p[0], p[1]))
                stack.push(...newPoints)
                count++
            }
        }
        countList.push(count)
    }
    countList.sort((a, b) => a - b)

    return countList.slice(-3).reduce((p, c) => p *c, 1)
}