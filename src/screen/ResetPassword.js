import { startOfToday } from 'date-fns';
import React, { Component } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationActions } from 'react-navigation';

class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newPass: '',
            reNewPass: '',
            verifyCode: '',
            errNewPass: '',
            errNewPass: '',
            errReNewPass: '',
            errVerify: ''
        }
    }


    handlePassword = (text) => {
        if (text.length > 6) {
            // console.log('true 1');
            this.setState({
                newPass: text.replace(/\s/g, ''),
                errNewPass: ''
            })
        } else {
            // console.log('err 1');
            this.setState({ newPass: '', errNewPass: 'Password is only 6 characters long' });
        }

    };

    handleRePassword = (text) => {
        console.log(this.state.newPass);
        if (this.state.newPass === text) {
            // console.log('true 2');
            this.setState({ reNewPass: text, errReNewPass: '' });
        } else {
            // console.log('err2');
            this.setState({ reNewPass: '', errReNewPass: 'Retype your password must be same your password' });
        }
    };

    handleVerifyCode = (text) => {
        if (text.length == 6) {
            // console.log('true 3');
            this.setState({ verifyCode: text, errVerify: '' });
        } else {
            // console.log('err 3');
            this.setState({ verifyCode: '', errVerify: 'Verify code not enough' });
        }

    };

    onChangPassword = (navigation) => {
        if (!this.state.newPass || !this.state.reNewPass || !this.state.verifyCode) {
            this.setState({
                errNewPass: 'Password is only 6 characters long',
                errReNewPass: 'Retype your password must be same your password',
                errVerify: 'Verify code have 6 character'

            });
        } else {

            // Fetch Data 
            fetch('https://time-tracking.dev.lekhanhtech.org/api/auth/reset-password/' + this.state.verifyCode,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        password: this.state.newPass
                    }),
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => response.json())
                .then((responseJson) => {

                    //Check reponse 
                    if (responseJson.success) {
                        this.setState({ errVerify: "" });
                        Alert.alert("", "Password have been reset successfull. Please login again", [
                            {
                                text: 'OK', onPress: (navigation) => this.props.navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Login' }],
                                })
                            }
                        ])
                    } else {
                        this.setState({ errVerify: "Check your varify code" });
                    }

                }).catch((error) => {
                    console.log(error)
                })
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.forgotPassArea}>
                    {/* Input */}
                    <Text style={styles.label}>
                        Enter your password
                    </Text>
                    <TextInput
                        onChangeText={this.handlePassword}
                        autoCapitalize="none"
                        keyboardType="default"
                        style={styles.inputStyle}
                        secureTextEntry={true}
                        blurOnSubmit={false}
                        placeholder="*******"
                        placeholderTextColor="#E2E2E2"
                        borderColor={!this.state.errNewPass ? '#707070' : 'red'}
                    />
                    {/* Error */}
                    <Text style={styles.errors}>{this.state.errNewPass}</Text>

                    {/* Input */}
                    <Text style={styles.label}>
                        Retype your password
                    </Text>
                    <TextInput
                        onChangeText={this.handleRePassword}
                        autoCapitalize="none"
                        keyboardType="default"
                        style={styles.inputStyle}
                        secureTextEntry={true}
                        blurOnSubmit={false}
                        placeholder="*******"
                        placeholderTextColor="#E2E2E2"
                        borderColor={!this.state.errReNewPass ? '#707070' : 'red'}
                    />
                    {/* Error */}
                    <Text style={styles.errors}>{this.state.errReNewPass}</Text>

                    {/* Input */}
                    <Text style={styles.label}>
                        Verify code
                    </Text>
                    <TextInput
                        onChangeText={this.handleVerifyCode}
                        autoCapitalize="none"
                        keyboardType="default"
                        style={styles.inputStyle}
                        blurOnSubmit={false}
                        placeholder="AD5FGE"
                        placeholderTextColor="#E2E2E2"
                        borderColor={!this.state.errVerify ? '#707070' : 'red'}
                    />
                    {/* Error */}
                    <Text style={styles.errors}>{this.state.errVerify}</Text>

                    {/* Navigation button */}
                    <TouchableOpacity
                        style={styles.loginBtnStyle}
                        onPress={() => this.onChangPassword()}
                    >
                        <Text style={styles.textBtn}>Done</Text>
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
        // flex: 1
    },

    forgotPassArea: {
        marginTop: 53,
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

    text: {
        marginHorizontal: 10,
        fontSize: 14,
        color: '#767676',
        marginBottom: 30
    },

    errors: {
        marginHorizontal: 10,
        marginTop: -20,
        fontSize: 14,
        fontStyle: "italic",
        color: 'red'
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

export default ResetPassword;