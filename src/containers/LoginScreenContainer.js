import { connect } from 'react-redux'
import { Login } from '../components/Login.js'
import {
    setToken
} from '../store/actions/index'

function onSetToken(dispatch, token) {
    dispatch(setToken(token))
}

const mapStateToProps = (state) => ({
    token: state.login.token
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSetToken: (token) => onSetToken(dispatch, token)
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login)