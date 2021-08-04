function tokenizer(input) {
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
      if(_char === '+') {
        tokens.push({
          type: 'comma',
          value: '+'
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
      //空白
      if(/s/.test(_char)) {
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
            type: 'function',
            value: 'function'
          })
        }
        // 匹配 function name
        if(tokens[tokens.length - 1].type === 'blank' && tokens[tokens.length - 2].type === 'function') {
          tokens.push({
            type: 'functionName',
            value: _str
          })
        }
        // 匹配 参数名
        //最后一个不匹配但已++，所以-1
        current = _start - 1
        continue
      }
      // 最后加个容灾
      tokens.push({
        type: 'error',
        value: 'non-match'
      })
    }
}