export function simulateCucumberHerd(rawList: string[][]) {
    
    // console.log(rawList)
    const height = rawList.length
    const width = rawList[0].length
    
    //facing 0 = east, 1 = south
    const CucumberHerd: Set<string>[] = [new Set(), new Set()]
    
    const nextPosition = (east: boolean, length: number) => (row: number, col: number) => {
        if (east) {
            return [row, (col + 1) % length]
        } else {
            return [(row + 1) % length, col]
        }
    }
    
    const nextPositionEast = nextPosition(true, width)
    const nextPositionSouth = nextPosition(false, height)
    
    rawList.forEach((row, i) => {
        row.forEach((cell, j) => {
            if (cell !== '.') {
                const direction = +(cell === 'v')
                CucumberHerd[direction].add(`${i},${j}`)
            }
        })
    })
    
    const show = (height: number, width: number) => (input: Set<string>[]) => {
        for (let i = 0; i < height; i++) {
            let row = ''
            for (let j = 0; j < width; j++) {
                if (input[0].has(`${i},${j}`)) {
                    row += '>'
                } else if(input[1].has(`${i},${j}`)) {
                    row += 'v'
                } else {
                    row += '.'
                }
            }
            console.log(row)
        }
    }
    
    const showWithDim = show(height, width)
    // showWithDim(CucumberHerd)
    
    //first move is always possible
    let changed = true
    let step = 0
    while (changed) {
        changed = false
        CucumberHerd.forEach((directedHerd, dir) => {
            const nextPos = dir ? nextPositionSouth : nextPositionEast
            const newDirectedHerd = new Set<string>()
            directedHerd.forEach(value => {
                const [r, c] = value.split(',').map(v => +v)
                const [y, x] = nextPos(r, c)
                if (CucumberHerd.some(herd => herd.has(`${y},${x}`))) {
                    newDirectedHerd.add(value)
                } else {
                    newDirectedHerd.add(`${y},${x}`)
                    changed = true
                }
            })
            CucumberHerd[dir] = newDirectedHerd
        })
        step++
        // console.log(`Step ${step}`)
        // showWithDim(CucumberHerd)
        // break
    }
    
    return step
}


// const createUI = (height: number, width: number) => (input: Set<number>) => {
    
// }

// const showWithDim = show(rawList.length, rawList[0].length)

// let moves = 0
// let list = [...cList]
// list.forEach((c) => {
//     const [x, y] = c.east ? nextPositionEast(c.pos[0], c.pos[1]) : nextPositionSouth(c.pos[0], c.pos[1])
//     const occupied = list.filter(p => p.pos[0] === x && p.pos[1] === y)
//     c.canMove = occupied.length <= 0
// })
// // showWithDim(list)
// while (list.some(c => c.canMove)) {

//     // const canMove = list.filter(c => c.canMove && c.east)
//     let canMoveEast = list.filter(c => c.canMove && c.east)
//     let wontMove = list.filter(c => !c.canMove || !c.east)

//     // East
//     // move cucumbers east
//     canMoveEast.forEach(c => {
//         const [x, y] = nextPositionEast(c.pos[0], c.pos[1])
//         c.pos = [x, y]
//     })
//     list = [...canMoveEast, ...wontMove]
//     list.forEach((c) => {
//         const [x, y] = c.east ? nextPositionEast(c.pos[0], c.pos[1]) : nextPositionSouth(c.pos[0], c.pos[1])
//         const occupied = list.filter(p => p.pos[0] === x && p.pos[1] === y)
//         c.canMove = occupied.length <= 0
//     })

//     // South
//     let canMoveSouth = list.filter(c => c.canMove && c.south)
//     wontMove = list.filter(c => !c.canMove || !c.south)
//     // move cucumbers south
//     canMoveSouth.forEach(c => {
//         const [x, y] = nextPositionSouth(c.pos[0], c.pos[1])
//         c.pos = [x, y]
//     })
//     list = [...canMoveSouth, ...wontMove]
//     // console.log(list.length)
//     list.forEach((c) => {
//         const [x, y] = c.east ? nextPositionEast(c.pos[0], c.pos[1]) : nextPositionSouth(c.pos[0], c.pos[1])
//         const occupied = list.filter(p => p.pos[0] === x && p.pos[1] === y)
//         c.canMove = occupied.length <= 0
//     })
//     moves++
//     console.log(moves);
//     // showWithDim(list)
//     // if (moves === 2) break
//     // console.log(list);
//     // check cucumbers can move south
// }



