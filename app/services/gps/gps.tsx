import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, Button, ViewStyle } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { colors, spacing } from "../../theme";
import { color } from 'react-native-reanimated';

export default function WatchPosition({setSpeedForColor, targetSpeed}) {
  const [position, setPosition] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<number | null>(null);
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [averageSpeed, setAverageSpeed] = useState<number>(0);
  const [speedCounter, setSpeedCounter] = useState<number>(1);

  const watchPosition = () => {
    setCurrentSpeed(0);
    setAverageSpeed(0);
    setSpeedCounter(0);
    try {
      const watchID = Geolocation.watchPosition(
        (position) => {
          setPosition(JSON.stringify(position));
          setCurrentSpeed(position.coords.speed)
        },
        (error) => Alert.alert('WatchPosition Error', JSON.stringify(error))
      );
      setSubscriptionId(watchID);
    } catch (error) {
      Alert.alert('WatchPosition Error', JSON.stringify(error));
    }
  };

  const clearWatch = () => {
    subscriptionId !== null && Geolocation.clearWatch(subscriptionId);
    setSubscriptionId(null);
    setPosition(null);
  };

  useEffect(() => {
    function averageSpeedCalculator() {
      const newAverageSpeed = Math.round((((averageSpeed * (speedCounter) + currentSpeed)) / (speedCounter + 1) + Number.EPSILON) * 100) / 100;
      console.log("New Average Speed: ", newAverageSpeed);
      console.log("Speed Counter: ", speedCounter)
      setAverageSpeed(newAverageSpeed);
      setSpeedCounter(speedCounter + 1);
      setSpeedForColor(newAverageSpeed);
      }

    averageSpeedCalculator();
  },[currentSpeed])


  useEffect(() => {
    return () => {
      clearWatch();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log("Target Speed: ", targetSpeed)

  return (
    <View style={$container}>
      <View style={$speedContainer}>
      <Text>
        <Text style={styles.title}>Average Speed: </Text>
        {averageSpeed || 'unknown'}
      </Text>
      <Text>
        <Text style={styles.title}>Current Speed: </Text>
        {currentSpeed || 'unknown'}
      </Text>
      </View>
      <View style={$buttonStart}>
      {(subscriptionId !== null || !targetSpeed) ? (
        <Button color='white' title="Oh Fuck Stop" onPress={clearWatch} />
      ) : (
        <Button title="Let's Fuckin Go" onPress={watchPosition} />
      )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '500',
    fontSize: 20,
  },
});

const $container: ViewStyle = {
  flex: 1,
}

const $speedContainer: ViewStyle = {
  flex: 1,
}

const $buttonStart: ViewStyle = {
  justifyContent: 'flex-end',
  borderRadius: 8,
  backgroundColor: colors.palette.secondary500,
}