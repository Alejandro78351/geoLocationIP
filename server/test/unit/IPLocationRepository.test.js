const ipLocationRepository = require('../../repository/IPLocationRepository')
const IPLocation = require('../../businessEntity/IPLocation')
const IPLocationModel = require('../../model/IPLocationModel')
const faker = require('faker')
const sinon = require('sinon')
const redisClient = require('../../utils/redis')

/**
 *
 * Unit test IPLocation Repository
 */

describe('IP location service ', () => {
  beforeEach(() => {
    this.redisGet = sinon.stub(redisClient, 'get')
    this.redisSet = sinon.stub(redisClient, 'set')
    this.redisDel = sinon.stub(redisClient, 'del')
    this.redisExpire = sinon.stub(redisClient, 'expire')
    this.ipLocationModel = sinon.stub(IPLocationModel, 'find')
    this.ipLocationModelSave = sinon.stub(IPLocationModel.prototype, 'save').yields(null, {})
    this.ipLocationModelUpdate = sinon.stub(IPLocationModel, 'updateOne')
  })
  afterEach(() => {
    this.redisGet.restore()
    this.redisSet.restore()
    this.redisDel.restore()
    this.redisExpire.restore()
    this.ipLocationModel.restore()
    this.ipLocationModelSave.restore()
    this.ipLocationModelUpdate.restore()
  })
  it('findIPLocation from Redis', async () => {
    const ip = faker.internet.ip()
    const ipLocation = new IPLocation(ip, 'United States', 'US', false)
    ipLocation.country.trm = 'EUR'
    const date = new Date()
    ipLocation.country.trm.addRate('USD', 1.18441, date.getTime())
    const redisResp = `{"_ip":"${ip}","_isBlackListed":false,"_country":{"_name":"United States","_code":"US","_trm":{"_base":"EUR","_rate":[{"_name":"USD","_value":1.18441,"_date":${date.getTime()}}]}}}`
    this.redisGet.resolves(redisResp)
    const data = await ipLocationRepository.findIPLocation(ip)
    expect(data).toEqual(ipLocation)
  })

  it('findIPLocation from DB', async () => {
    const ip = faker.internet.ip()
    const ipLocation = new IPLocation(ip, 'United States', 'US', false)
    ipLocation.country.trm = 'EUR'
    const date = new Date()
    ipLocation.country.trm.addRate('USD', 1.6464, date)
    this.redisGet.resolves(undefined)
    const respModel = [
      {
        isblackListed: false,
        _id: '5f5edb4a02ac320ef340ea8e',
        ip: ip,
        country: { name: 'United States', code: 'US', trm: { base: 'EUR', rates: [{ rate: 'USD', value: 1.6464, date }] } },
        __v: 0
      }
    ]
    this.ipLocationModel.resolves(respModel)
    this.redisSet.resolves({})
    this.redisExpire.resolves({})
    const data = await ipLocationRepository.findIPLocation(ip)
    expect(data).toEqual(ipLocation)
  })

  it('saveIPLocation success', async () => {
    const ip = faker.internet.ip()
    const ipLocation = new IPLocation(ip, 'United States', 'US', false)
    ipLocation.country.trm = 'EUR'
    const date = new Date()
    ipLocation.country.trm.addRate('USD', 1.47654, date)
    this.redisSet.resolves({})
    this.redisExpire.resolves({})
    const trm = { base: 'EUR', rates: [{ rate: 'USD', value: 1.47654, date }] }
    const data = await ipLocationRepository.saveIPLocation(ip, false, 'United States', 'US', trm)
    expect(data).toEqual(ipLocation)
  })

  it('updateIpLocation Ip has not been created', async () => {
    const ip = faker.internet.ip()
    const ipParams = {
      ip,
      isblackListed: true
    }
    const ipLocation = new IPLocation(ip, 'United States', 'US', true)
    ipLocation.country.trm = 'EUR'
    ipLocation.country.trm.addRate('USD', 1.6282, new Date())

    this.ipLocationModel.resolves([])
    try {
      await ipLocationRepository.updateIpLocation(ipParams)
    } catch (error) {
      expect(error.message).toEqual('Ip has not been created')
    }
  })
})
