import * as recast from 'recast'

let input = `
function sum(a, b) {
    return a + b
}
`

console.log(JSON.stringify(recast.parse(input)))