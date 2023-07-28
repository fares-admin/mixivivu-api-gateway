/* eslint-disable no-console */
const logger = (() => {
  const checkIfLogsEnabled = () => {
    if (typeof window !== 'undefined') {
      const thisGlobal = global as any

      const search = thisGlobal?.window?.location?.search
      const enabled = search && new URLSearchParams(search).get('debug') === 'true'

      thisGlobal.areLogsEnabled = enabled || false
      return thisGlobal.areLogsEnabled
    }

    return false
  }

  const isDev = process.env.NODE_ENV !== 'production'

  const print = (type: 'info' | 'warn' | 'error' | 'trace' | 'debug', messages: string[]) => {
    const thisGlobal = global as any
    if (typeof thisGlobal.areLogsEnabled === 'undefined') {
      checkIfLogsEnabled()
    }

    if (thisGlobal.areLogsEnabled || isDev) {
      switch (type) {
        case 'info':
          console.info('%c Info log:', 'background: blue; color: white;', ...messages)
          break
        case 'warn':
          console.warn('%c Warn log:', 'background: orange; color: white;', ...messages)
          break
        case 'error':
          console.error('%c Error log:', 'background: red; color: white;', ...messages)
          break
        case 'trace':
          console.trace('%c Trace log:', 'background: grey; color: black;', ...messages)
          break
        case 'debug':
        default:
          console.log('%c Debug log:', 'background: green; color: white;', ...messages)
      }
    }
  }

  return {
    debug: print.bind(null, 'debug'),
    info: print.bind(null, 'info'),
    warn: print.bind(null, 'warn'),
    error: print.bind(null, 'error'),
    trace: print.bind(null, 'trace'),
  }
})()

export default logger
