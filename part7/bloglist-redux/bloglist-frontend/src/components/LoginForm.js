import React from "react";
import { useState } from "react";
import {Button, Form} from "react-bootstrap";

const LoginForm = ({ login }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    await login(username, password);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>username:</Form.Label>
        <Form.Control
          id="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <Form.Label>password:</Form.Label>
        <Form.Control
          id="password"
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </Form.Group>
      <br/>
      <Button variant="primary" type="submit">
        login
      </Button>
    </Form>
  );
};

export default LoginForm;
