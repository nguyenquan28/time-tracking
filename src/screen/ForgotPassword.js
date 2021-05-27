import el from 'date-fns/esm/locale/el/index.js';
import React, { Component } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            errInput: ''
        }
    }

    // Handle email
    handleEmail = (text) => {
        // console.log(text);
        // Validate email
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (reg.test(text) === false) {
            // console.log("Email is Not Correct");
            this.setState({ email: '' })
            return false;
        }
        else {
            this.setState({ email: text })
            // console.log("Email is Correct");

        }
    }

    onSendCode = () => {
        if (this.state.email === '') {
            this.setState({ errInput: 'Enter your email' });
        } else {
            console.log(this.state.email)
            this.setState({ errInput: '' });
            // API
            fetch('https://time-tracking.dev.lekhanhtech.org/api/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({
                    email: this.state.email,
                }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    if (responseJson.message === "We have e-mailed your password reset link!") {
                        this.setState({ errInput: '' });
                        this.props.navigation.navigate('ResetPassword')
                    } else {
                        this.setState({ errInput: 'Please check your email' })
                    }
                    // this.setState(responseJson);
                })
                .catch((error) => {
                    //Hide Loader
                    // setLoading(false);
                    console.error(error);
                })
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.forgotPassArea}>
                    {/* Input */}
                    <Text style={styles.label}>
                        Enter your email
                    </Text>
                    <TextInput
                        ref="email"
                        onChangeText={this.handleEmail}
                        autoCapitalize="none"
                        style={styles.inputStyle}
                        keyboardType="email-address"
                        placeholder="Type your email"
                        placeholderTextColor="#E2E2E2"
                        underlineColorAndroid="#f000"
                        blurOnSubmit={false}
                        borderColor={!this.state.errInput ? '#707070' : 'red'}
                    />

                    {/* Error */}
                    <Text style={styles.errors}>{this.state.errInput}</Text>

                    {/* Text */}
                    <Text style={styles.text}>We will send a verify code to your email. Please check your email after click the “Next” button.</Text>

                    {/* Navigation button */}
                    <TouchableOpacity
                        style={styles.loginBtnStyle}
                        onPress={() => this.onSendCode()}
                    >
                        <Text style={styles.textBtn}>Next</Text>
                    </TouchableOpacity>

                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        flex: 1
    },

    forgotPassArea: {
        marginTop: 53,
        flex: 1,
        backgroundColor: '#FFFFFF'
    },

    label: {
        fontSize: 14,
        // fontFamily: 'inherit',
        fontWeight: "bold",
        marginHorizontal: 10,
        marginBottom: 8,
        color: '#404040'
    },

    inputStyle: {
        marginHorizontal: 10,
        fontSize: 16,
        height: 55,
        paddingLeft: 16,
        paddingTop: 6,
        paddingBottom: 6,
        borderRadius: 6,
        // fontFamily: 'inherit',
        borderStyle: 'solid',
        borderColor: '#707070',
        borderWidth: 1,
        marginBottom: 30
    },

    errors: {
        marginHorizontal: 10,
        marginTop: -20,
        fontSize: 14,
        fontStyle: "italic",
        color: 'red'
    },

    text: {
        marginHorizontal: 10,
        fontSize: 14,
        color: '#767676',
        marginBottom: 30
    },

    loginBtnStyle: {
        height: 60,
        borderRadius: 40,
        marginHorizontal: 50,
        backgroundColor: '#FF89C0',
        alignItems: 'center',
        justifyContent: 'center'
    },

    textBtn: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
})

export default ForgotPassword;