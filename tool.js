/**inherit(Target,Origin) 继承---圣杯模式   
 * Target 继承对象
 * Origin 被继承对象
*/
let inherit = (function () {
    function F() { };
    return function (Target, Origin) {
        F.prototype = Origin.prototype;
        Target.prototype = new F();
        Target.prototype.constructor = Target;
        Target.prototype.uber = Origin.prototype;
    }
}());


/**deepClone(origin) 深度克隆   
 * origin 需要克隆的数据  
*/
function deepClone(origin) {
    let target;
    let OriginType = Object.prototype.toString.call(origin);
    let type = typeof (origin);
    if ((type === "object") && (origin !== null)) {
        target = OriginType === "[object Array]" ? [] : {};
        for (prop in origin) {
            if (origin.hasOwnProperty(prop)) {
                target[prop] = deepClone(origin[prop])
            }
        }
    } else {
        target = origin;
    }
    return target;
}

/**unique() 数组原型添加方法--数组去重*/
Array.prototype.unique = function () {
    let obj = {};
    let newArr = [];
    for (let item in this) {
        if (this.hasOwnProperty(item)) {
            if (!obj[this[item]]) {
                obj[this[item]] = "123";
                newArr.push(this[item]);
            }
        }
    }
    return newArr;
}


/**typeOf(paramter) 封装函数,返回数据类型。  
 * paramter 传入的数据
*/
function typeOf(paramter) {
    let rex = /^\[object\s(\w*)\]$/;
    let type = Object.prototype.toString.call(paramter);
    return type.match(rex)[1].toLowerCase();
}

/**getScrollOffset() 获取滚动条滚动的距离(兼容IE9以下) */
function getScrollOffset() {
    if (window.pageXOffset) {
        return {
            X: window.pageXOffset,
            Y: window.pageYOffset
            
        }
    } else {
        // IE8 及 IE8 以下
        return {
            X: document.body.scrollLeft + document.documentElement.scrollLeft,
            Y: document.body.scrollTop + document.documentElement.scrollTop,
        }
    }
}

/**getViewportOffset 获取可见视口的宽高(兼容IE9以下) */
function getViewportOffset() {
    if (0 || window.innerWidth) {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    } else {
        if (document.compatMode === "BacCompat") {
            return {
                width: document.body.clientWidth,
                height: document.boody.clientHeight
            }
        } else {
            return {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            }
        }
    }
}

/**getStyle 获取元素属性值(兼容IE9以下)   
 * ele 当前元素           
 * prop 选择的属性  
 * pseudo 伪元素,默认为 null  
*/
function getStyle(ele, prop, pseudo) {
    if (getComputedStyle) {
        pseudo = pseudo || null;
        return window.getComputedStyle(ele, pseudo)[prop];
    } else {
        return ele.currentStyle[prop];
    }
}



/**addEvent(type,ele,callback,flag)  元素绑定事件(兼容IE9以下)  
 * type 绑定的事件类型  
 * ele  绑定事件的元素  
 * callback  执行函数  
 * flag  冒泡或捕获 , 默认 冒泡 false    
*/

function addEvent(type, ele, callback, flag) {
    flag = flag || false;
    if (ele.addEventListenner) {
        ele.addEventListenner(type, callback, flag);
    } else if (ele.attachEvent) {
        ele.attachEvent(on + type, function () {
            callback.call(ele);
        });
    } else {
        ele["on" + type] = callback;
    }
}


/**removeEvent(type,ele,callback,flag)  解除元素绑定事件(兼容IE9以下)  
 * type 绑定的事件类型  
 * ele  绑定事件的元素  
 * callback  执行函数  
 * flag  冒泡或捕获 , 默认 冒泡 false  
*/
function removeEvent(type, ele, callback, flag) {
    flag = flag || false;
    if (ele.removeEventListenner) {
        ele.removeEventListenner(type, callback, flag);
    } else if (ele.detachEvent) {
        ele.detachEvent(on + type, callback);
    } else {
        ele["on" + type] = false;
    }
}

/**stopBubble(event) 取消冒泡事件(兼容IE9以下)  
 *  event 为系统参数,不需要填写
 */
function stopBubble(event) {
    if (event.stopPropagation) {
        event.stopPropagation();
    } else {
        event.cancleBubble = true;
    }
}

/**cancelDefaultEvent() 阻止默认事件(兼容IE9以下) */
function cancelDefaultEvent(event){
    if(event.preventDefault){
        event.preventDefault();
    }else{
        event.returnValue = false;
    }
}