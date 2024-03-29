import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Home from "../../views/sandbox/home/Home";
import UserList from "../../views/sandbox/user-manage/UserList";
import RoleList from "../../views/sandbox/right-manage/RoleList";
import RightList from "../../views/sandbox/right-manage/RightList";
import NoPermission from "../../views/sandbox/nopermission/NoPermission";
import NewsAdd from "../../views/sandbox/news-manage/NewsAdd";
import NewsDraft from "../../views/sandbox/news-manage/NewsDraft";
import NewsCategory from "../../views/sandbox/news-manage/NewsCategory";
import NewsPreview from "../../views/sandbox/news-manage/NewsPreview";
import NewsUpdate from "../../views/sandbox/news-manage/NewsUpdate";
import Audit from "../../views/sandbox/audit-manage/Audit";
import AuditList from "../../views/sandbox/audit-manage/AuditList";
import Unpublished from "../../views/sandbox/publish-manage/Unpublished";
import Published from "../../views/sandbox/publish-manage/Published";
import Sunset from "../../views/sandbox/publish-manage/Sunset";
import axios from "axios";

const localRouterMap = {
  "/home": Home,
  "/user-manage/list": UserList,
  "/right-manage/role/list": RoleList,
  "/right-manage/right/list": RightList,
  "/news-manage/add": NewsAdd,
  "/news-manage/draft": NewsDraft,
  "/news-manage/category": NewsCategory,
  "/news-manage/preview/:id": NewsPreview,
  "/news-manage/update/:id": NewsUpdate,
  "/audit-manage/audit": Audit,
  "/audit-manage/list": AuditList,
  "/publish-manage/unpublished": Unpublished,
  "/publish-manage/published": Published,
  "/publish-manage/sunset": Sunset,
};
export default function NewsRouter() {
  const [BackRouteList, setBackRouteList] = useState([]);
  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:5000/rights"),
      axios.get("http://localhost:5000/children"),
    ]).then((res) => {
      setBackRouteList([...res[0].data, ...res[1].data]);
    });
  }, []);

  const checkRoute = (item) => {
    return (
      localRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    );
  };
  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem("token"));
  const checkUserPermission = (item) => {
    return rights.includes(item.key);
  };

  // const [search] = useParams();
  // const id = search.get("id");
  // useEffect(() => {
  //   //发请求
  // }, []);
  checkUserPermission();

  return (
    <div>
      <Switch>
        {BackRouteList.map((item) => {
          if (
            checkRoute(item)
            // && checkUserPermission(item)
          ) {
            return (
              <Route
                path={item.key}
                key={item.key}
                component={localRouterMap[item.key]}
                exact
              />
            );
          }
          return null;
        })}
        <Redirect from="/" to="/home" exact />
        {BackRouteList.length > 0 && (
          <Route path="*" component={NoPermission} />
        )}
      </Switch>
    </div>
  );
}
