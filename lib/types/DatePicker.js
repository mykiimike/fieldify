const signderivaType = require("./type")

const regex = /^((0x){0,1}|#{0,1})([0-9A-F]{8}|[0-9A-F]{6})$/ig


class signderivaTypeDatePicker extends signderivaType {
  constructor(options) {
    super(options)
    if (!("range" in this.options)) this.options.range = false
  }

}

module.exports = {
  "code": "DatePicker",
  "description": "Date Picker",
  "class": signderivaTypeDatePicker
}