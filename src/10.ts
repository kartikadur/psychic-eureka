const elList: { [key: string]: string } = {
    '{': '}', '[': ']', '(': ')', '<': '>'
}

const errList: { [key: string]: number } = {
    '}': 1197, ']': 57, ')': 3, '>': 25137
}

const compList: { [key: string]: number } = {
    '{': 3, '[': 2, '(': 1, '<': 4
}

const nonCorrupt: string[] = []


export const part01 = (inputs: string[]) => {
    let totalErr = 0
    for (let i = 0; i < inputs.length; i++) {
        const line = inputs[i];
        let stack = []
        for (let j = 0; j < line.length; j++) {
            const element = line[j];
            if (Object.keys(elList).includes(element)) {
                stack.push(element)
            } else {
                if (stack.length > 0 && elList[stack[stack.length - 1]] === element) {
                    stack.pop()
                } else {
                    totalErr += errList[element]
                    stack = []
                    break
                }
            }
        }
        if (stack.length > 0) {
            nonCorrupt.push(stack.join(''))
        }
    }
    return [totalErr, nonCorrupt]
}

export const part02 = (inputs: string[]) => {
    let total = []
    for (let i = 0; i < inputs.length; i++){
        const line = inputs[i].split('')
        let currTotal = line.reduceRight((p, c) => p * 5 + compList[c], 0)
        total.push(currTotal)
    }
    total.sort((a, b) => a - b)
    return total[total.length >> 1]
}