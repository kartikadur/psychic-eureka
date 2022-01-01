class SFNode {
    parent: SFNode | null
    value: number | null
    public left: SFNode | null
    right: SFNode | null

    constructor(valueOrLeft: SFNode | number, right?: SFNode) {
        this.parent = null
        if (right) {
            this.value = null
            this.left = valueOrLeft as SFNode
            this.right = right
            this.left.parent = this
            this.right.parent = this
        } else {
            this.value = valueOrLeft as number
            this.left = null
            this.right = null
        }
    }
}


export const fromArray = (data: number[]) =>{
    function createNode(left: number[] | number, right: number[] | number): SFNode {
        let leftNode = Array.isArray(left) ? createNode(left[0], left[1]) : new SFNode(left)
        let rightNode = Array.isArray(right) ? createNode(right[0], right[1]) : new SFNode(right)
        let node = new SFNode(leftNode, rightNode)
        leftNode.parent = node
        rightNode.parent = node
        return node
    }

    const [left, right] = data
    return createNode(left, right)
}

function toArray(node: SFNode): string {
    if (!node) return 'EMPTY'
    if (node.value !== null) {
        return node.value.toString()
    }
    const l = toArray(node.left as SFNode)
    const r = toArray(node.right as SFNode)
    return `[${l}, ${r}]`
}

function magnitude(node: SFNode): number {
    if (node.value !== null) {
        return node.value
    }
    return 3 * magnitude(node.left!) + 2 * magnitude(node.right!)
}

function add(node: SFNode, other: SFNode) {
    let newNode = new SFNode(node, other)
    return newNode
}

function getNodeToLeftOf(start: SFNode) {
    let node = start
    while (node.parent && node.parent.left === node) {
        node = node.parent
        // log('left parent', toArray(node))
    }
    if (!node.parent) return null
    node = node.parent.left!
    // log('left parent before descent', toArray(node))
    while (node.right) {
        node = node.right
    }
    // log('correct left node', toArray(node))
    return node
}
function getNodeToRightOf(start: SFNode) {
    let node = start
    while (node.parent && node.parent.right === node) {
        node = node.parent
        // log('right parent', toArray(node))
    }
    if (node.parent === null) return null
    node = node.parent.right!
    // log('right parent before descent', toArray(node))
    while (node.left) {
        node = node.left
    }
    // log('correct right node', toArray(node))
    return node
}

// should never come here on a leaf node?
function explode(node: SFNode) {
    const { left, right } = node

    const nodeToLeftOfNode = getNodeToLeftOf(left as SFNode)
    // log('node to left', left?.value, nodeToLeftOfNode?.value)
    if (nodeToLeftOfNode !== null) {
        nodeToLeftOfNode.value! += left?.value!
    }
    const nodeToRightOfNode = getNodeToRightOf(right as SFNode)
    // log('node to right', right?.value, nodeToRightOfNode?.value)
    if (nodeToRightOfNode !== null) {
        nodeToRightOfNode.value! += right?.value!
    }

    // will be at depth 4+
    node.value = 0
    node.left = null
    node.right = null
}

function split(node: SFNode) {
    const [leftVal, rightVal] = [Math.floor(node!.value! / 2), Math.ceil(node!.value! / 2)]
    const [leftNode, rightNode] = [new SFNode(leftVal), new SFNode(rightVal)]
    node.value = null
    node.left = leftNode
    node.right = rightNode
    leftNode.parent = node
    rightNode.parent = node
}

function reduce(node: SFNode) {
    function handler(node: SFNode, depth: number = 1, shouldExplode: boolean) {
        if (depth >= 4 && node.value === null && shouldExplode) {
            // log('is explode', toArray(node))
            explode(node)
            return true
        }

        if (node.value !== null && node.value >= 10 && !shouldExplode) {
            split(node)
            return true
        }


        if (node.value === null) {
            if (handler(node.left!, depth + 1, shouldExplode)) { return true }
            if (handler(node.right!, depth + 1, shouldExplode)) { return true }
        }
        return false
    }

    // log('explode left')
    if (handler(node.left!, 1, true)) { return true }
    // log('explode right')
    if (handler(node.right!, 1, true)) { return true }
    // log('split left')
    if (handler(node.left!, 1, false)) { return true }
    // log('split right')
    if (handler(node.right!, 1, false)) { return true }

    return false
}

export const getMagnitude = (data: SFNode[]) => {
    const result = data.reduce((p, c) => {
        const tree = add(p, c)
        while (reduce(tree)) { }
        // log(toArray(tree))
        return tree
    })

    return magnitude(result)
}

export const getLargest = (lines: string[]) => {
    let max = Number.MIN_SAFE_INTEGER;
    let tuples = []
    for (let i = 0; i < lines.length; i++) {
        for (let j = i + 1; j < lines.length; j++) {
            tuples.push([lines[i], lines[j]])
        }
    }

    for (const pair of tuples) {
        const s1 = add(fromArray(JSON.parse(pair[0])), fromArray(JSON.parse(pair[1])))
        const s2 = add(fromArray(JSON.parse(pair[1])), fromArray(JSON.parse(pair[0])))
        while (reduce(s1)) { }
        while (reduce(s2)) { }
        const r1 = magnitude(s1)
        const r2 = magnitude(s2)
        max = Math.max(r1, r2, max)
    }
    return max
}