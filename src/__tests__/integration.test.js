import fs from 'fs'
import yaml from 'yamljs'
import express from 'express'
import bodyParser from 'body-parser'
import request from 'supertest'
import error from '../__mocks__/error'
import { clone } from '../helper/util'
import posts from '../__mocks__/data/posts.json'
import user from '../__mocks__/data/user.json'
import { registerRoutes } from './../index'

const config = yaml.parse(String(fs.readFileSync('src/__mocks__/config.yml')))
const application = express()
application.use(bodyParser.json())
application.use(bodyParser.urlencoded({ extended: true }))

let id, record

describe('Resource Routes:', function() {
    beforeAll(async () => {
        await registerRoutes(application, config.database)
        return application.use(error)
    })

    it('should get a new resource', function(done) {
        const testUser = clone(user)
        request(application)
            .post('/user/new')
            .send(testUser)
            .set('Accept', 'application/json')
            .expect(200)
            .then(res => {
                expect(Object.keys(res.body).sort()).toMatchObject(
                    Object.keys(testUser).sort()
                )
                record = res.body
                done()
            })
            .catch(done)
    })

    it('should create a new resource', function(done) {
        const testUser = clone(user)
        request(application)
            .post('/user')
            .send(testUser)
            .set('Accept', 'application/json')
            .expect(200)
            .then(res => {
                testUser.id = res.body.id
                expect(res.body).toMatchObject(testUser)

                id = res.body.id
                record = res.body

                posts.forEach(post => {
                    post.userId = id
                })
                done()
            })
            .catch(done)
    })

    it('should create resources by bulk', function(done) {
        request(application)
            .post('/post/bulk')
            .send(posts)
            .set('Accept', 'application/json')
            .expect(200)
            .then(res => {
                expect(res.body).toHaveLength(5)
                const response = posts.map(post => {
                    post.id = expect.anything()
                    return post
                })
                expect(res.body).toMatchObject(response)
                done()
            })
            .catch(done)
    })

    it('should not allow duplicated data (email, username)', function(done) {
        const duplicatedData = clone(record)
        delete duplicatedData.id

        request(application)
            .post('/user')
            .send(duplicatedData)
            .set('Accept', 'application/json')
            .expect(422)
            .then(res => {
                expect(res.body).toHaveProperty('error')
                expect(res.body.error).toEqual('Unprocessable Entity')
                expect(res.body).toHaveProperty('data')
                expect(res.body.data).toHaveProperty('email')
                expect(res.body.data).toHaveProperty('username')

                done()
            })
            .catch(done)
    })

    it('should list all resources', function(done) {
        request(application)
            .get('/user')
            .set('Accept', 'application/json')
            .expect(200)
            .then(res => {
                expect(res.body.length).toBeGreaterThan(0)
                done()
            })
            .catch(done)
    })

    it('should count all resources', function(done) {
        request(application)
            .get('/user/count')
            .set('Accept', 'application/json')
            .expect(200)
            .then(res => {
                expect(res.body).toBeInstanceOf(Object)
                expect(res.body).toHaveProperty('count')
                expect(res.body.count).toBeGreaterThan(0)

                done()
            })
            .catch(done)
    })

    it('should get a single resource', function(done) {
        request(application)
            .get('/user/' + id)
            .set('Accept', 'application/json')
            .expect(200)
            .then(res => {
                expect(res.body).toBeInstanceOf(Object)
                expect(res.body).toHaveProperty('id')

                record = res.body
                done()
            })
            .catch(done)
    })

    it('should get all posts by userId', function(done) {
        request(application)
            .get('/post')
            .send({ userId: id })
            .set('Accept', 'application/json')
            .expect(200)
            .then(res => {
                expect(res.body).toBeInstanceOf(Object)
                expect(res.body).toHaveLength(5)

                done()
            })
            .catch(done)
    })

    it('should patch a resource', function(done) {
        const NEW_TITLE = 'User Name Updated'

        request(application)
            .patch('/user/' + id)
            .set('Accept', 'application/json')
            .send({ name: NEW_TITLE })
            .expect(200)
            .then(res => {
                expect(res.body).toBeInstanceOf(Object)
                expect(res.body).toHaveProperty('id')
                expect(res.body).toHaveProperty('name')
                expect(res.body.name).toEqual(NEW_TITLE)

                done()
            })
            .catch(done)
    })

    it('should put a resource', function(done) {
        const putUserData = clone(record, {
            name: 'Put Test'
        })
        delete putUserData.id

        request(application)
            .put('/user/' + id)
            .set('Accept', 'application/json')
            .send(putUserData)
            .expect(200)
            .then(res => {
                putUserData.id = res.body.id
                expect(res.body).toMatchObject(putUserData)
                done()
            })
            .catch(done)
    })

    it('should delete a resource', function(done) {
        request(application)
            .delete('/user/' + id)
            .set('Accept', 'application/json')
            .expect(204)
            .then(res => {
                expect(res.body).toEqual({})

                done()
            })
            .catch(done)
    })
})
