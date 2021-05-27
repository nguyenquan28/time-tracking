import { createActions } from 'redux-actions'

const {
    setToken
} = createActions({
    SET_TOKEN: (token) => ({ token })
}, {
    prefix: 'login'
})

export {
    setToken
}