import { setUrlPrefix } from './common'

const SKYEYE4_URL_ROOT = 'https://skyeyev4.yunxuetang.com/skyeyeapi/v4/'

let SKYEYE4_API_URL = {
    COMMON_CONDITIONS: 'common/conditions',
    COMMON_SEARCH: 'common/search'
}

setUrlPrefix(SKYEYE4_URL_ROOT, SKYEYE4_API_URL)

export { SKYEYE4_API_URL }
