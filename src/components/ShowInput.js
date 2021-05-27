import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

class ShowInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valueInput: '',
            err: ''
        }
    }

    handleTextChange = async (newText) => {
        if (!newText) {
            await this.setState({ err: 'Input not empty' })
            this.props.func(this.props.name, this.state.valueInput, this.state.err)
        } else {
            await this.setState({ valueInput: newText, err: '' });
            this.props.func(this.props.name, this.state.valueInput, this.state.err)
        }

    }

    render() {
        return (
            <View>
                <Text style={styles.title}>{this.props.title}</Text>
                <TextInput
                    onChangeText={this.handleTextChange}
                    autoCapitalize="none"
                    style={styles.inputStyle}
                    // value={this.props.defaultValue}
                    defaultValue={this.props.defaultValue}
                    placeholderTextColor="#E2E2E2"
                    underlineColorAndroid="#f000"
                    blurOnSubmit={false}
                    borderColor={!this.state.err ? '#707070' : 'red'}
                />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    inputStyle: {
        marginHorizontal: 10,
        fontSize: 16,
        height: 50,
        paddingTop: 6,
        paddingBottom: 6,
        borderRadius: 6,
        // fontFamily: 'inherit',
        borderStyle: "solid",
        borderColor: "#707070",
        borderWidth: 1,
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        marginLeft: 10,
        fontWeight: 'bold'
    },
})

export default ShowInput;