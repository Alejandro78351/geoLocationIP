const ipLocationService = require('../../service/IPLocationService')
const ipLocationRepository = require('../../repository/IPLocationRepository')
const IPLocation = require('../../businessEntity/IPLocation')
const faker = require('faker')
const sinon = require('sinon')
const axios = require('axios')
/**
 *
 * Unit test IPLocation Service
 */

describe('IP location service ', () => {
  beforeEach(() => {
    this.findIPLocation = sinon.stub(ipLocationRepository, 'findIPLocation')
    this.saveIPLocation = sinon.stub(ipLocationRepository, 'saveIPLocation')
    this.updateIpLocation = sinon.stub(ipLocationRepository, 'updateIpLocation')
    this.axiosStub = sinon.stub(axios, 'get')
  })
  afterEach(() => {
    this.findIPLocation.restore()
    this.saveIPLocation.restore()
    this.updateIpLocation.restore()
    this.axiosStub.restore()
  })
  it('Get ip Location from DB', async () => {
    const ip = faker.internet.ip()
    const ipLocation = new IPLocation(ip, 'United States', 'US', false)
    ipLocation.country.trm = 'EUR'
    ipLocation.country.trm.addRate('USD', 1.18441, new Date())
    this.findIPLocation.resolves(ipLocation)
    const data = await ipLocationService.getIpLocation(ip)
    expect(data).toEqual(ipLocation)
  })

  it('Get ip Location from API', async () => {
    const ip = faker.internet.ip()
    const ipLocation = new IPLocation(ip, 'United States', 'US', false)
    ipLocation.country.trm = 'EUR'
    ipLocation.country.trm.addRate('USD', 1.18441, new Date())
    this.findIPLocation.resolves(undefined)
    this.axiosStub.resolves({ data: { currencies: [{ code: 'US' }], success: true, rates: { US: 7643, COP: 354.3 } } })
    this.saveIPLocation.resolves(ipLocation)
    const data = await ipLocationService.getIpLocation(ip)
    expect(data).toEqual(ipLocation)
  })

  it('Register API in black list when Ip exists in DB', async () => {
    const ip = faker.internet.ip()
    const ipLocation = new IPLocation(ip, 'United States', 'US', false)
    ipLocation.country.trm = 'EUR'
    ipLocation.country.trm.addRate('USD', 1.18441, new Date())
    this.updateIpLocation.resolves(ipLocation)
    const data = await ipLocationService.registerIpBlackList(ip)
    expect(this.saveIPLocation.called)
    expect(data).toEqual({ _message: 'Success' })
  })

  it('Register API in black list when Ip does not exists in DB', async () => {
    const ip = faker.internet.ip()
    const ipLocation = new IPLocation(ip, 'United States', 'US', false)
    ipLocation.country.trm = 'EUR'
    ipLocation.country.trm.addRate('USD', 1.18441, new Date())
    this.updateIpLocation.throws(new Error('Ip has not been created'))
    this.saveIPLocation.resolves(ipLocation)
    const data = await ipLocationService.registerIpBlackList(ip)
    expect(this.saveIPLocation.called)
    expect(data).toEqual({ _message: 'Success' })
  })
})
