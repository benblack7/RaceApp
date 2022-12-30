import { observer } from "mobx-react-lite"
import React, { FC, useState, useEffect } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle, TextInput } from "react-native"
import {
  Text,
} from "../components"
import { isRTL } from "../i18n"
import { colors, spacing } from "../theme"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import WatchPosition from '../services/gps/gps';

const welcomeLogo = require("../../assets/images/logo.png")
const welcomeFace = require("../../assets/images/welcome-face.png")


export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen(
) {

  const [number, onChangeNumber] = useState(0);
  const [targetSpeed, setTargetSpeed] = useState(0);
  const [currentSpeed, setSpeedForColor] = useState(0);
  const [backgroundSpeedColor, setBackgroundSpeedColor] = useState("");
  const [speedRecommendation, setSpeedRecommendation] = useState("");

  console.log("Current Average Speed: ", currentSpeed)
  console.log("Top Target Speed: ", targetSpeed)

  useEffect(() => {
    function setSpeedColor() {
      if (currentSpeed > (targetSpeed * 1.05)) {
        setBackgroundSpeedColor(colors.palette.warningtime)
        setSpeedRecommendation("Going too fast!")
      } else if (currentSpeed < (targetSpeed * .95)) {
        setBackgroundSpeedColor(colors.palette.speedup)
        setSpeedRecommendation("Speed up!")
      } else {
        setBackgroundSpeedColor(colors.palette.goodtime)
        setSpeedRecommendation("Speed is good")
      }
     }
     setSpeedColor();
  }, [currentSpeed])

  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  return (
    <View style={$container}>
      <View style={$topContainer}>
      {/* <View style={$topContainer}>
        <Image style={$welcomeLogo} source={welcomeLogo} resizeMode="contain" />
        <Text
          testID="welcome-heading"
          style={$welcomeHeading}
          tx="welcomeScreen.readyForLaunch"
          preset="heading"
        />
        <Text tx="welcomeScreen.exciting" preset="subheading" />
        <Image style={$welcomeFace} source={welcomeFace} resizeMode="contain" />
      </View>

      <View style={[$bottomContainer, $bottomContainerInsets]}>
        <Text tx="welcomeScreen.postscript" size="md" />
      </View> */}
      <Text>
        Total Distance
      </Text>
      <TextInput
        style={$textinput}
        onChangeText={onChangeNumber}
        value={number}
        placeholder="useless placeholder"
        keyboardType="numeric"
      />
      <Text>
        Target Speed
      </Text>
      <TextInput
        style={$textinput}
        onChangeText={setTargetSpeed}
        value={targetSpeed}
        placeholder="target speed"
        keyboardType="numeric"
      />
      </View>
      <View style={[$bottomContainer, $bottomContainerInsets, {backgroundColor: backgroundSpeedColor}]}>
        <Text tx="welcomeScreen.postscript" size="lg" />
        <Text>
          {speedRecommendation}
        </Text>
        <WatchPosition setSpeedForColor={setSpeedForColor} targetSpeed = {targetSpeed}/>
      </View>
    </View>
  )
})

const $textinput: ViewStyle = {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    marginTop: spacing.tiny,
};

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $topContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "57%",
  justifyContent: "center",
  paddingHorizontal: spacing.large,
}

const $bottomContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 0,
  flexBasis: "43%",
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
