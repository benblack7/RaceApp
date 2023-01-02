import { observer } from "mobx-react-lite"
import React, { FC, useState, useEffect } from "react"
import {
  Image,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native"
import { Text } from "../components"
import { isRTL } from "../i18n"
import { colors, spacing } from "../theme"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import WatchPosition from "../services/gps/gps"
import Speedometer from "react-native-speedometer-chart"
import { ScrollView } from "react-native-gesture-handler"

const welcomeLogo = require("../../assets/images/logo.png")
const welcomeFace = require("../../assets/images/welcome-face.png")

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen() {
  const [number, onChangeNumber] = useState(0)
  const [targetSpeed, setTargetSpeed] = useState(0)
  const [currentSpeed, setSpeedForColor] = useState(0)
  const [backgroundSpeedColor, setBackgroundSpeedColor] = useState("")
  const [speedRecommendation, setSpeedRecommendation] = useState("")

  console.log("Current Average Speed: ", currentSpeed)
  console.log("Top Target Speed: ", targetSpeed)

  const targetSpeedBuffer = targetSpeed * 1.5

  useEffect(() => {
    function setSpeedColor() {
      if (currentSpeed > targetSpeed * 1.05) {
        setBackgroundSpeedColor(colors.palette.warningtime)
        setSpeedRecommendation("Going too fast!")
      } else if (currentSpeed < targetSpeed * 0.95) {
        setBackgroundSpeedColor(colors.palette.speedup)
        setSpeedRecommendation("Speed up!")
      } else {
        setBackgroundSpeedColor(colors.palette.goodtime)
        setSpeedRecommendation("Speed is good")
      }
    }
    setSpeedColor()
  }, [currentSpeed])

  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  return (
    <ScrollView style={$container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={$container}>
          <View style={$topContainer}>
            <View style={$chartContainer}>
              <Speedometer
                value={currentSpeed}
                totalValue={targetSpeedBuffer}
                innerColor={colors.palette.background1}
              />
              <Text>{speedRecommendation}</Text>
              <Text style={$mphtext}>{currentSpeed} mph</Text>
            </View>
            <Text>Target Speed</Text>
            <TextInput
              style={$textinput}
              onChangeText={setTargetSpeed}
              value={targetSpeed}
              placeholder="Enter Target Speed"
              placeholderTextColor={colors.palette.neutral100}
              keyboardType="numeric"
            />
            <View
              style={{
                borderBottomColor: colors.palette.neutral500,
                borderBottomWidth: 1,
                opacity: 0.5,
              }}
            />
          </View>
          <Text tx="welcomeScreen.postscript" size="lg" />
          <WatchPosition setSpeedForColor={setSpeedForColor} targetSpeed={targetSpeed} />
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  )
})

const $textinput: ViewStyle = {
  height: 40,
  margin: 12,
  borderWidth: 1,
  padding: 10,
  marginTop: spacing.tiny,
  color: colors.palette.neutral100,
}

const $mphtext: ViewStyle = {
  fontSize: 40,
  margin: 12,
  padding: 20,
  marginTop: spacing.large,
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $topContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "17%",
  justifyContent: "center",
  paddingHorizontal: spacing.large,
}

const $chartContainer: ViewStyle = {
  flex: 0.3,
  flexBasis: "30%",
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: spacing.large,
}

const $bottomContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 0,
  flexBasis: "60%",
  //backgroundColor: colors.palette.goodtime,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  paddingHorizontal: spacing.large,
  justifyContent: "flex-start",
}
const $welcomeLogo: ImageStyle = {
  height: 88,
  width: "100%",
  marginBottom: spacing.huge,
}

const $welcomeFace: ImageStyle = {
  height: 169,
  width: 269,
  position: "absolute",
  bottom: -47,
  right: -80,
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}

const $welcomeHeading: TextStyle = {
  marginBottom: spacing.medium,
}
