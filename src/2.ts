export const location = (movement: string[][]) => {
    let h = 0, d = 0
    movement.forEach(([direction, dis]) => {
        switch (direction) {
            case 'forward':
                h += Number(dis)
                break;
            case 'down':
                d += Number(dis)
                break;
            case 'up':
                d -= Number(dis)
                break;
            default:
                break;
        }
    })
    return d * h
}

export const locationWithAim = (movement: string[][]) => {
    let h = 0, d = 0, a = 0
    movement.forEach(([direction, dis]) => {
        switch (direction) {
            case 'forward':
                h += Number(dis)
                d += a * Number(dis)
                break;
            case 'down':
                a += Number(dis)
                break;
            case 'up':
                a -= Number(dis)
                break;
            default:
                break;
        }
    })
    return d * h
}