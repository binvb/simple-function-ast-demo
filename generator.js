function getParams(params) {
    let tokens = []

    for(let i = 0; i < params.length; i++) {
        tokens = tokens.concat([
            {
                "type": "variate",
                "value": params[i].id.name
            },
            {
                "type": "comma",
                "value": ","
            }
        ])
    }
    tokens.pop()

    return tokens
}

function getStatement(params) {
    let tokens = []

    for(let i = 0; i < params.length; i++) {
        tokens = tokens.concat([
            {
                ...params[i]
            },
            {
                "type": "blank",
                "value": " "
            }
        ])
    }
    tokens.pop()

    return tokens
}

function tokenToStr(tokens) {
    let str = ''
    let length = tokens.length

    for(let i = 0; i < length; i++) {
        str += tokens[i].value
    }

    return str
}

function getTokens(ast) {
    let tokens = []

    for(let i = 0; i < ast.length; i++) {
        if(ast[i].type === 'FunctionDeclaration') {
            let _functionTokens = [
                {
                    "type": "FunctionDeclaration",
                    "value": "function"
                },
                {
                    "type": "blank",
                    "value": " "
                },
                {
                    "type": "functionName",
                    "value": ast[i].id.name
                },
                {
                    "type": "paren",
                    "value": "("
                },
                ...getParams(ast[i].params),
                {
                    "type": "paren",
                    "value": ")"                
                },
                {
                    "type": "bracket",
                    "value": "{"
                },
                ...getTokens(ast[i].body),
                {
                    "type": "bracket",
                    "value": "}"
                }
            ]

            tokens = tokens.concat(_functionTokens)
        }
        if(ast[i].type === 'ReturnExpressionStatement') {
            let _returnStatemenet = [
                {
                    "type": "ReturnExpressionStatement",
                    "value": "return"
                },
                {
                    "type": "blank",
                    "value": " "
                },
                ...getStatement(ast[i].body)
            ]

            tokens = tokens.concat(_returnStatemenet)
        }
    }

    return tokens
}

export default function generator(ast) {
    let tokens = getTokens(ast)

    return tokenToStr(tokens)
}