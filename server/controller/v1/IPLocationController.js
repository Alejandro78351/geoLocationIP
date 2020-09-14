const debug = require('debug')('back:location:controller')
const express = require('express')
const router = express.Router()
const wrapper = require('../../utils/wrapper')(debug)
const ipLocationService = require('../../service/IPLocationService')

/**
 *
 */
router.get('/v1/location', wrapper(async (req, res) => {
  debug('ip controller getIpLocation')
  const resp = await ipLocationService.getIpLocation(req.query.ip)
  res.send(resp)
}))

/**
 *
 */
router.post('/v1/location/blackList', wrapper(async (req, res) => {
  debug('ip controller registerIpBlackList')
  const resp = await ipLocationService.registerIpBlackList(req.body.ip)
  res.send(resp)
}))

module.exports = router
