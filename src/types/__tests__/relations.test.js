import { clone } from '../../helper/util'
import relationType from '../relations'

const modelMock = {
    properties: {},
    validations: [],
    relations: []
}

const propertyMock = {
    name: 'testProperty',
    type: 'hasMany',
    target: 'entity'
}

const definitionMock = {}

describe('Data Type: Relations', () => {
    it('Should add a hasMany relation to the model', () => {
        const model = clone(modelMock)
        const property = clone(propertyMock)
        const definition = clone(definitionMock)
        const call = relationType(model, property, definition)
        const response = clone(model, {
            relations: [
                [
                    'hasMany',
                    property.target,
                    {
                        as: property.name,
                        foreignKey: `${model.name}Id`
                    }
                ]
            ]
        })

        expect(call).toMatchObject(response)
    })

    it('Should add a belongsTo relation to the model', () => {
        const model = clone(modelMock)
        const property = clone(propertyMock, { type: 'belongsTo' })
        const definition = clone(definitionMock)
        const call = relationType(model, property, definition)
        const response = clone(model, {
            relations: [
                [
                    'belongsTo',
                    property.target,
                    {
                        as: property.name,
                        foreignKey: `${property.target}Id`
                    }
                ]
            ]
        })

        expect(call).toMatchObject(response)
    })
})
