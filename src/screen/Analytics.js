import AsyncStorage from "@react-native-async-storage/async-storage";
import { Collapse, CollapseBody, CollapseHeader } from "accordion-collapse-react-native";
import { ListItem, Separator } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from "react-native-calendars";
import Icon from 'react-native-vector-icons/FontAwesome';

// Get month
const getCurrentMonth = () => {

    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    return { "month": month, "year": year }
}

// Get date
const getCurrentDate = (date, month, year) => {

    var day = (date > 9 ? "" : "0") + date
    var mnt = (month > 9 ? "" : "0") + month
    var year = year

    return year + '-' + mnt + '-' + day;//format: yyyy-mm-dd;
}

// Funtion calculate time woking
function toTimestamp(startDay, endDay) {
    var msDiff = new Date(endDay).getTime() - new Date(startDay).getTime();
    return days = Math.floor(msDiff / (1000 * 60));

}

// Get array date at month
const getArrData = (month, year) => {
    let TIME_TRACKING = []

    for (let i = 1; i <= 31; i++) {
        TIME_TRACKING.push(getCurrentDate(i, month, year))
    }
    // console.log(TIME_TRACKING);
    return TIME_TRACKING
}

// Main
const Analytics = () => {
    const [items, setItems] = useState();
    const [tokenPer, setTokenPer] = useState()
    const [permission, setPermission] = useState()
    const [totalLate, setTotalLate] = useState('0')
    const [totalOff, setTotalOff] = useState('0')
    const [noChecked, setNoChecked] = useState()
    const [totalNoChecked, setTotalNoChecked] = useState('0')
    const [lateTeam, setLateTeam] = useState()
    const [totalLateTeam, setTotalLateTeam] = useState('0')


    // Show day late and off personal
    const onShowTimeTracking = async (input) => {
        let arr = getArrData(input.month, input.year)
        let days = []
        let lates = {}
        let total = 0
        let times = []
        let offDay = []
        let dayTeam = []
        let lateTeam = []
        let noChecked = []

        // Fetch data day off
        const OFF_DAY = await fetch('https://time-tracking.dev.lekhanhtech.org/api/auth/time-tracking-absent',
            {
                method: 'POST',
                body: JSON.stringify({
                    arrayDay: arr
                }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + tokenPer,
                },
            })
            .then((response) => response.json())
            .then((responseJson) => {
                // console.log(responseJson[0]);
                offDay = responseJson[0]
            }).catch((error) => {
                // AsyncStorage.removeItem("@userToken");
                // DevSettings.reload()
                console.log(error);
            })
        // console.log(offDay);
        if (offDay) { setTotalOff(offDay.length) }
        if (offDay) {
            offDay.map((element) => {
                lates[element] = {
                    customStyles: {
                        container: {
                            opacity: 0
                        },
                        text: {
                            color: '#e0e0e0',
                        }
                    }
                }
            })

        }
        // Fetch data late
        const DATA = await fetch('https://time-tracking.dev.lekhanhtech.org/api/auth/time-tracking-first-day',
            {
                method: 'POST',
                body: JSON.stringify({
                    arrayDay: arr
                }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + tokenPer,
                },
            })
            .then((response) => response.json())
            .then((responseJson) => {
                // console.log(responseJson);
                if (responseJson) {
                    (Object.values(responseJson[0])).map((element) => {
                        if (element.mintime) {
                            return days.push(element.mintime.split(" "));
                        }
                    })
                }

            }).catch((error) => {
                // AsyncStorage.removeItem("@userToken");
                // DevSettings.reload()
                console.log(error);
            })

        // handling time 
        if (days) {
            days.map((element) => {
                // console.log(element[1]);
                times.push(element[1].split(":"))
            })
            for (let i = 0; i < days.length; i++) {
                days[i].push(times[i][0])
            }
        }

        // valid late
        if (days) {
            days.map((element) => {
                if (element[2] > 8) {
                    total++
                    lates[element[0]] = {
                        customStyles: {
                            container: {
                                borderColor: 'red',
                                borderWidth: 1
                            },
                            text: {
                                color: 'red',
                                fontWeight: 'bold'
                            }
                        }
                    }
                }
            })
        }
        // console.log(lates);
        setItems(lates)
        setTotalLate(total)

        // Fetch data team
        const TEAM = await fetch('https://time-tracking.dev.lekhanhtech.org/api/auth/absentOfGroup',
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + tokenPer,
                },
            })
            .then((response) => response.json())
            .then((responseJson) => {
                // console.log(responseJson);
                if (responseJson) {
                    responseJson.map((element) => {
                        dayTeam.push(Object.entries(element))
                    })
                }
            }).catch((error) => {
                // AsyncStorage.removeItem("@userToken");
                // DevSettings.reload()
                console.log(error);
            })

        if (dayTeam[0]) {
            dayTeam[0].map((element) => {
                if (element[1] === null) {
                    noChecked.push(element[0])
                } else {
                    lateTeam.push(element[0])
                }
            })
            // console.log(lateTeam);
            setLateTeam(lateTeam)
            setTotalLateTeam(lateTeam.length)
            setNoChecked(noChecked)
            setTotalNoChecked(noChecked.length)
        }
    }

    // Get auth
    const getAuthen = async () => {
        const user = await AsyncStorage.getItem("@userToken");
        const permission = await AsyncStorage.getItem("@permission");
        setPermission(permission)
        setTokenPer(user)
    }

    // Send email
    onPressEmail = email => {
        Linking.openURL(`mailto:${email}?subject=subject&body=body`).catch(err =>
            console.log('Error:', err)
        )
    }

    // render member
    const renderItem = (item) => {
        // console.log(item);
        if (item) {
            return item.map((element, index) => {
                // console.log(element);
                return <ListItem key={index} style={styles.listName}>
                    <Text style={styles.nameCollapse}>{element}</Text>
                </ListItem>

            })
        }
    }

    const renderTeamStt = (permission) => {
        if (permission) {
            return (<View>
                <Text style={styles.areaName}>
                    Team Status
                </Text>

                <Collapse>
                    <CollapseHeader style={[styles.headerCollapse, { borderColor: '#ffa500' }]}>
                        <View style={styles.titleCollapse}>
                            <Icon name='clock-o' size={35} color='#ffa500' />
                            <View style={styles.flexLayout}>
                                <Text style={styles.titleText}>LATE</Text>
                                <Text style={styles.textStyle}>Total member setLateTeam: {totalLateTeam}members</Text>
                            </View>
                        </View>
                    </CollapseHeader>
                    <CollapseBody>
                        {renderItem(lateTeam)}
                    </CollapseBody>
                </Collapse>

                <Collapse>
                    <CollapseHeader style={styles.headerCollapse}>
                        <View style={styles.titleCollapse}>
                            <Icon name='user-o' size={30} color='#ff5c7d' />

                            <View style={styles.flexLayout}>
                                <Text style={styles.titleText}>NO CHECKED</Text>
                                <Text style={styles.textStyle}>Total member no checked: {totalNoChecked}members</Text>
                            </View>
                        </View>
                    </CollapseHeader>
                    <CollapseBody>
                        {(renderItem(noChecked))}
                    </CollapseBody>
                </Collapse>

                <Separator />
            </View>)
        }
    }


    // lifecycle
    useEffect(() => {
        // Select curren month
        let today = getCurrentMonth()

        // Get authen
        getAuthen()

        // get data day and first checkin
        onShowTimeTracking(today)
        // console.log(items);
    }, [tokenPer])

    return (
        <SafeAreaView style={styles.safe}>
            {/* Calendar */}
            <Calendar
                markingType={'custom'}
                markedDates={
                    items
                }

                // Initially visible month. Default = Date()
                current={new Date()}
                // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                minDate={'2021-01-10'}
                // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                maxDate={new Date()}
                // Handler which gets executed on day press. Default = undefined
                onDayPress={day => {
                    console.log('selected day', day);
                }}
                onDayLongPress={(day) => { console.log('selected day', day) }}
                // Handler which gets executed when visible month changes in calendar. Default = undefined
                onMonthChange={(input) => onShowTimeTracking(input)}
                // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                onPressArrowLeft={subtractMonth => subtractMonth()}
                // Handler which gets executed when press arrow icon right. It receive a callback can go next month
                onPressArrowRight={addMonth => addMonth()}
                // Do not show days of other months in month page. Default = false
                hideExtraDays={true}
                // If hideArrows=false and hideExtraDays=false do not swich month when tapping on greyed out
                // day from another month that is visible in calendar page. Default = false
                disableMonthChange={true}
                // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                firstDay={1}
            />
            <ScrollView style={styles.contentArea}>

                <View>

                    {/* Late personal */}
                    <Text style={styles.areaName}>
                        Personal
                    </Text>
                    <Collapse>
                        <CollapseHeader style={[styles.headerCollapse, { borderColor: '#ffa500' }]}>
                            <View style={styles.titleCollapse}>
                                <Icon name='clock-o' size={35} color='#ffa500' />

                                <View style={styles.flexLayout}>
                                    <Text style={styles.titleText}>OFF</Text>
                                    <Text style={styles.textStyle}>Total day off: {totalLate}days</Text>
                                </View>

                            </View>

                        </CollapseHeader>

                    </Collapse>

                    {/* Off day */}
                    <Collapse>
                        <CollapseHeader style={[styles.headerCollapse, { borderColor: 'red' }]}>
                            <View style={styles.titleCollapse}>
                                <Icon name='calendar-times-o' size={30} color='red' />

                                <View style={styles.flexLayout}>
                                    <Text style={styles.titleText}>LATE</Text>
                                    <Text style={styles.textStyle}>Total day off: {totalOff}days</Text>
                                </View>
                            </View>
                        </CollapseHeader>
                    </Collapse>
                </View>

                {/* Team status */}
                {renderTeamStt(permission)}
            </ScrollView>

        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        marginBottom: 7
    },

    // Content
    contentArea: {
        borderColor: '#FF89C0',
        flex: 1,
        marginHorizontal: 10
    },

    areaName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: 5,
        borderTopColor: 'white',
        borderTopWidth: 2,
        paddingTop: 10
    },

    headerCollapse: {
        paddingLeft: 30,
        padding: 15,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: 'white',
        marginBottom: 10
    },

    titleCollapse: {
        flexDirection: "row",
    },

    titleText: {
        marginTop: -3,
        marginLeft: 10,
        fontSize: 15,
        fontWeight: "bold"
    },

    textStyle: {
        fontSize: 14,
        marginLeft: 10
    },

    flexLayout: {
        flexDirection: "column",
        marginLeft: 10
    },

    listName: {
        marginTop: -7,
        marginLeft: -5,
        backgroundColor: 'white',
        borderRadius: 10
    },

    nameCollapse: {
        fontSize: 14,
        paddingLeft: 20

    }
});

export default Analytics;