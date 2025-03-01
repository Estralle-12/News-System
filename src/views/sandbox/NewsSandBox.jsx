import React, { useEffect } from "react";
import SideMenu from "../../components/sandbox/SideMenu";
import TopHeader from "../../components/sandbox/TopHeader";
import NewsRouter from "../../components/sandbox/NewsRouter";
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import { Layout } from "antd";

const { Content } = Layout;

export default function NewsSandBox() {
  nprogress.start();
  useEffect(() => {
    nprogress.done();
  });
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout>
        <TopHeader></TopHeader>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            overflow: "auto",
          }}
        >
          <NewsRouter></NewsRouter>
        </Content>
      </Layout>
    </Layout>
  );
}
