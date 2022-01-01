const datax = [236, 262]
const datay = [-78, -58]
// const datax = [20, 30]
// const datay = [-10, -5]

const start = [0, 0]

const minY = Math.min(...datay)
const maxY = Math.max(...datay)
const minX = Math.min(...datax)
const maxX = Math.max(...datax)

export const probe = (y: number, x: number): number | null => {
    let vx = x, vy = y, px = 0, py = 0, height = minY;
    while (px <= maxX && py >= minY) {
        px += vx
        py += vy
        height = height < py ? py : height
        vx += vx > 0 ? -1 : vx < 0 ? 1 : 0
        vy -= 1
        if (px >= minX && px <= maxX && py >= minY && py <= maxY) { 
            return height
        }
    }
    return null
}

export const getResult = (probe: Function) => {
    let best = 0
    let count = 0
    for (let y = minY; y <= (minY + 1) * -1; y++) {
        for (let x = 1; x <= maxX; x++) {
            const result = probe(y, x)
            if (result !== null) {
                count++
            }
            if (result && result > best) {
                best = result
            }
        }
    }
    return [best, count]
}