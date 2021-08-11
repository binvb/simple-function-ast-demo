export default function tokenizer(input) {
    let current = 0
    let tokens = []
    let nameReg = /[a-zA-Z0-9_]/

    while(current < input.length) {
      let _char = input[current]
  
      // 先匹配单个字符串的分词规则
      if(_char === '(' || _char === ')' ) {
        tokens.push({
          type: 'paren',
          value: _char
        })
        current++
        continue
      }
      if(_char === ',') {
        tokens.push({
          type: 'comma',
          value: ','
        })
        current++
        continue
      }
      if(_char === '{' || _char === '}') {
        tokens.push({
          type: 'bracket',
          value: _char
        })
        current++
        continue
      }
      if(_char === '+') {
        tokens.push({
          type: 'plus',
          value: '+'
        })
        current++
        continue
      }
      if(_char === '+') {
        tokens.push({
          type: 'plus',
          value: '+'
        })
        current++
        continue
      }
      //空白
      if(/\s/.test(_char)) {
        tokens.push({
          type: 'blank',
          value: _char
        })
        current++
        continue
      }
      //字符串
      if(nameReg.test(_char)) {
        let _str = _char
        let _start = current

        while(nameReg.test(input[++_start])) {
          _str += input[_start]
        }

        // 匹配 function
        if(_str == 'function') {
          tokens.push({
            type: 'FunctionDeclaration',
            value: 'function'
          })
        }
        // 匹配 return
        if(_str === 'return') {
          tokens.push({
            type: 'ReturnExpressionStatement',
            value: 'return'
          })
        }
        // 匹配 function name
        if(tokens[tokens.length - 1].type === 'blank' && tokens[tokens.length - 2].type === 'FunctionDeclaration') {
          tokens.push({
            type: 'functionName',
            value: _str
          })
        }
        // 匹配 变量名
        if(['blank', 'paren', 'plus', 'bracket', 'comma'].includes(tokens[tokens.length - 1].type)) {
          tokens.push({
            type: 'variate',
            value: _str
          })      
        }
        current = _start
        continue
      }
      // 最后加个容灾
      tokens.push({
        type: 'error',
        value: 'non-match'
      })
      current++
    }
    return tokens
}