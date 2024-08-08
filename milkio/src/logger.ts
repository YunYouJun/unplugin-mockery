/* eslint-disable no-console */
import type { LoggerOptions } from 'milkio'

// By default, log output to the console
// You can customize an object to implement the log output to the file, or send it to the private log center

export interface LoggerTags {
  hello: string
}

export const loggerOptions = {
  // eslint-disable-next-line unused-imports/no-unused-vars
  onSubmit: (tags, logs) => {
    //
  },
  onInsert: (options) => {
    // Print the log to the console..
    console[options.loggerLevel](options.description, ...options.params)
    return true
  },
} satisfies LoggerOptions
