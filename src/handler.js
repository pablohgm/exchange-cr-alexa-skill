import { OK } from 'http-status-codes'
import { dollarExchange } from 'exchangecr'
import { Response } from './util/Helper'

/**
 * Get the API status
 * @param event
 * @param context
 * @return Promise
 */
const getStatus = async (event) => Response(OK, 'API is up !', event)

const getExchange = async (event) => {
  const result = await dollarExchange()

  return Response(OK, `The US Dollar exchange for CR Color is: ${result.sellRate} / ${result.buyRate}`, event)
}

export {
  getStatus,
  getExchange
}
