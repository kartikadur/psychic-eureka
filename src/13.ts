const Grid = (count: number, callback: (x: number) => any) => {
    let points = count
    let locations: number[][] = []
    for (let x = 0; x < count; x++) {
        locations[x] = callback(x)
    }
    let height = Math.max(...locations.map(([_, y]) => y)) + 1
    let width = Math.max(...locations.map(([x, _]) => x)) + 1

    const cleanup = (oldPoints: number[][]): [number[][], number] => {
        const l = new Set()
        const newPoints: number[][] = []
        let count = 0
        for (let i = 0; i < points; i++) {
            const [x, y] = oldPoints[i]
            if (!l.has(`${[x, y]}`)) {
                l.add(`${[x, y]}`)
                newPoints.push([x, y])
                count += 1
            }
        }
        return [newPoints, count]
    }

    const makeFold = (axis: string, foldOn: number) => {
        let newLocations: number[][] = []
        for (let i = 0; i < points; i++) {
            const [x, y] = locations[i]
            if (axis === 'y') {
                newLocations.push((y < foldOn) ? [x, y] : [x, foldOn + foldOn - y])
                height = foldOn
            } else {
                newLocations.push((x < foldOn) ? [x, y] : [foldOn + foldOn - x, y])
                width = foldOn
            }
        }
        const [locs, c] = cleanup(newLocations)
        locations = locs
        points = c
        return c
    }


    const show = () => {
        const line: string[] = Array(width).fill('.')
        const grid: string[][] = Array(height).fill(".").map(_ => line.slice())
        for (let i = 0; i < points; i++) {
            const [x, y] = locations[i]
            grid[y][x] = '#'
        }
        for (let y = 0; y < height; y++) {
            let line = ''
            for (let x = 0; x < width; x++) {
                line += grid[y][x]
            }
            console.log(line)
        }
    }

    return {
        makeFold,
        show
    }

}



export const setupGrid = (data: string[]) => {
    const grid = Grid(data.length, (i) => data[i].split(',').map(p => +p))
    return grid
}