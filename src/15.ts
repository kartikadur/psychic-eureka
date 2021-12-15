export const Grid = (height: number, width: number, cb: (y: number, x: number) => any) => {
    const h = height
    const w = width
    const line = Array(w).fill(Infinity)
    const values: any[][] = Array(h).fill(null).map(_ => line.slice())
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            values[y][x] = cb(y, x)
        }
    }

    const get = (y: number, x: number) => {
        const line = values[y] ?? undefined
        const value = line ? line[x] : undefined
        return value
    }

    const neighbors = (y: number, x: number): number[][] => {
        return [[0, 1], [1, 0], [0, -1], [-1, 0]].filter(([dy, dx]) => get(y + dy, x + dx) !== undefined).map(([dy, dx]) => [y + dy, x + dx])
    }

    const show = () => {
        for (let y = 0; y < h; y++) {
            let line = ''
            for (let x = 0; x < w; x++) {
                line += `${values[y][x].risk}`
            }
            console.log(`${line}`)
        }
        console.log(`----`)
    }

    return {
        w, h,
        get,
        neighbors,
        values,
        show
    }

}

export const findPath = (g: ReturnType<typeof Grid>, start: [number, number], end: [number, number]): number => {
    const map = g
    const s = start
    const e = end

    console.log(end)
    const reducer = (start: [number, number]) => {
        const [y, x] = start
        const visited = new Set()
        const queue = [[y, x, 0]]
        map.values[y][x].riskTo = 0

        while (queue.length > 0) {
            let [cy, cx, cr] = queue.sort((a, b) => a[2] - b[2]).shift()!
            visited.add(`${cy},${cx}`)
            // console.log(cy, cx, values[cy][cx].risk, queue)
            map.neighbors(cy, cx).forEach(([ny, nx]) => {
                const risk = map.values[cy][cx].riskTo + map.values[ny][nx].risk
                // console.log('neighbors', y, x, map.values[ny][nx].riskTo, risk)
                if (!visited.has(`${ny},${nx}`) && risk < map.values[ny][nx].riskTo) {
                    map.values[ny][nx].riskTo = risk
                    queue.push([ny, nx, risk])
                }
            })
        }

    }

    reducer(s)

    return map.values[e[0]][e[1]].riskTo
}