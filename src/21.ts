const diceMap: { [key: number]: number } = {
    3: 1,
    4: 3,
    5: 6,
    6: 7,
    7: 6,
    8: 3,
    9: 1
}

type playerType = {
    score: number,
    pos: number
}

export const part1 = () => {
    let player = [7, 4]
    let playerScore = [0, 0]
    let turn = 0
    let dice = 1

    const getPosition = (value: number, dice: number) => {
        return (value + (3 * dice + 3)) % 10 !== 0 ? (value + (3 * dice + 3)) % 10 : 10
    }

    while (true) {
        player[turn % 2] = getPosition(player[turn % 2], dice)
        playerScore[turn % 2] += player[turn % 2]
        if (playerScore[0] >= 1000 || playerScore[1] >= 1000) {
            break
        }
        dice += 3
        turn += 1
    }
    return (dice + 2) * Math.min(...playerScore)
}
// could be improved by storing in map?
export const part2 = (p1: playerType, p2: playerType, turn: number = 1): number => {
    const current = turn ? p1 : p2

    if (p1.score >= 21) return 1
    if (p2.score >= 21) return 0

    let sum = 0
    for (const outcome in diceMap) {
        const oldPos = current.pos
        const oldScore = current.score

        current.pos = ((current.pos + Number(outcome) - 1) % 10) + 1
        current.score += current.pos

        sum += diceMap[outcome] * part2(p1, p2, 1 - turn)

        current.pos = oldPos
        current.score = oldScore
    }

    return sum
}