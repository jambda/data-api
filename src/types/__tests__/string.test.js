import caminte from 'caminte'
import { clone } from '../../helper/util'
import stringType from '../string'

const modelMock = {
    properties: {},
    validations: [],
    relations: []
}
const propertyMock = {
    name: 'testProperty',
    type: caminte.Schema.String
}
const definitionMock = {}

describe('Data Type: String', () => {
    const model = clone(modelMock)
    const property = clone(propertyMock)
    const definition = clone(definitionMock)
    const response = clone(model, {
        properties: { testProperty: { type: caminte.Schema.String } },
        validations: expect.anything()
    })
    const call = stringType(model, property, definition)

    it('Should add to properties to model', () => {
        expect(call).toMatchObject(response)
        expect(call.validations).toHaveLength(1)
    })

    it('Should properly validate string type to true', () => {
        const errorCallback = jest.fn(() => {})
        const THIS = { testProperty: 'string' }
        const { validate } = call.validations[0]

        expect(validate[0].call(THIS, errorCallback)).toBeUndefined()
        expect(errorCallback).not.toHaveBeenCalled()
    })

    it('Should properly validate string type to false', () => {
        const errorCallback = jest.fn(() => {})
        const THIS = { testProperty: 56464 }
        const { validate } = call.validations[0]

        expect(validate[0].call(THIS, errorCallback)).toBeUndefined()
        expect(errorCallback).toHaveBeenCalled()
    })
})
