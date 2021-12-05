let grid: number[][] = []
const dbg = false

export const createGrid = (x: number, y: number) => {
    grid = new Array(y)
    for (let i = 0; i < y; i++) {
        grid[i] = new Array(x).fill(0)
    }
    dbg && console.log(grid)
    return grid
}

export const addVents = (inputs: string[], withDiags = false) => {
    for (let i = 0; i < inputs.length; i++) {
        let [start, end] = inputs[i].split(' -> ')
        let [x1, y1] = start.split(',')
        let [x2, y2] = end.split(',')
        dbg && console.log(start, end)
        if (x1 === x2 || y1 === y2) {
            addVentToGrid(+x1, +y1, +x2, +y2)
        } else {
            if (withDiags) {
                addDiagonalVentToGrid(+x1, +y1, +x2, +y2)
            }
        }

    }
    dbg && print(grid.length, grid[0].length)
}

export const addVentToGrid = (x1: number, y1: number, x2: number, y2: number) => {
    let [startx, endx] = x1 < x2 ? [x1, x2] : [x2, x1]
    let [starty, endy] = y1 < y2 ? [y1, y2] : [y2, y1]
    for (let j = starty; j <= endy; j++) {
        for (let i = startx; i <= endx; i++) {
            dbg && console.log(i, j)
            grid[j][i]++
        }
    }
}

export const addDiagonalVentToGrid = (x1: number, y1: number, x2: number, y2: number, cross = false) => {
    const addx = x1 <= x2 ? 1 : -1
    const addy = y1 <= y2 ? 1 : -1
    let [j, j2] = y1 <= y2 ? [y1, y2] : [y2, y1]
    if (addx === addy) {
        // positive diagonals
        let [i, i2] = x1 <= x2 ? [x1, x2] : [x2, x1]
        while (i <= i2 && j <= j2) {
            dbg && console.log(i, j)
            grid[j][i]++
            i++
            j++
        }
    } else {
        // transverse diagonals
        let [i, i2] = x1 >= x2 ? [x1, x2] : [x2, x1]
        while (i >= i2 && j <= j2) {
            dbg && console.log(i, j)
            grid[j][i]++
            i--
            j++
        }


    }
}

export const checkGrid = (x: number, y: number) => {
    let runningCount = 0
    for (let j = 0; j < y; j++) {
        for (let i = 0; i < x; i++) {
            if (grid[j][i] >= 2) runningCount++
        }
    }
    dbg && print(grid.length, grid[0].length)
    return runningCount
}

const print = (x: number, y: number) => {
    for (let j = 0; j < y; j++) {
        let string = ''
        for (let i = 0; i < x; i++) {
            string += grid[j][i] ? grid[j][i] : "."
        }
        console.log(string)
    }
}