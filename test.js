import tokenizer from './tokenizer.js'
import parse from './parse.js'
import transform from './transform.js'
import generator from './generator.js'

let sourceCode = `
function sum(a, b) {
  return a + b
}
`

let tokens = tokenizer(sourceCode)
let ast = parse(tokens)
let transFormAst = transform(ast)
let generatorTokens = generator(transFormAst)

console.log(JSON.stringify(tokens), 'tokens')
console.log(JSON.stringify(ast), 'ast')
console.log(JSON.stringify(transFormAst), 'transForm')
console.log(generatorTokens)