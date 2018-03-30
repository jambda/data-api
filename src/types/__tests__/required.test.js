import { clone } from '../../helper/util'
import requiredType from '../required'

const modelMock = {
    properties: {},
    validations: [],
    relations: []
}
const propertyMock = {
    name: 'testProperty',
    type: 'string',
    required: true
}
const definitionMock = {}

describe('Data Type: Required', () => {
    const model = clone(modelMock)
    const property = clone(propertyMock)
    const definition = clone(definitionMock)
    const response = clone(model, {
        validations: [
            {
                validatesPresenceOf: ['testProperty']
            }
        ]
    })
    const call = requiredType(model, property, definition)

    it('Should add validatesPresenceOf to model validations', () => {
        expect(call).toMatchObject(response)
        expect(call.validations).toHaveLength(1)
    })
})
