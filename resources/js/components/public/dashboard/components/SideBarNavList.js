import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import {
    DashboardOutlined,
    UserOutlined,
    BookOutlined,
    TeamOutlined,
    ScheduleOutlined,
    ApartmentOutlined,
    ProfileOutlined,
    SettingOutlined,
} from "@ant-design/icons";

const SideBarNavList = React.memo(({ userRole }) => {
    const location = useLocation();

    const [openKeys, setOpenKeys] = useState([]);

    useEffect(() => {
        if (location.pathname.includes("/system-settings")) {
            setOpenKeys(["system-settings"]);
        } else {
            setOpenKeys([]);
        }
    }, [location.pathname]);

    const onOpenChange = (keys) => {
        setOpenKeys(keys);
    };

    const items = [
        {
            key: `/${userRole}/dashboard`,
            icon: <DashboardOutlined />,
            label: (
                <NavLink to={`/${userRole}/dashboard`} className="nav-link">
                    <span className="nav-link-text">Dashboard</span>
                </NavLink>
            ),
            className: "nav-item",
        },
    ];

    if (userRole === "admin") {
        items.push({
            key: `/${userRole}/enlistment-manager`,
            icon: <ProfileOutlined />,
            label: (
                <NavLink
                    to={`/${userRole}/enlistment-manager`}
                    className="nav-link"
                >
                    <span className="nav-link-text">Enlistment Manager</span>
                </NavLink>
            ),
            className: "nav-item",
        });
    }

    if (userRole === "superadmin") {
        items.push({
            key: `/${userRole}/users`,
            icon: <UserOutlined />,
            label: (
                <NavLink to={`/${userRole}/users`} className="nav-link">
                    <span className="nav-link-text">Users</span>
                </NavLink>
            ),
            className: "nav-item",
        });

        items.push({
            key: `/${userRole}/faculty-is`,
            icon: <TeamOutlined />,
            label: (
                <NavLink to={`/${userRole}/faculty-is`} className="nav-link">
                    <span className="nav-link-text">Faculty IS</span>
                </NavLink>
            ),
            className: "nav-item",
        });

        items.push({
            key: `/${userRole}/student-is`,
            icon: <BookOutlined />,
            label: (
                <NavLink to={`/${userRole}/student-is`} className="nav-link">
                    <span className="nav-link-text">Student IS</span>
                </NavLink>
            ),
            className: "nav-item",
        });

        items.push({
            key: `/${userRole}/class-scheduling`,
            icon: <ScheduleOutlined />,
            label: (
                <NavLink
                    to={`/${userRole}/class-scheduling`}
                    className="nav-link"
                >
                    <span className="nav-link-text">Class Scheduling</span>
                </NavLink>
            ),
            className: "nav-item",
        });

        items.push({
            key: `/${userRole}/academic-programs`,
            icon: <ApartmentOutlined />,
            label: (
                <NavLink
                    to={`/${userRole}/academic-programs`}
                    className="nav-link"
                >
                    <span className="nav-link-text">Academic Programs</span>
                </NavLink>
            ),
            className: "nav-item",
        });

        items.push({
            key: `/${userRole}/subject-enlistment`,
            icon: <ProfileOutlined />,
            label: (
                <NavLink
                    to={`/${userRole}/subject-enlistment`}
                    className="nav-link"
                >
                    <span className="nav-link-text">Subject Enlistment</span>
                </NavLink>
            ),
            className: "nav-item",
        });

        items.push({
            key: `/${userRole}/classroom-manager`,
            icon: <ProfileOutlined />,
            label: (
                <NavLink
                    to={`/${userRole}/classroom-manager`}
                    className="nav-link"
                >
                    <span className="nav-link-text">Classroom Manager</span>
                </NavLink>
            ),
            className: "nav-item",
        });

        items.push({
            key: `/${userRole}/enlistment-manager`,
            icon: <ProfileOutlined />,
            label: (
                <NavLink
                    to={`/${userRole}/enlistment-manager`}
                    className="nav-link"
                >
                    <span className="nav-link-text">Enlistment Manager</span>
                </NavLink>
            ),
            className: "nav-item",
        });

        items.push({
            key: `system-settings`,
            icon: <SettingOutlined />,
            label: `System Settings`,
            children: [
                {
                    key: "/system-settings/facilities-manager",
                    label: (
                        <NavLink
                            to="/system-settings/facilities-manager"
                            className="nav-link"
                        >
                            <span className="nav-link-text">
                                Facilities Manager
                            </span>
                        </NavLink>
                    ),
                },
                {
                    key: "/system-settings/programs-management",
                    label: (
                        <NavLink
                            to="/system-settings/programs-management"
                            className="nav-link"
                        >
                            <span className="nav-link-text">
                                Programs Manager
                            </span>
                        </NavLink>
                    ),
                },
                {
                    key: "/system-settings/terms-management",
                    label: (
                        <NavLink
                            to="/system-settings/terms-management"
                            className="nav-link"
                        >
                            <span className="nav-link-text">Terms Manager</span>
                        </NavLink>
                    ),
                },
                {
                    key: "/system-settings/posting-management",
                    label: (
                        <NavLink
                            to="/system-settings/posting-management"
                            className="nav-link"
                        >
                            <span className="nav-link-text">
                                Posting Manager
                            </span>
                        </NavLink>
                    ),
                },
            ],
        });
    }

    return (
        <Menu
            theme="blue"
            mode="inline"
            selectedKeys={[location.pathname]}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            style={{
                height: "100%",
                borderRight: 0,
                background: "transparent",
            }}
            items={items}
        />
    );
});

export default SideBarNavList;
