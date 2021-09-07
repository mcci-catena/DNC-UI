import * as React from "react";
import {
  StyleSheet,
  View,
  Button,
  Modal,
  Text,
  TouchableWithoutFeedback
} from "react-native";

const AlertHandler = createAlertHandler();

function createAlertHandler() {
  // local state of alert handler
  let subscriber;
  let alerts = [];

  let setAlerts = (previousAlertsCallback) => {
    alerts = previousAlertsCallback(alerts);
    // notify alert root
    subscriber && subscriber(alerts);
  };

  function use() {
    // eslint-disable-next-line
    let [localAlerts, s] = React.useState(alerts);

    // subscribe to external changes
    // eslint-disable-next-line
    React.useEffect(() => {
      subscriber = s;
      return () => {
        subscriber = undefined;
      };
    }, [s]);

    // set callback
    return [localAlerts, setAlerts];
  }

  return {
    api: {
      alert: (title, message, buttons, options) => {
        setAlerts((prev) => [...prev, { title, message, buttons, options }]);
      }
    },
    use
  };
}

export function AlertRoot() {
  const [alerts, setAlerts] = AlertHandler.use();

  const onClose = (indexToRemove) => {
    setAlerts((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const backdrop = <View style={[StyleSheet.absoluteFill, styles.backdrop]} />;

  return alerts.map(({ title, message, buttons, options }, alertIndex) => (
    <Modal
      key={alertIndex}
      visible={true}
      animationType="none"
      transparent
      onRequestClose={
        options && options.cancelable ? () => onClose(alertIndex) : () => null
      }
    >
      <View style={[StyleSheet.absoluteFill, styles.modalInner]}>
        {options && options.cancelable ? (
          <TouchableWithoutFeedback onPress={() => onClose(alertIndex)}>
            {backdrop}
          </TouchableWithoutFeedback>
        ) : (
          backdrop
        )}
        <View style={styles.alert}>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          {buttons ? (
            <View style={styles.buttons}>
              {buttons.map(({ text, onPress, style }, buttonIndex) => {
                const hasThree = buttons.length === 3;
                const isFirst = buttonIndex === 0;
                return (
                  <React.Fragment key={buttonIndex}>
                    {isFirst && !hasThree ? <View style={styles.fill} /> : null}
                    {isFirst ? null : <View style={styles.spacer} />}
                    <Button
                      onPress={onPress}
                      title={text}
                      color={style === "cancel" ? "red" : undefined}
                    />
                    {isFirst && hasThree ? <View style={{ flex: 1 }} /> : null}
                  </React.Fragment>
                );
              })}
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  ));
}

const styles = StyleSheet.create({
  modalInner: { justifyContent: "flex-start", alignItems: "center" },
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.2)"
  },
  alert: {
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    margin: 12,
    marginTop: 0,
    padding: 12,
    borderBottomStartRadius: 5,
    borderBottomEndRadius: 5
  },
  title: { fontSize: 22 },
  message: { marginTop: 6 },
  buttons: { flexDirection: "row", marginTop: 24 },
  fill: { flex: 1 },
  spacer: { width: 6 }
});

export default AlertHandler.api;
