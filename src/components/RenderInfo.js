import React, { Component } from 'react';
import { ImageBackground, Text, View, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Separator from './Separator';
class RenderInfo extends Component {

    onChagne = () => {
        console.log('hello');
    }

    render() {
        return (
            <>
                <View style={styles.containerTel}>
                    <View style={styles.iconRow}>
                        <Icon
                            name={this.props.nameIcon}
                            color="#FF89C0"
                            underlayColor="transparent"
                            onPress={() => this.props.func()}
                            size={28}
                        />
                    </View>
                    <View style={styles.telRow}>
                        <View style={styles.telNumberColumn}>
                            {/* <TouchableOpacity onPress={() => this.onChagne()}> */}
                            <Text style={styles.telNumberText}>{this.props.info}</Text>
                            {/* </TouchableOpacity> */}
                        </View>
                    </View>
                    {/* <View style={styles.smsRow}>
                            <Icon
                                name="cogs"
                                underlayColor="transparent"
                                onPress={() => this.props.func()}
                                size={20}
                            />
                        </View> */}
                </View>
                { Separator()}
            </>
        );
    }
}
const styles = StyleSheet.create({
    // Tel
    containerTel: {
        flexDirection: 'row',
        justifyContent: "center",
        marginBottom: 20,
        backgroundColor: '#FFF',
        flex: 1,
        paddingTop: 20,
    },
    iconRow: {
        flex: 2,
        alignItems: "center"
    },
    telNumberColumn: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    telNumberText: {
        fontSize: 18,
    },
    telRow: {
        flex: 6,
        flexDirection: 'column',
        justifyContent: 'center',
    },
})
export default RenderInfo;