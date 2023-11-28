/* eslint-disable react/prop-types */
import React from "react";
import { useSelector } from "react-redux";

// Notification component
const Notification = () => {
  const message = useSelector((state) => state.notification.message);

  const style = {
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  // Change color of notification based on type
  if (message && message.type === "error") {
    style.color = "red";
  } else if (message && message.type === "info") {
    style.color = "green";
  }

  return <div>{message && <div style={style}>{message.message}</div>}</div>;
};

export default Notification;
