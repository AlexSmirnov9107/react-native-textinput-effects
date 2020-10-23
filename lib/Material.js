import React from "react";
import PropTypes from "prop-types";
import {
  //   Animated,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from "react-native";

import BaseInput from "./BaseInput";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default class Material extends BaseInput {
  static propTypes = {
    borderColor: PropTypes.string,
    /*
     * this is used to set backgroundColor of label mask.
     * this should be replaced if we can find a better way to mask label animation.
     */
    maskColor: PropTypes.string,
    inputPadding: PropTypes.number,
    height: PropTypes.number,
    useNativeDriver: PropTypes.bool,
    activeColor: PropTypes.string,
  };

  static defaultProps = {
    borderColor: "red",
    inputPadding: 16,
    height: 48,
    borderHeight: 3,
    useNativeDriver: true,
    activeColor: "#000",
  };

  render() {
    const {
      label,
      style: containerStyle,
      inputStyle,
      labelStyle,

      borderColor,
      activeBorderColor,

      inputPadding,
      height: inputHeight,
    } = this.props;
    const { width, focusedAnim, value } = this.state;
    const flatStyles = StyleSheet.flatten(containerStyle) || {};
    const containerWidth = flatStyles.width || width;
    const inputBorderColor = this.isActive ? activeBorderColor : borderColor;
    return (
      <View
        style={[
          styles.container,
          containerStyle,
          {
            height: inputHeight + inputPadding,
            width: containerWidth,
          },
        ]}
        onLayout={this._onLayout}
      >
        <AnimatedTextInput
          ref={this.input}
          {...this.props}
          style={[
            styles.textInput,
            inputStyle,
            {
              width,
              height: inputHeight,
              left: inputPadding,
              borderColor: inputBorderColor,
            },
          ]}
          value={value}
          onBlur={this._onBlur}
          onChange={this._onChange}
          onFocus={this._onFocus}
          underlineColorAndroid={"transparent"}
        />
        <TouchableWithoutFeedback onPress={this.focus}>
          <Animated.View
            useNativeDriver={true}
            style={[
              styles.labelContainer,
              {
                transform: [
                  {
                    translateY: focusedAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [24, 2],
                    }),
                  },
                  {
                    translateX: focusedAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [inputPadding, inputPadding - 2.5],
                    }),
                  },
                  {
                    scale: focusedAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0.9],
                    }),
                  },
                ],
              },
            ]}
          >
            <Animated.Text
              useNativeDriver={true}
              style={[styles.label, labelStyle]}
            >
              {label}
            </Animated.Text>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 2,
    borderBottomColor: "#b9c1ca",
  },
  labelContainer: {
    position: "absolute",
  },
  label: {
    fontSize: 16,
    color: "#6a7989",
  },
  textInput: {
    position: "absolute",
    bottom: 2,
    padding: 0,
    color: "#6a7989",
    fontSize: 18,
    fontWeight: "bold",
  },
  labelMask: {
    height: 24,
  },
  border: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
