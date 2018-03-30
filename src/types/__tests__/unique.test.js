import { clone } from '../../helper/util'
import uniqueType from '../unique'

const modelMock = {
    properties: {},
    validations: [],
    relations: []
}
const propertyMock = {
    name: 'testProperty',
    type: 'string',
    unique: true
}
const definitionMock = {}

describe('Data Type: Unique', () => {
    const model = clone(modelMock)
    const property = clone(propertyMock)
    const definition = clone(definitionMock)
    const response = clone(model, {
        validations: [
            {
                validatesUniquenessOf: [
                    'testProperty',
                    { message: expect.anything() }
                ]
            }
        ]
    })
    const call = uniqueType(model, property, definition)

    it('Should add validatesPresenceOf to model validations', () => {
        expect(call).toMatchObject(response)
        expect(call.validations).toHaveLength(1)
    })
})
