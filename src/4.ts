const boards: any[] = []

export const createCalls = (inputs: string[]): string[] => {
    return inputs[0].split(',')
}

export const createBoards = (inputs: string[]) => {
    for (let r = 2; r < inputs.length; r += 6) {
        let b = BoardFactory()
        b.addRows(inputs.slice(r, r + 5))
        boards.push(b)
    }
    return boards
}

export const playBingo = (calls: string[], boards: ReturnType<typeof BoardFactory>[]) => {
    let hasWon = false
    for (let i = 0; i < calls.length; i++) {
        let c = calls[i]
        for (let j = 0; j < boards.length; j++) {
            let b = boards[j]
            if (!b.checkHasWon()) {
                hasWon = false
                hasWon = b.checkValue(c)
                if (hasWon) {
                    console.log(b.checkHasWon(), b.getUncheckedTotal(), c, b.getUncheckedTotal() * +c)
                }
            }
        }
        if (boards.every(b => b.checkHasWon())) break
    }
}

const BoardFactory = () => {
    let grid: { [key: string]: [number, number, boolean] } = {}
    const rowBingo = Array(5).fill(5)
    const colBingo = Array(5).fill(5)
    let hasWon = false

    const addRows = (inputs: string[]) => {
        inputs.forEach((r, i) => {
            r.trim().split(/\s+/).forEach((n, j) => {
                grid = { ...grid, ...{ [n]: [i, j, false] } }
            })
        })
    }

    const checkValue = (input: string) => {
        if (input in grid) {
            grid[input][2] = true
            let [r, c, bool] = grid[input]
            rowBingo[r]--
            if (rowBingo[r] === 0) {
                // do something
                hasWon = true
                return true
            }
            colBingo[c]--
            if (colBingo[c] === 0) {
                // do something
                hasWon = true
                return true
            }
        }
        return false
    }

    const getUncheckedTotal = () => {
        let runningTotal = 0
        for (let val in grid) {
            if (!grid[val][2]) {
                runningTotal += +val
            }
        }
        return runningTotal
    }

    const checkHasWon = () => {
        return hasWon
    }

    const getGrid = () => {
        return grid
    }

    return {
        addRows,
        getGrid,
        checkValue,
        checkHasWon,
        getUncheckedTotal,
    }

}