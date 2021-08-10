// 获取 函数/语句 scope内的所有token
function getBlockStatementList(list, currentIndex=0, endSymbol) {
    for(let i = currentIndex; i < list.length; i++) {
        if(list[i].value === endSymbol) {
            return {
                token: list[i],
                index: i
            }
        }
    }
}
// 获取前一个非 空白 的token
function getPreToken(list, currentIndex=0) {
    for(let i = currentIndex; i > 0; i--) {
        if(list[i].type !== 'blank') {
            return list[i]
        }
    }
}
// 获取后一个非 空白 的token
function getNextToken(list, currentIndex=0) {
    for(let i = currentIndex; i < list.length; i++) {
        if(list[i].type !== 'blank') {
            return list[i]
        }
    }
}
// specific function params
function getFunctionParams(list, currentIndex=0) {
    let root = []

    for(let i = currentIndex; i < list.length; i++) {
        if(list[i].type === 'variate') {
            root.push({
                type: 'variate',
                id: {
                    name: list[i].value
                }
            })
        }
        if(list[i].type === 'paren') {
            return root
        }
    }
}
// parse
function parse(tree, startIndex=0) {
    let root = []
    let treeLength = tree.length

    for(let i = startIndex; i < treeLength; i++) {
        // function
        if(tree[i].type === 'FunctionDeclaration') {
            root.push({
                type: 'FunctionDeclaration',
                params: [
                    ...getFunctionParams(tree, i + 1, ')')
                ],
                id: {
                    name: getNextToken(tree, i + 1)
                },
                body: parse(tree.slice(i, getBlockStatementList(tree, i, '}').index))
            })
        }
        // return statement
        if(tree[i].type === 'return') {
            root.push({
                type: 'return',
                body: []
            })
        }
        // function params
        if(tree[i].type === 'paren' && tree[i].value === '(' &&  getPreToken(list, i).type === 'FunctionDeclaration') {

        }
    }

    return root
}

