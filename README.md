### AST
为什么前端变得越来越复杂了，各种框架，babel,typescript,webpack,rollup,etc.  
但以上的工具的前提是需要编译，而javascript的编译工作主要是基于 ast 。各种框架/脚手架/语言，都会通过 ast 将代码编译生成符合自己需求的，可以在浏览器运行的js代码。编译流程如下：  
1 tokenizer： 分词，将所有代码分为一个个 token;  
2 parse: 语法解析，将一个个 token 装进语法树;  
3 transform: 按照一些自定义规则替换/修改语法树;  
4 generator: 再把语法树转化为可以正常运行的js代码;  
本文主要是参考 recast && the-super-tiny-compiler 实践下js代码编译的整个过程，了解下 ast 在前端的应用。  

注：本文仅实现一个简单 sum 函数的编译过程。仓库地址： https://github.com/binvb/simple-function-ast-demo

### ast 结果
在实现之前，我们先看一下现有的编译工具生成结果。通过一个 recast 工具试验下将源码编译为 ast 的效果：  
```
import * as recast from 'recast'

let sourceCode = `
    function sum(a, b) {
        return a + b
    }
`
console.log(JSON.stringify(recast.parse(sourceCode)))
```
将编译出来的 JSON 字符串格式化后有接近三千行代码！但关键数据在 program.body 中，program.body的数据结构如下：    
```
"type": "FunctionDeclaration", // 函数标志符  
"id":{...}, // 函数名等
"params": [...], // 函数传参  
"body":{...}, // 函数 block 里面的内容  
```
其实这个数据结构里面还有很多东西，包括开始结束位置(行，列)，缩进等，但这些不是主要内容，所以省略了。  

### tokenizer
在分词的阶段，我们先提取一下我们需要的关键字，以及分析关键字的分词规则：   
1 function: 前后空白;  
2 function name: 在function之前, paren之后;  
3 paren: 关键字'(' or ')';  
5 comma: 关键字 ',';  
6 bracket: 关键字 '{' or '}';  
7 return: 前后空白;  
8 plus： 特殊符号; 
9 variate: 字符串变量名;  
10 blank: 空白;  
然后将源码按最小单位切割进行匹配，e.g.  
```
function tokenizer(input) {
    let current = 0

    while(current < input.length>) {
      // 先匹配单个字符串的分词规则
      if(_char === '(' || _char === ')' ) {
        tokens.push({
          type: 'paren',
          value: _char
        })
        current++
        continue
      }
      ...
    }
}
```


### parse
在解析阶段，我们需要将 token 一个个装入我们的语法树中:  
```
// from 
[
    {
        type: 'FunctionDeclaration',
        value: 'function'
    }
    ...
]
// to
{
    program: {
        body: [
            {
                type: 'FunctionDeclaration',
                params: [...],
                id: {
                    name: 'sum'
                },
                body:[
                    {
                        type: 'blockStament',
                        body: [...]
                    }
                ]
            }
        ]
    }
}
```
处理思路，因为token是一个扁平化的数组结构，我们需要一层层将数据插入到语法树中,可以用到宽度优先算法用递归的方式进行计算：  
```
function parse(tree, startIndex=0) {
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
                    name: getNextToken(tree, i + 1)
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
        ...
    }

    return root
}
```

### transform
在这个阶段，一般是框架/语言需要将一些不能在v8直接运行/或兼容版本的代码，转化为可以直接在v8上跑的代码(e.g. typescript, v8, etc.)。  
这里为了方便，只是做一个简单的变量转化，e.g.
```
// 将所有函数中变量名为a的变量改为数字 1
function transform(ast) {
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
```

### generator
这个步骤我们需要将 transform 后的 ast 反序列化回到 tokens，再将 tokens 生成字符串即可(具体代码可到仓库查看)。最后获取到:  
```
function sum(a,b){return 1 + b}
```
完结撒花


### 问题记录
1 分词阶段-必须从文件最开始的地方按顺序开始分词，而且有很多的分词规则，那这个切割的方式要怎么实现？  
切割为最小单元，所有的字符/空白全部都切割为一个单元。先从跟最小单元一样大小的分词规则开始匹配。

2 分词阶段-是否需要区分函数名, 参数名, 变量?需要的话怎么区分，因为按照分词规则，是进行连续匹配的。
参照规范是需要区分的，因为后续会需要对不同类型做不一样的操作的。  
需要增加一个维度的匹配规则：
```
1 对于函数名，连续字符串前面是空白，空白前面是'function';  
2 对于参数名，前后面 空白/逗号/();  
3 对于变量，前后空白;  
```

3 语法解析阶段-对于一些特殊字符，例如函数参数之间的逗号，是否需要在语法树中存储下来，存储下来的话是放到哪个位置？
规范的结构是需要存储的，主要是需要记录位置，但这个对于这个项目来说不重要且会大大增加复杂度，所以暂时不存储。

4 语法解析阶段-如何从token提取当前 blockStatement 的的同级结构。e.g.
```
// a 和 b 应该是在同一层树节点上
function test() {
    function a() {
        //...
    }
    function b() {
        //...
    }
}
```
从 blockStament 开始符号 '{' 到结束符号 '}' 提取到一个同级节点上(实际上要复杂非常多，例如 {{...{}...}}, 但这里暂时不需要考虑太多)。

5 generator阶段-如何将ast转为token？  
因为 ast 是按照顺序生成的，所以可以通过深度优先遍历提取所有的token.  


### 规范
虽然有很多工具实现了ast， 但如果每个工具/框架都有自己的实现和规范，就会造成混乱，所以各种工具的 ast 都是一样的。
规范参考https://github.com/estree/estree
### 相关工具
1 recast https://github.com/benjamn/recast  
```
// 将源码parse为语法树
reacast.parse(sourcecode)
// 将语法树转化为源码
reacast.print(ast)
```
### 参考文档
4 the-super-tiny-compiler https://github.com/jamiebuilds/the-super-tiny-compiler  
5 AST抽象语法树 https://segmentfault.com/a/1190000016231512  