export const timer = (inputs: number[]) => {
    let days = 0
    let st = [...inputs]
    while (days < 80) {
        days++
        let l = st.length
        for (let i = 0; i < l; i++) {
            st[i]--
            if (st[i] === -1) {
                st[i] = 6
                st.push(8)
            }
        }
        // console.log(st)
    }
    console.log(st.length)
}

export const largeTimer = (inputs: number[]) => {
    let days = 0
    const st = Array(9).fill(0)
    inputs.forEach(i => st[i] = st[i] ? st[i] + 1 : 1)
    // console.log(st)
    while (days < 256) {
        days++
        st[7] += st[0]
        st.push(st.shift())
        // console.log(days, st, st.reduce((p, c) => p + c, 0))
    }
    
    console.log(st.reduce((p, c) => p + c, 0))
}