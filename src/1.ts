export const larger = (data: number[]) => {
    return data.reduce((p, c, i, a) => i ? c > a[i - 1] ? p + 1 : p : 0, 0)
}

export const largerWithWindow = (data: number[], window = 3) => {
    return data.reduce((p, c, i, a) => i >= window ? c > a[i - window] ? p + 1 : p : 0, 0)
}