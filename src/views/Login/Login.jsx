import React from "react";
import { Form, Button, Input, Checkbox, message } from "antd";
import "./Login.css";
import Particles from "react-tsparticles";
import axios from "axios";

export default function Login(props) {
  const onFinish = (values) => {
    axios
      .get(
        `http://localhost:5000/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`
      )
      .then((res) => {
        if (res.data.length === 0) {
          message.error("用户名或密码不匹配");
        } else {
          localStorage.setItem("token", JSON.stringify(res.data[0]));
          props.history.push("/");
        }
      });
  };
  return (
    <div style={{ background: "rgb(35,39,65)", height: "100%" }}>
      <Particles />
      <div className="formcontent">
        <div className="logintitle">全球新闻发布管理系统</div>
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 8, span: 16 }}
          >
            <Checkbox style={{ color: "white" }}>Remember me</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
