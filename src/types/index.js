import stringType from './string'
import numberType from './number'
import relationsType from './relations'
import requiredType from './required'
import uniqueType from './unique'
import booleanType from './boolean'
import dateType from './date'
import primaryType from './primary'
import index from './indexColumn'

export default {
    string: stringType,
    number: numberType,
    hasmany: relationsType,
    belongsto: relationsType,
    required: requiredType,
    unique: uniqueType,
    boolean: booleanType,
    date: dateType,
    primary: primaryType,
    index: index
}
