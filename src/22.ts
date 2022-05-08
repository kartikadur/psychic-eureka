type InstructionType = {
    status: number;
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    z1: number;
    z2: number;
}

class Cube {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    z1: number;
    z2: number;
    operation: number;

    constructor(instruction: InstructionType) {
        this.x1 = instruction.x1
        this.x2 = instruction.x2
        this.y1 = instruction.y1
        this.y2 = instruction.y2
        this.z1 = instruction.z1
        this.z2 = instruction.z2
        this.operation = instruction.status
    }

    intersects(cube: Cube) {
        return !(isNoOverlap(this.x1, this.x2, cube.x1, cube.x2)
            || isNoOverlap(this.y1, this.y2, cube.y1, cube.y2)
            || isNoOverlap(this.z1, this.z2, cube.z1, cube.z2))
    }

    overlap(other: Cube) {
        const x1 = Math.max(this.x1, other.x1)
        const x2 = Math.min(this.x2, other.x2)
        const y1 = Math.max(this.y1, other.y1)
        const y2 = Math.min(this.y2, other.y2)
        const z1 = Math.max(this.z1, other.z1)
        const z2 = Math.min(this.z2, other.z2)

        if (x1 > x2 || y1 > y2 || z1 > z2) {
            this.intersects(other)
            console.log('something still smelly', this.intersects(other), this, other)
        }

        // something wrong in this section with the signs?
        let operation
        if (this.operation === other.operation) {
            operation = -this.operation
        } else if (this.operation === 1 && other.operation === -1) {
            operation = -1
        } else {
            operation = 1
        }


        return new Cube({ x1, x2, y1, y2, z1, z2, status: operation })
    }

    volume() {
        return (this.x2 - this.x1 + 1) * (this.y2 - this.y1 + 1) * (this.z2 - this.z1 + 1)
    }

    show() {
        return `${this.operation} : [${this.x1}..${this.x2},${this.y1}..${this.y2},${this.z1}..${this.z2}]`
    }
}

function isNoOverlap(a1: number, a2: number, b1: number, b2: number) {
    return a2 < b1 || b2 < a1
}

export function startRebootSequence(instructions: InstructionType[], small: boolean = true) {

    const engines = new Set<Cube>()
    
    for (const instruction of instructions) {
        if (
            small && (instruction.x1 < -50
            || instruction.x2 > 50
            || instruction.y1 < -50
            || instruction.y2 > 50
            || instruction.z1 < -50
            || instruction.z2 > 50)) {
            continue
        }
        // console.log(instruction)
        const new_cube = new Cube(instruction)
        const new_engines = new Set<Cube>()
        for (const cube of Array.from(engines)) {
            if (cube.intersects(new_cube)) {
                // split cube to all sections not overlapping with new_cube
                const intersect_cube = cube.overlap(new_cube)
                // console.log(cube.show(), new_cube.show(), insterset_cube.show())
                // collect all intersections
                new_engines.add(intersect_cube)
            }
        }
        // add all intersections to the main set
        // console.log(new_engines)
        for (const intersect_cube of Array.from(new_engines)) {
            engines.add(intersect_cube)
        }
        // No Overlap so add new cube
        if (new_cube.operation > 0) {
            engines.add(new_cube)
        }
    }
    
    let total = 0
    for (const cube of Array.from(engines)) {
        total += (cube.volume() * cube.operation)
    }
    return total
}