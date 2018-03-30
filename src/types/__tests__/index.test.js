import types from '../index'

describe('Types loader', () => {
    it('Load all types', () => {
        expect(types).toMatchObject({
            boolean: expect.anything(),
            date: expect.anything(),
            number: expect.anything(),
            hasmany: expect.anything(),
            belongsto: expect.anything(),
            required: expect.anything(),
            string: expect.anything(),
            unique: expect.anything(),
            index: expect.anything()
        })
    })
})