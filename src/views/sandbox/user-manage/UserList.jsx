import React, { useState, useEffect, useRef } from "react";
import { Button, Table, Modal, Switch } from "antd";
import axios from "axios";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import UserForm from "../../../components/user-manage/UserForm";

const { confirm } = Modal;
export default function UserList() {
  const [dataSource, setdataSource] = useState([]);
  const [isAddOpen, setisAddOpen] = useState(false);
  const [roleList, setroleList] = useState([]);
  const [regionList, setregionList] = useState([]);
  const [isUpdateOpen, setisUpdateOpen] = useState(false);
  const [isUpdateDiabled, setisUpdateDiabled] = useState(false);
  const [current, setCurrent] = useState(null);
  const addForm = useRef(null);
  const updateForm = useRef(null);
  const { roleId, region, username } = JSON.parse(
    localStorage.getItem("token")
  );
  useEffect(() => {
    axios.get("http://localhost:5000/users").then(
      (res) => {
        const list = res.data;
        setdataSource(
          roleId === "1"
            ? list
            : [
                ...list.filter((item) => item.username === username),
                ...list.filter(
                  (item) => item.region === region && roleId === "3"
                ),
              ]
        );
      },
      [roleId, region, username]
    );
  });
  useEffect(() => {
    axios.get("http://localhost:5000/regions").then((res) => {
      const list = res.data;
      setregionList(list);
    }, []);
  });
  useEffect(() => {
    axios.get("http://localhost:5000/roles").then((res) => {
      const list = res.data;
      setroleList(list);
    }, []);
  });
  const columns = [
    {
      title: "区域",
      dataIndex: "region",
      filters: [
        ...regionList.map((item) => ({
          text: item.title,
          value: item.value,
        })),
        {
          text: "全球",
          value: "",
        },
      ],

      onFilter: (value, item) => item.region === value,

      render: (region) => {
        return <b>{region === "" ? "全球" : region}</b>;
      },
    },
    {
      title: "角色名称",
      dataIndex: "role",
      render: (role) => {
        return role?.roleName;
      },
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "用户状态",
      dataIndex: "roleState",
      render: (roleState, item) => {
        return (
          <Switch
            checked={roleState}
            disabled={item.default}
            onChange={() => handleChange(item)}
          ></Switch>
        );
      },
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => confirmMethod(item)}
              disabled={item.default}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              disabled={item.default}
              onClick={() => handleUpdate(item)}
            />
          </div>
        );
      },
    },
  ];
  const handleUpdate = (item) => {
    setisAddOpen(true);
    if (item.roleId === 1) {
      setisUpdateDiabled(true);
    } else {
      setisUpdateDiabled(false);
    }
    setTimeout(() => {
      updateForm.current?.setFieldsValue(item);
    }, 0);
    setCurrent(item);
  };
  const handleChange = (item) => {
    item.roleState = !item.roleState;
    setdataSource([...dataSource]);
    axios.patch(`http://localhost:5000/users/${item.id}`, {
      roleState: item.roleState,
    });
  };
  const confirmMethod = (item) => {
    confirm({
      title: "Do you Want to delete these items?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      onOk() {
        deleteMethod(item);
      },
      onCancel() {},
    });
  };
  // 删除
  const deleteMethod = (item) => {
    // 当前页面同步状态 + 后端同步
    setdataSource(dataSource.filter((data) => data.id !== item.id));
    axios.delete(`http://localhost:5000/users/${item.id}`);
  };
  const addFormOK = () => {
    addForm.current
      .validateFields()
      .then((value) => {
        setisAddOpen(false);
        addForm.current.resetFields();
        // post到后端，生成id,再设置dataSource，方便后面的删除和更新
        axios
          .post("http://localhost:5000/users", {
            ...value,
            roleState: true,
            default: false,
          })
          .then((res) => {
            console.log(res.data);
            setdataSource([
              ...dataSource,
              {
                ...res.data,
                role: roleList.filter((item) => item.id === value.roleId)[0],
              },
            ]);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updateFormOK = () => {
    updateForm.current.validateFields().then((value) => {
      setisUpdateDiabled(false);
      setdataSource(
        dataSource.map((item) => {
          if (item.id === current.id) {
            return {
              ...item,
              ...value,
              role: roleList.filter((data) => data.id === value.roleId)[0],
            };
          }
          return item;
        })
      );
      setisUpdateDiabled(!isUpdateDiabled);
      axios.patch(`http://localhost:5000/users/${current.id}`, value);
    });
  };
  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setisAddOpen(true);
        }}
      >
        添加用户
      </Button>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5,
        }}
        rowKey={(item) => item.id}
      />
      <Modal
        open={isAddOpen}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setisAddOpen(false);
        }}
        onOk={() => addFormOK()}
      >
        <UserForm
          regionList={regionList}
          roleList={roleList}
          ref={addForm}
        ></UserForm>
      </Modal>

      <Modal
        open={isUpdateOpen}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setisUpdateOpen(false);
          setisUpdateDiabled(!isUpdateDiabled);
        }}
        onOk={() => updateFormOK()}
      >
        <UserForm
          regionList={regionList}
          roleList={roleList}
          ref={updateForm}
          isUpdateDiabled={isUpdateDiabled}
          isUpdate={true}
        ></UserForm>
      </Modal>
    </div>
  );
}
