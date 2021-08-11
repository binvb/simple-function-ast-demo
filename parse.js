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
    return {}
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
    let flag = false

    for(let i = currentIndex; i < list.length; i++) {
        if(list[i].type === 'variate' && flag) {
            root.push({
                type: 'variate',
                id: {
                    name: list[i].value
                }
            })
        }
        if(list[i].type === 'paren' && flag) {
            return root
        }
        if(list[i].type === 'paren') {
            flag = true
        }
    }
}
// expressionstatement
function getExpressionStatement(list) {
    let root = []

    for(let i = 0; i < list.length; i++) {
        if(list[i].type === 'variate' || list[i].type === 'plus') {
            root.push(list[i])
        }
    }

    return root
}
// parse
export default function parse(tree, startIndex=0) {
    let root = []
    let treeLength = tree.length

    for(let i = startIndex; i < treeLength; i++) {
        // function
        if(tree[i].type === 'FunctionDeclaration') {
            let blockRangeEnd = getBlockStatementList(tree, i, '}').index

            root.push({
                type: 'FunctionDeclaration',
                params: [
                    ...getFunctionParams(tree, i + 1, ')')
                ],
                id: {
                    name: getNextToken(tree, i + 1).value
                },
                body: parse(tree.slice(i + 1, blockRangeEnd))
            })
            i = blockRangeEnd
        }
        // return statement
        if(tree[i].type === 'ReturnExpressionStatement') {
            let blockRangeEnd = getBlockStatementList(tree, i, '}').index

            root.push({
                type: 'ReturnExpressionStatement',
                body: getExpressionStatement(tree.slice(i + 1, blockRangeEnd))
            })
            i = blockRangeEnd
        }
    }

    return root
}