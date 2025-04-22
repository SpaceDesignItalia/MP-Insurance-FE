import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useState } from "react";
import Logo from "../../assets/MpLogo.png";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  requiredCondition: boolean;
  current: boolean;
}

export default function NavbarComponent() {
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
      icon: <Icon fontSize={23} icon="solar:home-linear" />,
      requiredCondition: true,
      current: isSubRoute({
        currentUrl,
        parentRoute: { href: "/", subRoutes: ["/policy/add-policy"] },
      }),
    },
    {
      name: "Clienti",
      href: "/customers",
      icon: <Icon fontSize={23} icon="solar:users-group-two-rounded-linear" />,
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
      icon: <Icon fontSize={23} icon="solar:calendar-linear" />,
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

  return (
    <Navbar
      classNames={{
        base: "py-4 backdrop-filter-none bg-transparent",
        wrapper: "px-0 w-full justify-center bg-transparent",
        item: "hidden md:flex",
      }}
      height="54px"
      isMenuOpen={isOpen}
      onMenuOpenChange={setIsOpen}
    >
      <NavbarContent
        className="gap-4 rounded-full border-small border-default-200/20 bg-background/60 px-2 shadow-medium backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50"
        justify="center"
      >
        {/* Toggle */}
        <NavbarMenuToggle className="ml-2 text-default-400 md:hidden" />

        {/* Items */}
        {navigation.map((item, index) => (
          <NavbarItem key={index} isActive={item.current} className="px-2">
            <Link
              className={
                item.current
                  ? "bg-black text-white px-3 py-1.5 rounded-full"
                  : "text-default-500"
              }
              href={item.href}
              size="sm"
              aria-current={item.current ? "page" : undefined}
              color={item.current ? "foreground" : undefined}
            >
              <div className="flex items-center gap-2">
                {item.icon}
                {item.name}
              </div>
            </Link>
          </NavbarItem>
        ))}

        {/* Profile dropdown */}
        <NavbarItem className="ml-2 !flex">
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
              <DropdownItem key="logout" color="danger" onPress={logout}>
                <div className="flex flex-row gap-2 ">
                  <Icon fontSize={23} icon="solar:logout-linear" />
                  Logout
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>

      {/* Menu */}
      <NavbarMenu
        className="top-[calc(var(--navbar-height)/2)] mx-auto mt-16 max-h-[40vh] w-full rounded-large border-small border-default-200/20 bg-background/60 py-6 shadow-medium backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50"
        motionProps={{
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
          transition: {
            ease: "easeInOut",
            duration: 0.2,
          },
        }}
      >
        {navigation.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              className={`w-full ${
                item.current
                  ? "bg-black text-white px-3 py-1.5 rounded-full"
                  : "text-default-500"
              }`}
              href={item.href}
              size="md"
            >
              <div className="flex items-center gap-2">
                {item.icon}
                {item.name}
              </div>
            </Link>
          </NavbarMenuItem>
        ))}

        <NavbarMenuItem>
          <Link
            className="w-full text-danger-500"
            href="#"
            size="md"
            onClick={logout}
          >
            <div className="flex items-center gap-2">
              <Icon fontSize={23} icon="solar:logout-linear" />
              Logout
            </div>
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
