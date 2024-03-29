import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { UserOutlined, VideoCameraOutlined } from "@ant-design/icons";
import "./index.css";
import { withRouter } from "react-router-dom";
import SubMenu from "antd/es/menu/SubMenu";
import axios from "axios";
const { Sider } = Layout;
const iconList = {
  "/home": <UserOutlined />,
  "/user-manage/list": <VideoCameraOutlined />,
  "/user-manage": <VideoCameraOutlined />,
  "/right-manage/role/list": <UserOutlined />,
  "/right-manage": <UserOutlined />,
  "/right-manage/right/list": <VideoCameraOutlined />,
};
function SideMenu(props) {
  const [menu, setMenu] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:5000/rights?_embed=children").then((res) => {
      setMenu(res.data);
    });
  }, []);

  // const {
  //   role: { rights },
  // } = JSON.parse(localStorage.getItem("token"));
  // const checkPagePermission = (item) => {
  //   return item.pagepermisson && rights.includes(item.key);
  // };

  const checkPagePermission = (item) => {
    return item.pagepermisson;
  };

  const renderMenu = (menuList) => {
    return menuList.map((item) => {
      if (item.children?.length > 0 && checkPagePermission(item)) {
        return (
          <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
            {renderMenu(item.children)}
          </SubMenu>
        );
      }
      return (
        checkPagePermission(item) && (
          <Menu.Item
            key={item.key}
            icon={iconList[item.key]}
            onClick={() => {
              props.history.push(item.key);
            }}
          >
            {item.title}
          </Menu.Item>
        )
      );
    });
  };

  const selectKeys = [props.location.pathname];
  const openKeys = ["/" + props.location.pathname.split("/")[1]];
  return (
    <Sider trigger={null} collapsible collapsed={false}>
      <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
        <div className="logo">全球新闻发布管理系统</div>
        <div style={{ flex: 1, overflow: "auto" }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selectKeys}
            defaultOpenKeys={openKeys}
          >
            {renderMenu(menu)}
          </Menu>
        </div>
      </div>
    </Sider>
  );
}

export default withRouter(SideMenu);
