import React, { useEffect, useState, useRef } from "react";
import {
  Steps,
  Button,
  Form,
  Input,
  Select,
  message,
  notification,
} from "antd";
import NewsEditor from "../../../components/news-manage/NewsEditor";
import style from "./New.module.css";
import axios from "axios";
const { Option } = Select;

export default function NewsUpdate(props) {
  const [current, setCurrent] = useState(0);
  const [categoryList, setcategoryList] = useState([]);
  const [formInfo, setFormInfo] = useState([]);
  const [content, setContent] = useState("");

  // const User = JSON.parse(localStorage.getItem("token"));
  const handleNext = () => {
    if (current === 0) {
      NewsForm.current
        .validateFields()
        .then((res) => {
          setFormInfo(res);
          setCurrent(current + 1);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      if (content === "" || content.trim() === "<p></p>") {
        message.error("新闻内容不能为空");
      } else {
        setCurrent(current + 1);
      }
    }
  };
  const handlePrevious = () => {
    setCurrent(current - 1);
  };
  const NewsForm = useRef(null);
  useEffect(() => {
    axios.get("/categories").then((res) => {
      setcategoryList(res.data);
    });
  }, []);

  useEffect(() => {
    axios
      .get(`/news/${props.match.params.id}?_expand=category&_expand=role`)
      .then((res) => {
        let { title, categoryId, content } = res.data;
        NewsForm.current.setFieldsValue({
          title,
          categoryId,
        });
        setContent(content);
      });
  }, [props.match.params.id]);

  const handleSave = (auditState) => {
    axios
      .patch(`/news/${props.match.params.id}`, {
        ...formInfo,
        content: content,
        auditState: auditState,
      })
      .then((res) => {
        props.history.push(
          auditState === 0 ? "/news-manage/draft" : "/audit-manage/list"
        );

        notification.info({
          message: "通知",
          description: `您可以到${
            auditState === 0 ? "草稿箱" : "审核列表"
          }中查看您的新闻`,
          placement: "bottomRight",
        });
      });
  };
  return (
    <div>
      <div style={{ fontSize: "18px", marginBottom: "20px" }}>
        <b>更新新闻</b>
      </div>

      <Steps
        current={current}
        items={[
          {
            title: "基本信息",
            description: "新闻信息，新闻分类",
          },
          {
            title: "新闻内容",
            description: "新闻主体内容",
          },
          {
            title: "此文提交",
            description: "保存草稿或提交审核",
          },
        ]}
      />

      <div style={{ marginTop: "50px" }}>
        <div className={current === 0 ? "" : style.active}>
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 18 }}
            ref={NewsForm}
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Select>
                {categoryList.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? "" : style.active}>
          <NewsEditor
            getContent={(value) => {
              setContent(value);
            }}
            content={content}
          ></NewsEditor>
        </div>
        <div className={current === 2 ? "" : style.active}>3333333</div>
      </div>
      <div style={{ marginTop: "50px" }}>
        {current === 2 && (
          <span>
            <Button type="primary" danger onClick={() => handleSave(0)}>
              保存草稿箱
            </Button>
            <Button danger onClick={() => handleSave(1)}>
              提交审核
            </Button>
          </span>
        )}
        {current < 2 && (
          <Button type="primary" onClick={handleNext}>
            下一步
          </Button>
        )}
        {current > 0 && <Button onClick={handlePrevious}>上一步</Button>}
      </div>
    </div>
  );
}
