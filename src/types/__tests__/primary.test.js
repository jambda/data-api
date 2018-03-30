import caminte from 'caminte'
import { clone } from '../../helper/util'
import primaryType from '../primary'

const modelMock = {
    properties: {},
    settings: {
        primaryKeys: [],
        indexes: {}
    },
    validations: [],
    relations: []
}
const propertyMock = {
    name: 'testProperty',
    type: caminte.Schema.Number,
    primary: true
}
const indexes = {

}
const definitionMock = {}

describe('Data Type: Primary Keys', () => {
    const model = clone(modelMock)
    const property = clone(propertyMock)
    const definition = clone(definitionMock)
    const response = clone(model, {
        settings: {
            indexes: expect.anything(),
            primaryKeys: ['testProperty']
        }
    })
    const call = primaryType(model, property, definition)

    it('Should add primary keys & indexes to object settings', () => {
        expect(call).toMatchObject(response)
    })
})
