export function getFormattedAmount(amount) {
  // Format price details and detect zero decimal currencies
  let amountToFormat = amount
  let numberFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'symbol',
  })

  let parts = numberFormat.formatToParts(amountToFormat)
  let zeroDecimalCurrency = true
  for (let part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false
    }
  }

  amountToFormat = zeroDecimalCurrency ? amount : amount / 100
  let formattedAmount = numberFormat.format(amountToFormat)
  console.log(formattedAmount)

  return formattedAmount
}

export function getDateStringFromUnixTimestamp(date) {
  let nextPaymentAttempDate = new Date(date * 1000)
  let day = nextPaymentAttempDate.getDate()
  let month = nextPaymentAttempDate.getMonth() + 1
  let year = nextPaymentAttempDate.getFullYear()

  return `${month}/${day}/${year}`
}
