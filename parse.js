function getNode(tokens) {
    let current = 0

    while(current < tokens.length) {
        if(tokens[current] === 'function') {

        }
    }
}
// [parent1, parent2]
function bfs(parentId) {
    for(let i = 0; i < _length; i++) {
        if(arr[i].parentId === parentId) {
            return 
        }
    }
}


const bfs = (list) => {
    const levels = [[{ id: 0, children: [] }]];// 按层存储，每层都是一个数组
    let lv = 0;// 层级
    let count = 0;// 统计复杂度
    while (list.length > 0) {
        const level = levels[lv];
        // 遍历第j层，找该层第j个元素的children
        for (let j = 0; j < level.length; j++) {
            let i = 0;
            // 遍历原数据
            while (i < list.length) {
                count ++;
                if (list[i].parentId === level[j].id) {
                    if (!level[j].children) { level[j].children = []; }
                    level[j].children.push(list[i]);// 挂到父级节点下
                    if (!levels[lv + 1]) { levels.push([]); }
                    levels[lv + 1].push(list[i]);// 孩子属于下一层
                    list.splice(i, 1);// 移除
                } else {
                    i++; // 指针继续
                }
            }
        }
        lv++; // 层级
    }
    console.log('bfs=',count)
    console.log('lv=',lv)
    return levels[0][0].children;
}


let arr = [
    {
        id: '11',
        value: 'vb11',
        parentId: '1' 
    },
    {
        id: '111',
        value: 'vb111',
        parentId: '11' 
    },
    {
        id: '1',
        value: 'vb1',
    },
    {
        id: '1111',
        value: 'vb1111',
        parentId: '111' 
    },
    {
        id: '2',
        value: 'vb2',
    },
    {
        id: '22',
        value: 'vb22',
        parentId: '2' 
    }
]

function bfs(list, parentId) {
    let result = []
    let current = 0

    while(list.length) {
        if(!list[current]?.parentId && !parentId) {
            let children

            result.push(list[current])
            list.splice(current, 1)
            children = bfs(list, list[current].id)
            if(children.length) {
                result[result.length - 1].children = children
            }
        }else if(list[current]?.parentId === parentId) {
            result.push(list[current])
            list.splice(current, 1)
        } else {
            list.splice(current, 1)
        }
    }

    return result
}
let test = bfs(arr)