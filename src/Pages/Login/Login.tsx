import { useState, useEffect } from "react";
import { Button, Checkbox, Input, Card, CardBody } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
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
    const { name, value } = e;
    setLoginData({ ...loginData, [name]: value });
  };

  const checkDataCompleted = () => {
    return loginData.email === "" || loginData.password === "";
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardBody className="p-6">
            <div className="text-center mb-6">
              <img
                alt="MP Insurance Logo"
                src={logo}
                className="mx-auto h-16 w-auto mb-4"
              />
              <h2 className="text-xl font-semibold">Accedi al portale</h2>
              <p className="text-foreground/40 text-sm mt-2">
                Inserisci le tue credenziali per accedere
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                isRequired
                name="email"
                type="email"
                label="Email"
                variant="bordered"
                radius="sm"
                placeholder="example@gmail.com"
                isInvalid={isAlertVisible}
                onChange={(e) => handleInputChange(e.target)}
                startContent={
                  <Icon
                    icon="solar:user-linear"
                    className="text-foreground/40"
                  />
                }
              />

              <Input
                isRequired
                name="password"
                type={isPasswordVisible ? "text" : "password"}
                label="Password"
                variant="bordered"
                radius="sm"
                placeholder="Inserisci la password"
                isInvalid={isAlertVisible}
                onChange={(e) => handleInputChange(e.target)}
                startContent={
                  <Icon
                    icon="solar:lock-linear"
                    className="text-foreground/40"
                  />
                }
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
                    href="/forgot-password"
                    className="font-semibold text-foreground hover:text-foreground/80"
                  >
                    Password dimenticata?
                  </a>
                </div>
              </div>

              <Button
                radius="sm"
                type="submit"
                isLoading={isLogging}
                isDisabled={checkDataCompleted()}
                fullWidth
                className="bg-foreground text-background hover:bg-foreground/80"
              >
                {isLogging ? "Accesso in corso..." : "Accedi"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-foreground/40">
              Powered By {""}
              <a
                href="https://www.spacedesign-italia.it"
                className="font-semibold leading-6 text-red-600 hover:text-red-400"
              >
                Space Design Italia 🚀
              </a>
            </p>
          </CardBody>
        </Card>
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
