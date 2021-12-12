const Cave = (length: number, cb: (x: number) => any) => {
    // console.log('init Cave network')
    const connections: { [key: string]: { from: string, to: string[], canReturn: boolean } } = {}
    let start = ''
    let end = ''
    for (let i = 0; i < length; i++) {
        let { from, to } = cb(i)
        if (from in connections) {
            connections[from].to.push(to)
        } else {
            connections[from] = createConnection(from, [to])
        }
        if (to in connections) {
            connections[to].to.push(from)
        } else {
            connections[to] = createConnection(to, [from])
        }

    }

    function createConnection(from: string, to: string[]) {
        return {
            from,
            to,
            canReturn: from.toUpperCase() === from
        }
    }


    /**
     * 
     * @param start start node
     * @param end end node
     * @param canDoubleVisit whether one of the smaller nodes can be revisited
     * @returns count of all allowed paths
     */

    const findAllConnections = (start: string, end: string, allowDoubles: boolean = false): number => {
        const s = start
        const e = end

        const reducer = (start: string, canDoubleVisit: boolean, previous: { [key: string]: boolean } = {}): number => {
            if (start === e) {
                // console.log(visited, canDoubleVisit, allowDouble)
                return 1
            }
            const visited = { ...previous }
            if (!(start in visited)) { visited[start] = true }
            const nextNodes = [...connections[start].to]
            let pathCount = 0
            for (let next of nextNodes) {
                if (connections[next].canReturn || !visited[next] || canDoubleVisit && !(next === s || next === e)) {
                    const allowDoubleOn = !connections[next].canReturn && visited[next] ? false : canDoubleVisit
                    pathCount += reducer(next, allowDoubleOn, visited)
                }
            }
            return pathCount
        }

        return reducer(s, allowDoubles)
    }

    const show = () => {
        console.log(connections)
    }

    return {
        findAllConnections,
        show,
    }
}



export const setupNetwork = (inputs: string[]) => {
    // console.log('init')
    const c = Cave(inputs.length, (x) => {
        const [from, to] = inputs[x].split('-')
        return {
            from,
            to,
        }
    })

    return c
}
