export default function transform(ast) {
    for(let i = 0; i < ast.length; i++) {
        if(ast[i].type === 'FunctionDeclaration') {
            transform(ast[i].body)
        }
        if(ast[i].type === 'ReturnExpressionStatement') {
            transform(ast[i].body)
        }
        if(ast[i].type === 'variate' && ast[i].value === 'a') {
            ast[i].value = 1
        }
    }

    return ast
}