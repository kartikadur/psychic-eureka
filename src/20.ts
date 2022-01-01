const Grid = (height: number, width: number, cb: (y: number, x: number) => any) => {
    let h = height
    let w = width
    const line = Array(w).fill(0)
    let values: any[][] = Array(h).fill(null).map(_ => line.slice())
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

    const getValues = () => values

    const eachElement = (cb: (y: number, x: number) => number) => {
        let newVals = []
        for (let j = -1; j < h + 1; j++) {
            let newLine = []
            for (let i = -1; i < w + 1; i++) {
                newLine.push(cb(j, i))
            }
            newVals.push(newLine)
        }
        h = h + 2
        w = w + 2
        values = newVals
    }

    const neighbors = (y: number, x: number): number[][] => {
        return [[-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 0], [0, 1],
        [1, -1], [1, 0], [1, 1]].map(([dy, dx]) => [y + dy, x + dx])
    }

    const show = () => {
        for (let y = 0; y < h; y++) {
            let line = ''
            for (let x = 0; x < w; x++) {
                line += values[y][x] === 1 ? '#' : '.'
            }
            console.log(`${line}`)
        }
        console.log(`----`)
    }

    return {
        w, h,
        get,
        neighbors,
        eachElement,
        getValues,
        show
    }

}


export const renderImage = (data01: string, data02: string, times: number) => {
    const inputImage = data02.split(/\n/)
    const imgAlgo = data01.split('').map(pixel => pixel === '#' ? 1 : 0)
    const height = inputImage.length
    const width = height
    const image = Grid(height, width, (y, x) => inputImage[y][x] === '#' ? 1 : 0)
    for (let t = 0; t < times; t++) {
        image.eachElement((y, x) => {
            let pixels = image.neighbors(y, x).map(([y, x]) => image.get(y, x) ?? imgAlgo[0] & t % 2)
            let pixel = parseInt(pixels.join(''), 2)
            return imgAlgo[pixel]
        })
    }
    return image.getValues().flat().reduce((p,c)=> p + c)
}