async function positive(hdl, values) {
  for (const value of values) {
    it(`should valid input ${value}`, async function () {
      const input = {
        test: value
      }
      const ret = await hdl.verify(input)
      if (ret.error === true) {
        throw new Error(`Positive Catching ${ret.fields['.test']}`)
      }
    })
  }
}

async function negative(hdl, values) {
  for (const value of values) {
    it(`should invalid input ${value}`, async function () {
      const input = {
        test: value
      }
      const ret = await hdl.verify(input)
      if (ret.error !== true) {
        throw new Error(`Negative Catching ${ret.fields['.test']}`)
      }
    })
  }
}

module.exports = {
  positive,
  negative
}
