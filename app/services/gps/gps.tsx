import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, Alert, Button, ViewStyle } from "react-native"
import { Card } from "../../components"
import Geolocation from "@react-native-community/geolocation"
import { colors, spacing } from "../../theme"

export default function WatchPosition({ setSpeedForColor, targetSpeed }) {
  const [position, setPosition] = useState<string | null>(null)
  const [subscriptionId, setSubscriptionId] = useState<number | null>(null)
  const [currentSpeed, setCurrentSpeed] = useState<number>(0)
  const [averageSpeed, setAverageSpeed] = useState<number>(0)
  const [speedCounter, setSpeedCounter] = useState<number>(1)
  const [heading, setHeading] = useState<number>(0)
  const [gpsAccuracy, setGpsAccuracy] = useState<number>(0)

  const watchPosition = () => {
    setCurrentSpeed(0)
    setAverageSpeed(0)
    setSpeedCounter(0)
    try {
      const watchID = Geolocation.watchPosition(
        (position) => {
          console.log("GPS Data: ", position)
          setPosition(JSON.stringify(position))
          const currentSpeed = Math.round(position.coords.speed * 2.236936)
          const heading = position.coords.heading
          const gpsaccuracy = position.coords.accuracy
          setCurrentSpeed(currentSpeed)
          setHeading(heading)
          setGpsAccuracy(gpsaccuracy)
        },
        (error) => Alert.alert("WatchPosition Error", JSON.stringify(error)),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          distanceFilter: 1,
          maximumAge: 1000,
        },
      )
      setSubscriptionId(watchID)
    } catch (error) {
      //Alert.alert("WatchPosition Error", JSON.stringify(error))
    }
  }

  const clearWatch = () => {
    subscriptionId !== null && Geolocation.clearWatch(subscriptionId)
    setSubscriptionId(null)
    setPosition(null)
  }

  useEffect(() => {
    function averageSpeedCalculator() {
      const newAverageSpeed = Math.round(
        (((averageSpeed * speedCounter + currentSpeed) / (speedCounter + 1) + Number.EPSILON) *
          100) /
          100,
      )
      console.log("New Average Speed: ", newAverageSpeed)
      console.log("Speed Counter: ", speedCounter)
      setAverageSpeed(newAverageSpeed)
      setSpeedCounter(speedCounter + 1)
      setSpeedForColor(newAverageSpeed)
    }

    averageSpeedCalculator()
  }, [currentSpeed])

  useEffect(() => {
    return () => {
      clearWatch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  console.log("Target Speed: ", targetSpeed)

  return (
    <View style={$container}>
      <View style={$speedContainer}>
        <Card
          style={$speedContainer}
          heading="Average Speed"
          content={averageSpeed}
          contentStyle={$cardText}
        />
        <Card
          style={$speedContainer}
          heading="Current Speed"
          content={currentSpeed}
          contentStyle={$cardText}
        />
      </View>
      <View style={$speedContainer}>
        <Card
          style={$speedContainer}
          heading="Heading"
          content={heading}
          contentStyle={$cardText}
        />
        <Card
          style={$speedContainer}
          heading="GPS Accuracy"
          content={gpsAccuracy}
          contentStyle={$cardText}
        />
      </View>
      <View style={$buttonStart}>
        {subscriptionId !== null || !targetSpeed ? (
          <Button color="white" title="Oh Fuck Stop" onPress={clearWatch} />
        ) : (
          <Button title="Let's Fuckin Go" onPress={watchPosition} />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "500",
    fontSize: 20,
    color: colors.palette.neutral100,
  },
})

const $container: ViewStyle = {
  flex: 2,
  backgroundColor: colors.background,
  marginTop: spacing.tiny,
  flexGrow: 1,
  flexShrink: 1,
}

const $speedContainer: ViewStyle = {
  flex: 0.5,
  flexWrap: "wrap",
  flexDirection: "row",
  margin: spacing.tiny,
  color: colors.palette.neutral100,
}

const $buttonStart: ViewStyle = {
  flex: 0.1,
  justifyContent: "flex-end",
  borderRadius: 8,
  backgroundColor: colors.palette.secondary500,
  marginBottom: spacing.large,
}

const $cardText: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}
