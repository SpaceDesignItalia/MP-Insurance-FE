import { Button, Card, CardBody, Input, InputOtp } from "@heroui/react";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("/Authentication/POST/RequestPasswordReset", { email });
      setStep(2);
    } catch (error) {
      setError("Email non trovata");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("/Authentication/POST/VerifyOTP", { email, otp });
      setStep(3);
    } catch (error) {
      setError("Codice non valido");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Le password non coincidono");
      return;
    }
    setLoading(true);
    setError("");
    try {
      console.log(email, password);
      await axios.post("/Authentication/POST/ResetPassword", {
        email,
        otp,
        password,
      });
      navigate("/login");
    } catch (error) {
      setError("Errore durante il reset della password");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <Icon
                icon="solar:letter-linear"
                className="text-foreground mx-auto mb-2"
                width={40}
              />
              <h2 className="text-xl font-semibold">Recupera Password</h2>
              <p className="text-foreground/40 text-sm mt-2">
                Inserisci la tua email per ricevere il codice di recupero
              </p>
            </div>
            <Input
              type="email"
              label="Email"
              placeholder="Inserisci la tua email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="bordered"
              radius="sm"
              startContent={
                <Icon icon="solar:user-linear" className="text-foreground/40" />
              }
              isRequired
            />

            <Button
              type="submit"
              color="default"
              className="w-full bg-foreground text-background hover:bg-foreground/80"
              radius="sm"
              isLoading={loading}
            >
              Invia codice
            </Button>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <Icon
                icon="solar:shield-keyhole-linear"
                className="text-foreground mx-auto mb-2"
                width={40}
              />
              <h2 className="text-xl font-semibold">Verifica Codice</h2>
              <p className="text-foreground/40 text-sm mt-2">
                Inserisci il codice di verifica ricevuto via email
              </p>
            </div>
            <div className="flex justify-center">
              <InputOtp
                length={6}
                value={otp}
                onValueChange={(value: string) => setOtp(value)}
                variant="underlined"
                color="default"
                radius="sm"
                classNames={{
                  input: "text-2xl",
                }}
              />
            </div>
            <div className="flex justify-between items-center">
              <Button
                variant="light"
                radius="sm"
                startContent={<Icon icon="solar:arrow-left-linear" />}
                onPress={() => setStep(1)}
              >
                Indietro
              </Button>
              <Button
                type="submit"
                color="default"
                radius="sm"
                isLoading={loading}
                className="bg-foreground text-background hover:bg-foreground/80"
              >
                Verifica
              </Button>
            </div>
          </form>
        );

      case 3:
        return (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <Icon
                icon="solar:lock-password-linear"
                className="text-foreground mx-auto mb-2"
                width={40}
              />
              <h2 className="text-xl font-semibold">Nuova Password</h2>
              <p className="text-foreground/40 text-sm mt-2">
                Inserisci la tua nuova password
              </p>
            </div>
            <Input
              type="password"
              label="Password"
              placeholder="Inserisci la nuova password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="bordered"
              radius="sm"
              startContent={
                <Icon icon="solar:lock-linear" className="text-foreground/40" />
              }
              isRequired
            />
            <Input
              type="password"
              label="Conferma Password"
              placeholder="Conferma la nuova password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              variant="bordered"
              radius="sm"
              startContent={
                <Icon icon="solar:lock-linear" className="text-foreground/40" />
              }
              isRequired
            />
            <div className="flex justify-between items-center">
              <Button
                variant="light"
                radius="sm"
                startContent={<Icon icon="solar:arrow-left-linear" />}
                onPress={() => setStep(2)}
                className="bg-foreground text-background hover:bg-foreground/80"
              >
                Indietro
              </Button>
              <Button
                type="submit"
                color="default"
                radius="sm"
                isLoading={loading}
                className="bg-foreground text-background hover:bg-foreground/80"
              >
                Conferma
              </Button>
            </div>
          </form>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardBody className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-danger-50 text-danger text-sm rounded-lg">
              {error}
            </div>
          )}
          {renderStep()}
        </CardBody>
      </Card>
    </div>
  );
}
