import React, { useState } from "react";
import { Layout, Button, Dropdown, Avatar, Menu } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { withRouter } from "react-router-dom";

const { Header } = Layout;
const TopHeader = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    role: { roleName },
    username,
  } = JSON.parse(localStorage.getItem("token") || "");
  const menu = (
    <Menu>
      <Menu.Item key={"1"}>{roleName}</Menu.Item>
      <Menu.Item
        key={"4"}
        danger
        onClick={() => {
          localStorage.removeItem("token");
          props.history.replace("/login");
        }}
      >
        退出
      </Menu.Item>
    </Menu>
  );
  return (
    <Header className="site-layout-background" style={{ padding: 0 }}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: "16px",
          width: 64,
          height: 64,
        }}
      />
      <div style={{ float: "right" }}>
        <span>
          欢迎<span style={{ color: "#1890ff" }}>{username}</span>回来
        </span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
};
export default withRouter(TopHeader);
