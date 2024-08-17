import { useState, useEffect } from "react";
import { Button, Checkbox, Input } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import logo from "../../assets/MpLogo.png";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";

interface LoginDataProps {
  email: string;
  password: string;
  remember: boolean;
}

export default function Login() {
  document.title = "Login | MP Insurance";
  const [isLogging, setIsLogging] = useState<boolean>(false);
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [loginData, setLoginData] = useState<LoginDataProps>({
    email: "",
    password: "",
    remember: false,
  });

  const handleInputChange = (e: any) => {
    setLoginData({ ...loginData, [e.name]: e.value });
  };

  const checkDataCompleted = () => {
    return loginData.email === "" || loginData.password === "";
  };

  async function handleLogin() {
    try {
      setIsLogging(true);
      const res = await axios.post(
        "/Authentication/POST/Login",
        {
          LoginData: loginData,
        },
        { withCredentials: true }
      );
      if (res.status == 200) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error(error);
      setIsLogging(false);
      setIsAlertVisible(true);
    }
  }

  return (
    <>
      <AnimatePresence>
        {isAlertVisible && (
          <LoginAlert onClose={() => setIsAlertVisible(false)} />
        )}
      </AnimatePresence>
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            alt="MP Insurance Logo"
            src={logo}
            className="mx-auto h-24 w-auto"
          />
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Accedi al portale
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 border-2 shadow-xl sm:rounded-xl sm:px-12">
            <form action="#" method="POST" className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email
                </label>
                <div className="mt-2">
                  <Input
                    isRequired
                    name="email"
                    type="email"
                    variant="bordered"
                    radius="sm"
                    placeholder="example@gmail.com"
                    isInvalid={isAlertVisible}
                    onChange={(e) => handleInputChange(e.target)}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <Input
                    isRequired
                    name="password"
                    type={isPasswordVisible ? "text" : "password"}
                    variant="bordered"
                    radius="sm"
                    placeholder="Inserisci la password"
                    isInvalid={isAlertVisible}
                    onChange={(e) => handleInputChange(e.target)}
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        aria-label="visibility password"
                      >
                        {isPasswordVisible ? (
                          <VisibilityOffOutlinedIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <VisibilityOutlinedIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox
                    radius="sm"
                    color="primary"
                    isSelected={loginData.remember}
                    onValueChange={(e) =>
                      setLoginData({
                        ...loginData,
                        remember: e,
                      })
                    }
                  >
                    Ricordami
                  </Checkbox>
                </div>

                <div className="text-sm leading-6">
                  <a
                    href="#"
                    className="font-semibold text-primary hover:text-primary-500"
                  >
                    Password dimenticata?
                  </a>
                </div>
              </div>

              <div>
                <Button
                  radius="sm"
                  color="primary"
                  type="submit"
                  isLoading={isLogging}
                  isDisabled={checkDataCompleted()}
                  onClick={handleLogin}
                  fullWidth
                >
                  {isLogging ? "Accesso in corso..." : "Accedi"}
                </Button>
              </div>
            </form>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Powered By {""}
            <a
              href="https://www.spacedesign-italia.it"
              className="font-semibold leading-6 text-red-600 hover:text-red-400"
            >
              Space Design Italia 🚀
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

const LoginAlert = ({ onClose }: { onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Chiude l'alert dopo 3 secondi

    return () => clearTimeout(timer); // Pulisce il timer se il componente viene smontato
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute top-5 right-5 rounded-md bg-red-50 p-4 w-1/3"
    >
      <div className="flex justify-between items-start">
        <div className="flex">
          <HighlightOffOutlinedIcon
            aria-hidden="true"
            className="h-5 w-5 text-red-400"
          />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Errore durante l'accesso!
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <ul role="list" className="list-disc space-y-1 pl-5">
                <li>L'email potrebbe essere sbagliata</li>
                <li>La password potrebbe essere sbagliata</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
