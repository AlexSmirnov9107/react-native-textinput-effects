import React from "react";
import PropTypes from "prop-types";
import {
  Animated,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from "react-native";

import BaseInput from "./BaseInput";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default class Material extends BaseInput {
  _onBlur(event) {
    if (!this.state.value) {
      this._toggle(false);
    } else {
      this.isActive = false;
      this.setState({ active: false });
    }

    const onBlur = this.props.onBlur;
    if (onBlur) {
      onBlur(event);
    }
  }
  _toggle(isActive) {
    const { animationDuration, easing, useNativeDriver } = this.props;
    this.isActive = isActive;
    // this.setState({active:isActive})

    this.setState({ active: isActive });

    // if (isActive) {
    //   this.setState({ active: true });
    // }
    Animated.timing(this.state.focusedAnim, {
      toValue: isActive ? 1 : 0,
      duration: animationDuration,
      easing,
      useNativeDriver: useNativeDriver || false,
    }).start(() => {});
  }

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
    activeLabelColor: PropTypes.string,
  };

  static defaultProps = {
    borderColor: "red",
    inputPadding: 16,
    height: 48,
    borderHeight: 3,
    useNativeDriver: true,
    activeColor: "#000",
  };

  width = 0;
  onLayout = (event) => {
    this.width = event.nativeEvent.layout.width;
  };

  render() {
    const {
      label,
      style: containerStyle,
      inputStyle,
      labelStyle,
      inputPadding,
      height: inputHeight,
      activeLabelColor,
    } = this.props;
    const { width, focusedAnim, value } = this.state;
    const flatStyles = StyleSheet.flatten(containerStyle) || {};
    const containerWidth = flatStyles.width || width;
    // const inputBorderColor = this.state.active
    //   ? activeBorderColor
    //   : borderColor;
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
        <TouchableWithoutFeedback onPress={this.focus}>
          <Animated.View
            useNativeDriver={true}
            onLayout={this.onLayout}
            style={[
              styles.labelContainer,
              {
                left: inputPadding,
              },
              {
                transform: [
                  {
                    translateY: focusedAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [(inputHeight + inputPadding / 2) / 2, 0],
                    }),
                  },
                  {
                    translateX: focusedAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 5 - this.width * 0.07],
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
              style={[
                styles.label,
                labelStyle,
                (this.state.active ||
                  this.props.value ||
                  (this.input &&
                    this.input.current &&
                    this.input.current.isFocused())) && {
                  color: activeLabelColor,
                },
              ]}
            >
              {label}
            </Animated.Text>
          </Animated.View>
        </TouchableWithoutFeedback>

        <AnimatedTextInput
          ref={this.input}
          {...this.props}
          style={[
            styles.textInput,
            inputStyle,
            {
              // width,
              height: inputHeight,
              left: inputPadding,
              // borderColor: focusedAnim.interpolate({
              //   inputRange: [0, 1],
              //   outputRange: [      borderColor,
              //     activeBorderColor],
              // }),
              // borderWidth: 1,
              right: 0,
            },
          ]}
          value={value}
          onBlur={this._onBlur}
          onChange={this._onChange}
          onFocus={this._onFocus}
          underlineColorAndroid={"transparent"}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  labelContainer: {
    position: "absolute",
    zIndex: 10,
  },
  label: {
    fontSize: 16,
    color: "#6a7989",
    paddingHorizontal: 4,
  },
  textInput: {
    position: "absolute",
    zIndex: 0,
    bottom: 2,
    padding: 0,
    color: "#6a7989",
    fontSize: 18,
    fontWeight: "bold",
  },
});
