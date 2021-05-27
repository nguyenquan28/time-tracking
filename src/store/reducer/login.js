import { handleActions } from 'redux-actions'
import initState from '../initState'
import { setToken } from '../actions'

export default handleActions({
  [setToken]: (state, { payload: { token } }) => ({
    ...state,
    token: token

  })

}, initState.login)