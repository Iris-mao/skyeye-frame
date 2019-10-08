/**
 * format date, example: new Date().format('yyyy-MM-dd hh:mm:ss')
 * @param  {string} fmt the format described as 'yyyy-MM-dd hh:mm:ss' or what you need
 * @return {string} the formatted date
 */
export const formatDate = function (date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + ''
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
        }
    }
    return fmt
}

function padLeftZero(str) {
    return ('00' + str).substr(str.length)
}

/**
 * set api url's prefix
 * @param prefix
 * @param urlCollections, rest parameters
 */
export const setUrlPrefix = function (prefix, ...urlCollections) {
    urlCollections.map(urlCollection => {
        if (typeof urlCollection === 'object') {
            for (let i in urlCollection) {
                if (typeof urlCollection[i] === 'string') {
                    urlCollection[i] = prefix + urlCollection[i]
                } else {
                    setUrlPrefix(prefix, urlCollection[i])
                }
            }
        }
    })
}

/**
 *
 * @param {string} params
 */
export function getUrlKey(param) {
    return decodeURIComponent((new RegExp('[?|&]' + param + '=([^&;]+?)(&|#|;|$)').exec(window.location.href) || ['', ''])[1].replace(/\+/g, '%20')) || null
}

export function toThousands(num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
}

export function toPercent(param) {
    if (param === '-') {
        return param
    } else {
        var str = Number((param > 0 ? param : -param) * 100).toFixed(2)
        str += '%'
        return str
    }
}

/**
 * judge an Object is empty or not
 * @param obj
 * @returns {boolean}
 */
export const isEmptyObject = function (obj) {
    let isEmpty = true
    if (typeof obj === 'object') {
        if (Object.keys(obj).length !== 0) {
            isEmpty = false
        }
    } else {
        console.error(obj + ' is not an Object')
    }
    return isEmpty
}

/**
 * get elements's computed width, if element is invisible, return the parent's width
 * @param target
 * @returns {number}
 */
export const getWidth = function (target) {
    let el
    let width = target.clientWidth
    if (width === 0) {
        el = target.parentNode
        return getWidth(el)
    } else {
        return width
    }
}

/**
 * set and delete selected item's value
 * @param context
 * @param selectedIndex
 * @param data
 * @param unselectedIndex
 */
export const showSelectedItem = function (context, selectedIndex, data, ...unselectedIndex) {
    setValue(context, selectedIndex, data)
    deleteValue(context, ...unselectedIndex)
}

export const setValue = function (context, index, data) {
    context.$set(context.selectedItems[index], 'pid', data.pid)
    context.$set(context.selectedItems[index], 'name', data.name)
}

export const deleteValue = function (context, ...indexArr) {
    indexArr.map(v => {
        context.$delete(context.selectedItems[v], 'pid')
        context.$delete(context.selectedItems[v], 'name')
    })
}
