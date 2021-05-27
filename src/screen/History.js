import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from 'react';
import { DevSettings, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Agenda } from 'react-native-calendars';

// New data
let TIME_TRACKING = []

// Funtion calculate time woking
function toTimestamp(startDay, endDay) {
    var msDiff = new Date(endDay).getTime() - new Date(startDay).getTime();
    console.log('st ' + new Date(endDay).getTime());
    console.log(' end ' + new Date(startDay).getTime());
    console.log('day: ' + Math.floor(msDiff / (1000 * 60)));
    return Math.floor(msDiff / (1000 * 60))

}

// Get date
const getCurrentDate = () => {

    var date = new Date().getDate();
    var day = (date > 9 ? "" : "0") + date
    var month = new Date().getMonth() + 1;
    var mnt = (month > 9 ? "" : "0") + month
    var year = new Date().getFullYear();

    return year + '-' + mnt + '-' + day;//format: yyyy-mm-dd;
}

// Main
const History = () => {
    const [items, setItems] = useState({});
    const [totalTime, setTotalTime] = useState('0')
    const [tokenPer, setTokenPer] = useState()

    // function get data
    const onShowTimeTracking = async (day) => {
        // console.log(day);
        // console.log(tokenPer);
        let total = 0
        const DATA = await fetch('https://time-tracking.dev.lekhanhtech.org/api/auth/time-tracking-by-day/' + day,
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
                return TIME_TRACKING = responseJson
            }).catch((error) => {
                AsyncStorage.removeItem("@userToken");
                DevSettings.reload()
            })
        console.log(DATA[day])
        setItems(DATA)
        // console.log(DATA["2021-05-19"]);
        if (DATA[day]) {
            DATA[day].forEach(element => {
                if (element.type === 2) {
                    // console.log(element);
                    // console.log(element.reference);
                    console.log(total +=
                        toTimestamp(element.refevence, element.time)
                    )
                }
            });
        }
        setTotalTime(total)
        console.log(total);
    }

    // Get auth
    const getAuthen = async () => {
        const user = await AsyncStorage.getItem("@userToken");
        setTokenPer(user)
    }

    // lifecycle
    useEffect(() => {
        getAuthen()
        // Fetch data to serve
        let day_pick = getCurrentDate()
        // console.log(day_pick);
        onShowTimeTracking(day_pick, tokenPer)
        // console.log(items);
    }, [tokenPer])

    // Render Item
    const renderItem = (item) => {
        let timeLocal = item.time
        return (
            <View style={[styles.itemContainer, { borderColor: item.type === 2 ? '#ffa500' : '#50cebb' }]}>
                <Text style={[styles.titleItem, { color: item.type === 2 ? '#ffa500' : '#50cebb' }]}>{(item.type === 2) ? "Check out" : "Check in"}</Text>
                <Text style={styles.timeItem}>{timeLocal}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.areaTotalTime}>
                {/* {console.log(items)} */}
                <Text style={[styles.totalTime, { color: Math.floor(totalTime / 60) > 8 ? '#00adf5' : 'red' }]}>
                    Total hours worked : {Math.floor(totalTime / 60)}h {totalTime % 60}'
                </Text>
            </View>
            <Agenda
                items={items}
                renderItem={renderItem}
                maxDate={new Date()}
                minDate={'2021-01-10'}
                onDayPress={(day) => { onShowTimeTracking(day.dateString) }}
                theme={{
                    selectedDayBackgroundColor: '#FF89C0',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#FF89C0',
                    dayTextColor: '#FF89C0',
                    dotColor: '#FF89C0',
                    selectedDotColor: '#ffffff',
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: {
        flex: 1,
    },

    itemContainer: {
        height: 70,
        backgroundColor: 'white',
        margin: 3,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        borderWidth: 1,
        marginRight: 10
    },

    areaTotalTime: {
        padding: 20
    },

    totalTime: {
        alignSelf: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },

    titleItem: {
        fontSize: 16,
        fontWeight: 'bold',

    }
});

export default History;