import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Logo from "../../assets/MpLogo.png";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  requiredCondition: boolean;
  current: boolean;
}

export default function Navbar() {
  const currentUrl = window.location.pathname;
  const [isOpen, setIsOpen] = useState(false);

  function isSubRoute({
    currentUrl,
    parentRoute,
  }: {
    currentUrl: string;
    parentRoute: { href: string; subRoutes: string[] };
  }): boolean {
    if (currentUrl === parentRoute.href) {
      return true;
    }
    if (parentRoute.subRoutes && parentRoute.subRoutes.length > 0) {
      return parentRoute.subRoutes.some((subRoute) =>
        currentUrl.startsWith(subRoute)
      );
    }
    return false;
  }

  const navigation: NavigationItem[] = [
    {
      name: "Dashboard",
      href: "/",
      icon: DashboardOutlinedIcon,
      requiredCondition: true,
      current: isSubRoute({
        currentUrl,
        parentRoute: { href: "/", subRoutes: ["/policy/add-policy"] },
      }),
    },
    {
      name: "Clienti",
      href: "/customers",
      icon: PeopleAltOutlinedIcon,
      requiredCondition: true,
      current: isSubRoute({
        currentUrl,
        parentRoute: {
          href: "/customers",
          subRoutes: [
            "/customers/add-customer",
            "/customers/view-customer-data",
          ],
        },
      }),
    },
    {
      name: "Calendario",
      href: "/calendar",
      icon: CalendarMonthRoundedIcon,
      requiredCondition: true,
      current: isSubRoute({
        currentUrl,
        parentRoute: {
          href: "/calendar",
          subRoutes: [],
        },
      }),
    },
  ];

  function logout() {
    axios
      .get("/Authentication/GET/Logout", { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          window.location.reload();
        }
      });
  }

  function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <img
                alt="Space Design Italia"
                src={Logo}
                className="h-16 w-auto"
              />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item, index) => {
                return (
                  <a
                    key={index}
                    href={item.href}
                    className={classNames(
                      item.current
                        ? " border-primary px-1 pt-1 text-sm font-medium text-primary"
                        : "border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700",
                      "inline-flex justify-center items-center gap-2 border-b-2"
                    )}
                  >
                    <item.icon />
                    {item.name}
                  </a>
                );
              })}
            </div>
          </div>
          <div className="hidden sm:flex flex-1 justify-end items-center gap-x-4 self-stretch lg:gap-x-6">
            {/* Profile dropdown */}
            <Dropdown placement="bottom-start" radius="sm">
              <DropdownTrigger>
                <div className="-m-1.5 flex items-center p-1.5 cursor-pointer">
                  <Avatar
                    className="h-8 w-8 rounded-full bg-gray-100"
                    alt=""
                    src={Logo}
                  />
                  <span className="hidden lg:flex lg:items-center">
                    <ChevronDownIcon
                      className="ml-2 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem key="logout" color="danger" onClick={logout}>
                  <div className="flex flex-row gap-2 ">
                    <LogoutRoundedIcon className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-danger" />
                    Logout
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden"
          >
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "border-primary bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-primary"
                      : "border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700",
                    "border-l-4 flex items-center gap-2"
                  )}
                >
                  <item.icon />
                  {item.name}
                </a>
              ))}
            </div>
            <div className="border-t border-gray-200 pb-3 pt-4">
              <div className="mt-3 space-y-1">
                <a
                  href="#"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                >
                  Logout
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
