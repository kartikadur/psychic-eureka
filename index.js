const { exec } = require('child_process')
const { readFile, access } = require('fs')
const { promisify } = require('util')

const readFileContents = promisify(readFile)

const args = process.argv.slice(2)

access(`./src/${args[0]}.ts`, (err) => {
    if (err) {
        console.error(`-----\n File './src/${args[0]}.ts' does not exist \n-----`)
        return
    }

    exec(`tsc ./src/${args[0]}.ts --outDir dist`, (err, _, stderr) => {
        if (err) {
            console.error(`-----\n ${err} \n-----`)
            return
        }
        if (stderr) {
            console.error(`-----\n ${stderr} \n-----`)
            return
        }

        const showResults = async (fileName, addon = '') => {
            let inputs = []
            let data = null
            if (addon !== 'skip') {
                let file = fileName
                if (addon) {
                    file = file + `.${addon}`
                }
                data = await readFileContents(`./inputs/${file}.txt`, 'utf-8')
            }
            switch (fileName) {
                case '1':
                    const { larger, largerWithWindow } = require('./dist/1')

                    inputs = data.split(/\n/).map(Number).slice(0, -1)
                    console.log(larger(inputs))         // 1681
                    console.log(largerWithWindow(inputs))   // 1704
                    break;
                case '2':
                    const { location, locationWithAim } = require('./dist/2')

                    inputs = data.split(/\n/).map(i => i.split(' ')).slice(0, -1)
                    console.log(location(inputs))         // 1681
                    console.log(locationWithAim(inputs))   // 1704
                    break;

                case '3':
                    const { power, power2, breathableAir } = require('./dist/3.js')
                    inputs = data.split(/\n/).slice(0, -1)
                    console.log(power(inputs))          // 3687446
                    console.log(power2(inputs))         // 3687446
                    console.log(breathableAir(inputs))  // 4406844
                    break
                case '4':
                    const { createCalls, createBoards, playBingo } = require('./dist/4')
                    inputs = data.split(/\n/)
                    const calls = createCalls(inputs)
                    const boards = createBoards(inputs)
                    playBingo(calls, boards)

                    break
                case '5':
                    const { createGrid, addVents, checkGrid } = require('./dist/5')
                    inputs = data.split(/\r\n/)
                    let grid = createGrid(1000, 1000)
                    addVents(inputs)
                    console.log(checkGrid(grid.length, grid[0].length))
                    // only vertical / horizontal --> 5835
                    grid = createGrid(1000, 1000)
                    addVents(inputs, true)
                    console.log(checkGrid(grid.length, grid[0].length))
                    // including diagonals --> 17013
                    break
                case '6':
                    const { largeTimer, timer } = require('./dist/6')
                    inputs = data.split(',')
                    timer(inputs)           // 362740
                    largeTimer(inputs)      // 1644874076764
                    break
                case '7':
                    const { align, alignSum } = require('./dist/7')
                    inputs = data.split(',').map(v => +v)
                    console.log(align(inputs))      // 354129
                    console.log(alignSum(inputs))   // 98905973
                    break
                case '8':
                    const { getDigits, countDigits } = require('./dist/8')
                    inputs = data.split(/\r\n/).map(v => v.split(' | '))
                    console.log(countDigits(inputs))
                    console.log(getDigits(inputs))
                    break
                case '9':
                    const { valleys, basins, setupMap } = require('./dist/9')
                    inputs = data.split(/\r\n/).map(v => v.split('').map(d => +d))
                    setupMap(inputs)
                    console.log(valleys())
                    console.log(basins())
                    break
                case '10':
                    const { part01, part02 } = require('./dist/10')
                    inputs = data.split(/\r\n/)
                    const [total01, good] = part01(inputs)
                    const total02 = part02(good)
                    console.log(total01, total02)
                    break
                case '11':
                    const { setup, getFlashes, getSteps } = require('./dist/11')
                    inputs = data.split(/\r\n/).map(v => v.split('').map(d => +d))
                    // console.log(inputs)
                    setup(inputs)
                    const flashes = getFlashes()
                    setup(inputs) // reset inputs
                    const steps = getSteps()
                    console.log(flashes, steps)
                    break
                case '12':
                    const { setupNetwork } = require('./dist/12')

                    inputs = data.split(/\r\n/)

                    const caves = setupNetwork(inputs)
                    // console.log(caves.show())
                    console.log(caves.findAllConnections('start', 'end'))
                    console.log(caves.findAllConnections('start', 'end', true))
                    break
                case '13':
                    const { setupGrid } = require('./dist/13')

                    const [rawinputs, rawfolds] = data.split(/\r\n\r\n/)
                    inputs = rawinputs.split(/\r\n/)
                    folds = rawfolds.split(/\r\n/).map(f => f.split(' ')[2].split('='))
                    const g = setupGrid(inputs)
                    for (let i = 0; i < folds.length; i++) {
                        const c = g.makeFold(folds[i][0], +folds[i][1])
                        i === 0 && console.log('points after 1st fold', c)
                    }
                    g.show()
                    break
                case '14':
                    const { createRules, createPolymer, iterate, count } = require('./dist/14')

                    const [basePolymer, baseRules] = data.split(/\r\n\r\n/)
                    const rules = createRules(baseRules.split(/\r\n/))
                    const polymer = createPolymer(basePolymer)
                    const polymer10 = iterate(10, polymer, rules)
                    const polymer40 = iterate(40, polymer, rules)
                    const countOfLetters10Steps = count(polymer10)
                    const countOfLetters40Steps = count(polymer40)
                    console.log(countOfLetters10Steps, countOfLetters40Steps)
                    break
                case '15':
                    const { Grid, findPath } = require('./dist/15')
                    inputs = data.split(/\r\n/)
                    let h = inputs.length
                    let w = inputs[0].length
                    const g1 = Grid(h, w, (y, x) => ({
                        riskTo: Number.MAX_SAFE_INTEGER,
                        risk: +inputs[y][x],
                    }))
                    const path1 = findPath(g1, [0, 0], [h - 1, w - 1])
                    const g2 = Grid(h * 5, w * 5, (y, x) => {
                        let risk = (+inputs[y % h][x % w] + Math.floor(y / h) + Math.floor(x / w))
                        if (risk > 9) risk -= 9
                        return {
                            riskTo: Number.MAX_SAFE_INTEGER,
                            risk
                        }
                    })
                    const path2 = findPath(g2, [0, 0], [h * 5 - 1, w * 5 - 1])
                    console.log(path1, path2)
                    break
                case '16':
                    const { evaluate, parse, hextobin } = require('./dist/16')

                    const input = hextobin(data)
                    const versionSum = parse(input)
                    const result = evaluate(input)
                    console.log(versionSum, result[0])
                    break
                case '17':
                    const { getResult, probe } = require('./dist/17')
                    console.log(getResult(probe))
                case '18':
                    const { getMagnitude, getLargest, fromArray } = require('./dist/18')
                    const input01 = data.split(/\r\n/).map(line => fromArray(JSON.parse(line)))
                    const input02 = data.split(/\r\n/)
                    const magnitude = getMagnitude(input01)
                    const maximum = getLargest(input02)
                    console.log(magnitude, maximum)
                    break
                case '19':
                case '20':
                    const { renderImage } = require('./dist/20')
                    const [data01, data02] = data.split(/\r\n\r\n/)
                    const litPixelsx2 = renderImage(data01, data02, 2)
                    const litPixelsx50 = renderImage(data01, data02, 50)
                    console.log(litPixelsx2, litPixelsx50)
                    break
                case '21':
                    const { part1, part2 } = require('./dist/21')
                    const regularDieResult = part1()
                    const quantumDieResult = part2({ score: 0, pos: 7 }, { score: 0, pos: 4 })
                    console.log(regularDieResult, quantumDieResult)
                    break
                case '22':
                    const { startRebootSequence } = require('./dist/22')
                    const instructions = data.split(/\n/).map(line => {
                        const [action, positions] = line.split(' ')
                        const [x1, x2, y1, y2, z1, z2] = positions.split(',').flatMap(pos => pos.slice(pos.indexOf('=') + 1).split('..').map(Number))
                        return {
                            status: action === 'on' ? 1 : -1,
                            x1,
                            x2,
                            y1,
                            y2,
                            z1,
                            z2,
                        }
                    })
                    const smallReboot = startRebootSequence(instructions)
                    const reboot = startRebootSequence(instructions, false)
                    console.log(smallReboot, reboot)
                    break
                case '23':
                case '24':
                case '25':
                default:
                    console.error(`-----\n output file ${fileName} does not exist in ./dist folder \n-----`)
                    break;
            }
        }

        showResults(args[0], args[1])
            .catch(err => console.error(`-----\n ${err} \n-----`))
    })


})
