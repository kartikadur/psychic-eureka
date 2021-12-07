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
            let file = fileName
            if (addon) {
                file = file + `.${addon}`
            }
            const data = await readFileContents(`./inputs/${file}.txt`, 'utf-8')
            let inputs = []
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
                case '9':
                case '10':
                case '11':
                case '12':
                case '13':
                case '14':
                case '15':
                case '16':
                case '17':
                case '18':
                case '19':
                case '20':
                case '21':
                case '22':
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
