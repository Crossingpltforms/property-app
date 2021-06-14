const dayjs = require('dayjs')
const AdvancedFormat = require('dayjs/plugin/advancedFormat')
const localizedFormat = require('dayjs/plugin/localizedFormat')

dayjs.extend(AdvancedFormat)
dayjs.extend(localizedFormat)

export const formatTime = (formatter, t) => {
  return t ? dayjs(t).format(formatter) : dayjs().format(formatter)
}
export const secondsToDate = (formatter, t) => {
  return t ? dayjs.unix(t).format(formatter) : dayjs().format(formatter)
}
