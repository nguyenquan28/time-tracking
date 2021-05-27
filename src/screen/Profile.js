import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from 'react';
import { Button, DevSettings, Image, ImageBackground, Linking, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import RenderInfo from "../components/RenderInfo";
import ImagePicker from 'react-native-image-crop-picker';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import Modal from 'react-native-modal';
import ShowInput from "../components/ShowInput";
import { CommonActions } from "@react-navigation/routers";

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            setImage: false,
            imageBackground: 'https://preview.redd.it/0m23brk4iqj51.png?width=823&format=png&auto=webp&s=51f517f0e537f3cf6f18a3afe3972471d7b3db18',
            image: null,
            name: '',
            describe: '',
            gender: '',
            phoneNumber: '',
            email: '',
            address: '',
            identifyNumber: '',
            birthday: '',
            isModalVisible: false,
            error: '',
            userToken: ''
        }
    }

    // Set token to state
    async getTokenAsync() {
        const user = await AsyncStorage.getItem("@userToken");
        this.setState({ userToken: user });
        // console.log(this.state.userToken);
    }

    // Select data from API
    async componentDidMount() {
        await this.getTokenAsync()
        fetch('https://time-tracking.dev.lekhanhtech.org/api/auth/profile-staff',
            {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + this.state.userToken,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'A=1&B=2'

            })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    image: responseJson[0].image,
                    name: responseJson[0].name,
                    describe: responseJson[0].intro,
                    gender: responseJson[0].gender,
                    phoneNumber: responseJson[0].phone,
                    email: responseJson[0].email,
                    address: responseJson[0].address,
                    identifyNumber: responseJson[0].identifynumber,
                    birthday: responseJson[0].dob,
                });

                // }

            }).catch((error) => {
                AsyncStorage.removeItem("@userToken");
                DevSettings.reload()
            })
    }

    // Picker image
    setImage = (text) => {
        this.setState({ image: text });
        console.log(this.state.image);
        this.fetchData()
    }

    // Take photo from camera
    takePhotoFromCamera = () => {
        try {
            ImagePicker.openCamera({
                compressImageMaxWidth: 300,
                compressImageMaxHeight: 300,
                cropping: true,
                compressImageQuality: 0.7
            }).then(image => {
                console.log(image);
                this.setImage(image.path);
                this.bs.current.snapTo(1);
            });
        } catch (error) {
            console.log(error);
        }
    }

    // Take photo from library
    choosePhotoFromLibrary = () => {
        try {
            ImagePicker.openPicker({
                width: 300,
                height: 300,
                cropping: true,
                compressImageQuality: 0.7
            }).then(image => {
                console.log(image);
                this.setImage(image.path);
                this.bs.current.snapTo(1);
            });
        } catch (error) {
            console.log(error);
        }
    }

    // render bottom slide 
    renderInner = () => (
        <View style={styles.panel}>
            <View style={{ alignItems: 'center' }}>
                <Text style={styles.panelTitle}>Upload Photo</Text>
                <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
            </View>
            <TouchableOpacity style={styles.panelButton} onPress={this.takePhotoFromCamera}>
                <Text style={styles.panelButtonTitle}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.panelButton} onPress={this.choosePhotoFromLibrary}>
                <Text style={styles.panelButtonTitle}>Choose From Library</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.panelButton}
                onPress={() => this.bs.current.snapTo(1)}>
                <Text style={styles.panelButtonTitle}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );

    // Render header slide
    renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.panelHeader}>
                <View style={styles.panelHandle} />
            </View>
        </View>
    );

    // Set modal
    setModalVisible = (visible) => {
        this.setState({ isModalVisible: visible });
    }

    // Clone modal change info
    close = () => this.setState({ isModalVisible: false });

    bs = React.createRef();
    fall = new Animated.Value(1);

    // log out 
    onLogOut = (navigation) => {
        try {
            AsyncStorage.removeItem("@userToken");
            this.props.navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
            // DevSettings.reload()
        } catch (e) {
            console.log(e);
        }
    }

    // Change info user
    onChagne = (key, text, error) => {
        // console.log(key, text);
        if (!error) {
            this.setState({
                [key]: text,
                error: ''
            });
        } else {
            this.setState({
                [key]: text,
                error: error
            });
        }
    }

    // Fetch data to serve
    fetchData = async () => {
        let data = {
            image: this.state.image,
            name: this.state.name,
            dob: this.state.birthday,
            gender: this.state.gender,
            phone: this.state.phoneNumber,
            address: this.state.address,
            intro: this.state.describe,
            identifynumber: this.state.identifyNumber
        }
        console.log(data);
        fetch('https://time-tracking.dev.lekhanhtech.org/api/auth/save-profile',
            {
                method: 'POST',
                body: JSON.stringify(data)
                ,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.state.userToken,
                },
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
            }).catch((error) => {
                console.log(error)
            })
    }

    // On send API
    handleChange = () => {
        if (!this.state.error) {
            this.fetchData()
            this.setState({ isModalVisible: false });
            // console.log(this.state);

        } else {
            this.setState({ isModalVisible: true });
        }
    }

    onPressgender = () => {
        console.log('gender');
    }
    onPressPlace = () => {
        console.log('place')
    }

    onPressTel = number => {
        Linking.openURL(`tel:${number}`).catch(err => console.log('Error:', err))
    }

    onPressEmail = email => {
        Linking.openURL(`mailto:${email}?subject=subject&body=body`).catch(err =>
            console.log('Error:', err)
        )
    }

    render() {

        const { isModalVisible } = this.state;
        return (
            <ScrollView style={styles.scroll}>
                <View style={styles.container}>
                    <View containerStyle={styles.cardContainer}>
                        {/* Avatar */}
                        <View style={styles.headerContainer}>
                            <ImageBackground
                                style={styles.headerBackgroundImage}
                                blurRadius={10}
                                source={{
                                    uri: this.state.imageBackground,
                                }}
                            >
                                <View style={styles.headerColumn}>
                                    <View style={styles.containerChangeAvt}>
                                        <View
                                            style={{
                                                flex: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                position: "absolute",
                                                top: 150,
                                                left: 90,
                                                zIndex: +1
                                            }}>
                                            <Icon
                                                name="camera"
                                                size={30}
                                                color="#fff"
                                                style={{
                                                    opacity: 0.7,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderWidth: 1,
                                                    borderColor: '#fff',
                                                    borderRadius: 5,
                                                }}
                                                onPress={() => this.bs.current.snapTo(0)}
                                            />
                                        </View>
                                        {/* Avatar */}
                                        <Animated.View style={{
                                            margin: 20,
                                            opacity: Animated.add(0.1, Animated.multiply(this.fall, 1.0)),
                                        }}>
                                            <TouchableOpacity onPress={() => this.bs.current.snapTo(0)}>
                                                <Image
                                                    onPress={() => this.setState({ statusAvt: true })}
                                                    style={styles.userImage}
                                                    source={{
                                                        uri: this.state.image,
                                                    }}
                                                />
                                            </TouchableOpacity>
                                        </Animated.View>
                                    </View>

                                    {/* Name */}
                                    <TouchableOpacity onPress={() => this.onChagne()}>
                                        <Text style={styles.userNameText}>{this.state.name}</Text>
                                    </TouchableOpacity>

                                    {/* Describe */}
                                    <View style={styles.userDescribeRow}>
                                        <View>
                                            <Icon
                                                name="audio-description"
                                                color='#FF89C0'
                                                iconStyle={styles.placeIcon}
                                                onPress={this.onPressPlace}
                                                size={20}
                                            />
                                        </View>
                                        <View style={styles.userDescripRow}>
                                            <TouchableOpacity onPress={() => this.onChagne()}>
                                                <Text style={styles.userDescripText}>
                                                    {this.state.describe}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>

                                {/* Log out */}
                                <View style={styles.signOutIcon}>
                                    <TouchableOpacity onPress={() => this.onLogOut()}>
                                        <Icon name='sign-out' color='#dddddd' size={25} />
                                    </TouchableOpacity>
                                </View>

                                {/* Change infomaiton user */}
                                <View style={styles.changeInfoIcon}>
                                    <TouchableOpacity onPress={() => this.setModalVisible(true)}>
                                        <Icon name='sliders' color='#dddddd' size={25} />
                                    </TouchableOpacity>
                                </View>
                            </ImageBackground>
                        </View>

                        {/* Tel */}
                        <RenderInfo func={this.onPressTel} nameIcon={'phone-square'} info={this.state.phoneNumber} />

                        {/* Email */}
                        <RenderInfo func={this.onPressEmail} nameIcon={'envelope'} info={this.state.email} />

                        {/* Address */}
                        <RenderInfo func={this.onPressPlace} nameIcon={'map-marker'} info={this.state.address} />

                        {/* CMND */}
                        <RenderInfo func={this.onPressPlace} nameIcon={'id-card-o'} info={this.state.identifyNumber} />

                        {/* gender */}
                        <RenderInfo func={this.onPressgender} nameIcon={'venus-mars'} info={(this.state.gender) ? "Man" : "Woman"} />

                        {/* Birthday */}
                        <RenderInfo func={this.onPressPlace} nameIcon={'birthday-cake'} info={this.state.birthday} />

                        {/* Modal */}
                        <View style={styles.centeredView}>
                            <Modal
                                testID={'modal'}
                                isVisible={this.state.isModalVisible}
                                onSwipeComplete={this.close}
                                swipeDirection={['up', 'left', 'right', 'down']}
                            >
                                <View style={styles.modalView}>
                                    <Text style={styles.titleModal}>Edit information </Text>
                                    <ShowInput
                                        title={'Name'}
                                        name={'name'}
                                        func={(key, text, error) => this.onChagne(key, text, error)}
                                        defaultValue={this.state.name} />

                                    <ShowInput title={'Describe'}
                                        name={'describe'}
                                        func={(key, text, error) => this.onChagne(key, text, error)}
                                        defaultValue={this.state.describe} />

                                    <ShowInput
                                        title={'PhoneNumber'}
                                        name={'phoneNumber'}
                                        func={(key, text, error) => this.onChagne(key, text, error)}
                                        defaultValue={this.state.phoneNumber} />

                                    <ShowInput
                                        title={'Email'}
                                        name={'email'}
                                        func={(key, text, error) => this.onChagne(key, text, error)}
                                        defaultValue={this.state.email} />

                                    <ShowInput
                                        title={'Address'}
                                        name={'address'}
                                        func={(key, text, error) => this.onChagne(key, text, error)}
                                        defaultValue={this.state.address} />

                                    <ShowInput
                                        title={'Card ID'}
                                        name={'identifyNumber'}
                                        func={(key, text, error) => this.onChagne(key, text, error)}
                                        defaultValue={this.state.identifyNumber} />

                                    <ShowInput
                                        title={'Birthday'}
                                        name={'birthday'}
                                        func={(key, text, error) => this.onChagne(key, text, error)}
                                        defaultValue={this.state.birthday} />

                                    <TouchableOpacity style={styles.btn} onPress={() => this.handleChange()}>
                                        <Text style={styles.textBtn}> SAVE</Text>
                                    </TouchableOpacity>
                                </View>
                            </Modal>
                        </View>

                        {/* Show option change avt */}
                        <BottomSheet
                            ref={this.bs}
                            snapPoints={[330, 0]}
                            renderContent={this.renderInner}
                            renderHeader={this.renderHeader}
                            initialSnap={1}
                            callbackNode={this.fall}
                            enabledGestureInteraction={true}
                        />
                    </View>

                </View>
            </ScrollView >
        );
    }
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#FFF',
        borderWidth: 0,
        flex: 1,
        margin: 0,
        padding: 0,
    },
    container: {
        flex: 1,
    },
    emailContainer: {
        backgroundColor: '#01C89E',
        flex: 1,
        paddingTop: 30,
    },
    headerBackgroundImage: {
        paddingBottom: 20,
        paddingTop: 35,
    },
    headerContainer: {},
    headerColumn: {
        backgroundColor: 'transparent',
        ...Platform.select({
            ios: {
                alignItems: 'center',
                elevation: 1,
                marginTop: -1,
            },
            android: {
                alignItems: 'center',
            },
        }),
    },
    placeIcon: {
        color: 'white',
        fontSize: 26,
    },
    scroll: {
        backgroundColor: '#FFF',
    },
    userDescribeRow: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    userDescripRow: {
        marginLeft: 5,
        backgroundColor: 'transparent',
    },
    userDescripText: {
        color: '#A5A5A5',
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
    },
    userImage: {
        position: "relative",
        borderColor: '#fff',
        borderRadius: 85,
        borderWidth: 3,
        height: 170,
        marginBottom: 15,
        width: 170,
    },
    userNameText: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: 'bold',
        paddingBottom: 8,
        textAlign: 'center',
    },
    signOutIcon: {
        position: "absolute",
        top: 15,
        right: 15,
    },
    changeInfoIcon: {
        position: "absolute",
        top: 15,
        left: 15
    },
    containerChangeAvt: {
        flex: 1
    },
    commandButton: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#FF6347',
        alignItems: 'center',
        marginTop: 10,
    },
    panel: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 5,
        shadowOpacity: 0.4,
    },
    header: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#333333',
        shadowOffset: { width: -1, height: -3 },
        shadowRadius: 2,
        shadowOpacity: 0.4,
        // elevation: 5,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    panelHeader: {
        alignItems: 'center',
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
    },
    panelTitle: {
        fontSize: 27,
        height: 35,
    },
    panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        height: 30,
        marginBottom: 10,
    },
    panelButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: '#FF89C0',
        alignItems: 'center',
        marginVertical: 7,
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5,
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },

    // Modal
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        marginTop: 10,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    btn: {
        backgroundColor: "#FF89C0",
        borderRadius: 5,
        padding: 10,
        elevation: 2,
        marginHorizontal: 10,
    },
    titleModal: {
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10
    },
    textBtn: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: "center"
    },

    errors: {
        marginHorizontal: 10,
        marginTop: -20,
        fontSize: 14,
        fontStyle: "italic",
        color: 'red'
    },
})

export default Profile;