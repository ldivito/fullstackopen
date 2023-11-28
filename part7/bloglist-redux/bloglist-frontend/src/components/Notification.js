/* eslint-disable react/prop-types */
import React from "react";
import { useSelector } from "react-redux";
import {Alert} from "react-bootstrap";

// Notification component
const Notification = () => {
  const message = useSelector((state) => state.notification.message);

  return (
    <div>
      {(message &&
        <Alert variant={message.type}>
          {message.message}
        </Alert>
      )}
    </div>
  );
};

export default Notification;
