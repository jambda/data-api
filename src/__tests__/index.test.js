'use strict'

import fs from 'fs'
import yaml from 'yamljs'
import entityBuilder from '../index'

const config = yaml.parse(String(fs.readFileSync('src/__mocks__/config.yml')))
const app = {
    router: {}
}
const entity = 'user'
const filterStack = (entity, path) =>
    app.router[`/${entity}`].stack.filter(layer => layer.route.path === path)[0]
        .route

app.use = jest.fn((path, router) => {
    app.router[path] = router
})

describe('Entity Builder', () => {
    beforeAll(async () => {
        return entityBuilder(app, config.database)
    })

    it('Should add one route per model to the app instance', async () => {
        const paths = Object.keys(app.router)
        expect(Object.keys(app.router)).toHaveLength(2)
        expect(paths).toMatchObject(['/post', '/user'])
    })

    it('Should add each model to the Schema object', () => {
        expect(Object.keys(app.schema.models)).toHaveLength(2)
        expect(app.schema.models[entity].modelName).toEqual(entity)
    })

    it('Should add correct properties to model', () => {
        expect(
            Object.keys(app.schema.definitions[entity].properties).sort()
        ).toMatchObject(
            [
                'active',
                'validated',
                'name',
                'username',
                'email',
                'password',
                'created',
                'id'
            ].sort()
        )
    })

    it('Should add relations', () => {
        expect(Object.keys(app.schema.models['user'].relations)).toContain(
            'posts'
        )
        expect(Object.keys(app.schema.models['post'].relations)).toContain(
            'user'
        )
    })

    it('Should have created GET & POST routes', () => {
        expect(filterStack(entity, '/').methods).toMatchObject({
            get: true,
            post: true
        })
    })

    it('Should have created PUT, PATCH & DELETE routes', () => {
        expect(filterStack(entity, '/:id').methods).toMatchObject({
            put: true,
            patch: true,
            delete: true
        })
    })

    it('Should have created COUNT route', () => {
        expect(filterStack(entity, '/count').methods).toMatchObject({
            get: true
        })
    })

    it('Should have created NEW route', () => {
        expect(filterStack(entity, '/new').methods).toMatchObject({
            post: true
        })
    })
})
