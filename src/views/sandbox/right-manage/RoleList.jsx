import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Tree } from "antd";
import axios from "axios";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";

const { confirm } = Modal;
export default function RoleList() {
  const [dataSource, setdataSource] = useState([]);
  const [rightList, setrightList] = useState([]);
  const [currentRights, setcurrentRights] = useState([]);
  const [currentId, setcurrentId] = useState(0);
  const [isModalOpen, setisModalOpen] = useState(false);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => {
        return <b>{id}</b>;
      },
    },
    {
      title: "角色名称",
      dataIndex: "roleName",
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
            />
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                setisModalOpen(true);
                setcurrentRights(item.rights);
                setcurrentId(item.id);
              }}
            />
          </div>
        );
      },
    },
  ];
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
  const deleteMethod = (item) => {
    // 当前页面同步状态 + 后端同步
    setdataSource(dataSource.filter((data) => data.id !== item.id));
    axios.delete(`/roles/${item.id}`);
  };
  useEffect(() => {
    axios.get("/roles").then((res) => {
      setdataSource(res.data);
    });
  }, []);
  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      setrightList(res.data);
    });
  }, []);

  const handleOk = () => {
    setisModalOpen(false);
    setdataSource(
      dataSource.map((item) => {
        if (item.id === currentId) {
          return {
            ...item,
            rights: currentRights,
          };
        }
        return item;
      })
    );
    axios.patch(`http://localhost:5000/roles/${currentId}`, {
      rights: currentRights,
    });
  };
  const handleCancel = () => {
    setisModalOpen(false);
  };
  const onCheck = (checkedKeys) => {
    setcurrentRights(checkedKeys);
  };
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(item) => item.id}
      ></Table>
      <Modal
        title="权限分配"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree
          checkable
          checkedKeys={currentRights}
          onCheck={onCheck}
          checkStrictly={true}
          treeData={rightList}
        />
      </Modal>
    </div>
  );
}
