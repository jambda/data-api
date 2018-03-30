import caminte from 'caminte'
import { clone } from '../../helper/util'
import numberType from '../number'

const modelMock = {
    properties: {},
    validations: [],
    relations: []
}
const propertyMock = {
    name: 'testProperty',
    type: caminte.Schema.Number
}
const definitionMock = {}

describe('Data Type: Number', () => {
    const model = clone(modelMock)
    const property = clone(propertyMock)
    const definition = clone(definitionMock)
    const response = clone(model, {
        properties: { testProperty: { type: caminte.Schema.Number } },
        validations: expect.anything()
    })
    const call = numberType(model, property, definition)

    it('Should add to properties to model', () => {
        expect(call).toMatchObject(response)
        expect(call.validations).toHaveLength(1)
    })

    it('Should properly validate boolean type to true', () => {
        const errorCallback = jest.fn(() => {})
        const THIS = { testProperty: 12546 }
        const { validate } = call.validations[0]

        expect(validate[0].call(THIS, errorCallback)).toBeUndefined()
        expect(errorCallback).not.toHaveBeenCalled()
    })

    it('Should properly validate boolean type to false', () => {
        const errorCallback = jest.fn(() => {})
        const THIS = { testProperty: 'false' }
        const { validate } = call.validations[0]

        expect(validate[0].call(THIS, errorCallback)).toBeUndefined()
        expect(errorCallback).toHaveBeenCalled()
    })
})
