import axios from 'axios'
// 引入mock.js
import '@/mock'

// 请求服务器地址
let API_DOMAIN = 'http://test.com/api/'

// API请求正常，数据正常
export const API_CODE = {
    // API请求正常
    OK: 200,
    // API请求正常，数据异常
    ERR_DATA: 403,
    // API请求正常，空数据
    ERR_NO_DATA: 301,
    // API请求正常，登录异常
    ERR_LOGOUT: 401
}
// API请求异常报错内容
export const API_FAILED = '网络连接异常，请稍后再试'

// API请求汇总
export const apiReqs = {
    // 获取数据
    getData: (config: any) => {
        config.url = API_DOMAIN + 'getData'
        config.method = 'get'
        fetch(config)
    }
}

// 发起请求
function fetch(config: any) {
    if (process.env.REACT_APP_DEBUG === 'true') {
        // debug模式，直接发起请求
        apiRequest(config)
    } else {
        // normal模式，委托background script发起请
        sendRequestToBackground(config)
    }
}

/*
 * API请求封装（带验证信息）
 * config.this: [必填]组件作用域，用于页面跳转等逻辑
 * config.method: [必须]请求method
 * config.url: [必须]请求url
 * config.data: 请求数据
 * config.formData: 是否以formData格式提交（用于上传文件）
 * config.success(res): 请求成功回调
 * config.fail(err): 请求失败回调
 * config.done(): 请求结束回调
 */
export function apiRequest(config: any) {

    // 如果没有设置config.data，则默认为{}
    if (config.data === undefined) {
        config.data = {}
    }

    // 如果没有设置config.method，则默认为post
    config.method = config.method || 'post'

    // 放在请求头里的Access-Token，根据业务需求，可从localstorage里获取。演示代码暂为空。
    let headers = {
        "Access-Token": '',
        "Content-Type": '',
    }

    let data: any = null
    // 上传文件的兼容处理，如果config.formData=true，则以multipart/form-data方式发起请求
    if (config.formData) {
        headers['Content-Type'] = 'multipart/form-data'
        data = new FormData()
        Object.keys(config.data).forEach(function (key) {
            data.append(key, config.data[key])
        });
    } else {
        data = config.data
    }

    // 准备好请求的全部数据
    let axiosConfig = {
        method: config.method,
        url: config.url,
        headers,
        params: undefined,
        data: undefined,
    }
    if (config.method === 'get') {
        axiosConfig.params = data
    } else {
        axiosConfig.data = data
    }

    // 发起请求
    axios(axiosConfig).then((res) => {
        let result = res.data
        // 请求结束的回调
        config.done && config.done()
        // 请求成功的回调
        config.success && config.success(result)
    }).catch(() => {
        // 请求结束的回调
        config.done && config.done()
        // 请求失败的回调
        config.fail && config.fail(API_FAILED)

    })
}

// 委托background执行请求
function sendRequestToBackground(config: any) {
    config.apiType = 'background'
    if (window.chrome && window.chrome.runtime) {
        window.chrome && window.chrome.runtime.sendMessage({
            contentRequest: 'apiRequest',
            config: config,
        }, (result) => {
            // 接收background script的sendResponse方法返回的消数据result
            config.done && config.done()
            if (result.result === 'succ') {
                config.success && config.success(result)
            } else {
                config.fail && config.fail(result.msg)
            }
        })
    } else {
        console.log('未找到chrome API')
    }
}