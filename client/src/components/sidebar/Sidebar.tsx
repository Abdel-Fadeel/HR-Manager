import { Card, Typography, List } from "@material-tailwind/react";
import { UserIcon } from "@heroicons/react/24/solid";
import { ChevronRightIcon, PowerIcon } from "@heroicons/react/24/outline";

import SidebarListItem from "./SidebarListItem";
import SidebarAccordion from "./SidebarAccordion";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/slices/authSlice";

export default function SidebarWithContentSeparator() {
  const dispatch = useDispatch();
  return (
    <Card className="min-h-[calc(100vh)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 rounded-none">
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray">
          Welcome, {"Ahmed"}
        </Typography>
      </div>
      <List>
        <SidebarAccordion
          title="Employees"
          list={[
            {
              title: "Cancelled",
              icon: <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />,
              href: "cancelled",
            },
          ]}
        />
        <SidebarAccordion
          title="Reports"
          list={[
            {
              title: "Activity Log",
              icon: <ChevronRightIcon className="h-5 w-5" />,
              href: "reports/activity-log",
            },
            {
              title: "Drivers",
              icon: <ChevronRightIcon className="h-5 w-5" />,
              href: "reports/driver",
            },
            {
              title: "ID",
              icon: <ChevronRightIcon className="h-5 w-5" />,
              href: "reports/id",
            },
            {
              title: "Expired ID",
              icon: <ChevronRightIcon className="h-5 w-5" />,
              href: "reports/expired-id",
            },
            {
              title: "Passport",
              icon: <ChevronRightIcon className="h-5 w-5" />,
              href: "reports/passport",
            },
            {
              title: "Vacations",
              icon: <ChevronRightIcon className="h-5 w-5" />,
              href: "reports/vacations",
            },
            {
              title: "Status",
              icon: <ChevronRightIcon className="h-5 w-5" />,
              href: "reports/status",
            },
          ]}
        />
        <hr className="my-2 border-blue-gray-50" />
        {[
          {
            title: "profile",
            icon: <UserIcon className="h-5 w-5" />,
            href: "profile",
          },
          {
            title: "Log Out",
            icon: <PowerIcon className="h-5 w-5" />,
            onClick: () => dispatch(authActions.logout()),
          },
        ].map((item) => (
          <SidebarListItem
            key={item.title}
            title={item.title}
            icon={item.icon}
            href={item.href}
            onClick={item.onClick}
          />
        ))}
      </List>
    </Card>
  );
}