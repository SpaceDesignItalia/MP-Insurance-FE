import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  Avatar,
  Button,
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
import { useState, useRef, useEffect } from "react";
import Logo from "../../assets/MpLogo.png";
import { useTheme } from "../../contexts/ThemeContext";

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
  const { isDarkMode, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [dropdownAnimation, setDropdownAnimation] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showUserMenu) {
      setDropdownAnimation("animate-dropdown-open");
    } else {
      setDropdownAnimation("");
    }
  }, [showUserMenu]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      name: "Sinistri",
      href: "/accident",
      icon: <Icon fontSize={23} icon="hugeicons:accident" />,
      requiredCondition: true,
      current: isSubRoute({
        currentUrl,
        parentRoute: { href: "/lefts", subRoutes: ["/policy/add-policy"] },
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

        {/* Custom Profile dropdown */}
        <NavbarItem className="ml-2 !flex">
          <div
            className="relative flex items-center justify-center"
            ref={dropdownRef}
          >
            <div
              className="-m-1.5 flex items-center p-1.5 cursor-pointer"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <Avatar
                className="h-8 w-8 rounded-full bg-gray-100"
                alt=""
                src={Logo}
              />
              <span className="hidden lg:flex lg:items-center">
                <ChevronDownIcon
                  className={`ml-2 h-5 w-5 text-gray-400 transition-transform duration-200 ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </span>
            </div>

            {showUserMenu && (
              <div
                className={`absolute w-56 rounded-xl overflow-hidden shadow-xl z-50 ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } ${dropdownAnimation}`}
                style={{
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  marginTop: "0.5rem",
                  opacity: 0,
                  animation: "dropdownFade 0.3s ease forwards",
                }}
              >
                <style>
                  {`
                  @keyframes dropdownFade {
                    from {
                      opacity: 0;
                      transform: translateY(-10px) translateX(-50%);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0) translateX(-50%);
                    }
                  }
                  `}
                </style>

                <div className="p-1">
                  {/* Theme toggle button */}
                  <button
                    onClick={toggleTheme}
                    className={`flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors ${
                      isDarkMode
                        ? "text-white hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon
                      fontSize={20}
                      icon={
                        isDarkMode ? "solar:sun-2-linear" : "solar:moon-linear"
                      }
                      className="mr-2"
                    />
                    {isDarkMode ? "Modalità chiara" : "Modalità scura"}
                  </button>

                  {/* Logout button */}
                  <button
                    onClick={logout}
                    className={`flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors ${
                      isDarkMode
                        ? "text-white hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon
                      fontSize={20}
                      icon="solar:logout-linear"
                      className="mr-2"
                    />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
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
