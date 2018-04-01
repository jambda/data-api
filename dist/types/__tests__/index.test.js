'use strict';

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Types loader', () => {
    it('Load all types', () => {
        expect(_index2.default).toMatchObject({
            boolean: expect.anything(),
            date: expect.anything(),
            number: expect.anything(),
            hasmany: expect.anything(),
            belongsto: expect.anything(),
            required: expect.anything(),
            string: expect.anything(),
            unique: expect.anything(),
            index: expect.anything()
        });
    });
});