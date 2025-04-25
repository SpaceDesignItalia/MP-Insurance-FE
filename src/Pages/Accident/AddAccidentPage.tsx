import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Chip,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Tab,
  Tabs,
  Textarea,
  Tooltip,
  useDisclosure
} from "@heroui/react";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface Policy {
  id: number;
  policyNumber: string;
  customerName: string;
  vehiclePlate: string;
}

interface Vehicle {
  id: number;
  plate: string;
  brand: string;
  model: string;
}

export default function AddAccidentPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedTab, setSelectedTab] = useState("general");
  const [completionPercentage, setCompletionPercentage] = useState(20);
  const [formTouched, setFormTouched] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  
  const [generalData, setGeneralData] = useState({
    date: "",
    time: "",
    location: "",
    description: "",
    policyId: "",
    status: "Aperto",
    weather: "",
    roadConditions: "",
    visibility: "Buona",
    coordinates: {
      lat: 0,
      lng: 0
    }
  });

  const [partecipantsData, setPartecipantsData] = useState([
    {
      vehicleId: "",
      role: "Responsabile",
      damages: "",
      injured: false
    }
  ]);

  const [witnessesData, setWitnessesData] = useState([
    {
      firstName: "",
      lastName: "",
      phone: "",
      email: ""
    }
  ]);

  const [documentsData, setDocumentsData] = useState([
    {
      type: "Foto",
      file: null
    }
  ]);

  const [liquidationData, setLiquidationData] = useState({
    estimatedAmount: "",
    liquidatedAmount: "",
    liquidationDate: "",
    deductible: "",
    responsibilityPercentage: "100"
  });

  const weatherOptions = [
    { value: "Soleggiato", icon: "solar:sun-bold" },
    { value: "Nuvoloso", icon: "solar:cloud-bold" },
    { value: "Pioggia", icon: "solar:cloud-rain-bold" },
    { value: "Nebbia", icon: "solar:fog-bold" },
    { value: "Neve", icon: "solar:snowflake-bold" },
    { value: "Grandine", icon: "solar:cloud-snow-bold" }
  ];

  const roadConditions = [
    { value: "Asciutto", color: "success" },
    { value: "Bagnato", color: "primary" },
    { value: "Ghiacciato", color: "danger" },
    { value: "Neve", color: "default" },
    { value: "Dissestato", color: "warning" }
  ];

  useEffect(() => {
    fetchPolicies();
    fetchVehicles();
    calculateCompletion();
    
    // Simula inizializzazione della mappa
    if (mapRef.current) {
      setTimeout(() => {
        const mapElement = mapRef.current;
        if (mapElement) {
          mapElement.classList.add('map-loaded');
        }
      }, 500);
    }
  }, []);

  useEffect(() => {
    if (formTouched) {
      calculateCompletion();
    }
  }, [generalData, partecipantsData, witnessesData, documentsData, liquidationData, formTouched]);

  const calculateCompletion = () => {
    let totalScore = 0;
    let totalWeight = 100;
    
    // Calcola punteggio per i dati generali (30%)
    const generalWeight = 30;
    let generalScore = 0;
    if (generalData.date) generalScore += 6;
    if (generalData.time) generalScore += 6;
    if (generalData.location) generalScore += 6;
    if (generalData.policyId) generalScore += 6;
    if (generalData.description) generalScore += 6;
    totalScore += (generalScore / 30) * generalWeight;
    
    // Calcola punteggio per i partecipanti (25%)
    const participantsWeight = 25;
    let participantsScore = 0;
    const hasValidParticipants = partecipantsData.every(p => p.vehicleId);
    if (hasValidParticipants) participantsScore = 25;
    totalScore += (participantsScore / 25) * participantsWeight;
    
    // Calcola punteggio per i testimoni (15%)
    const witnessesWeight = 15;
    let witnessesScore = 0;
    const hasWitnesses = witnessesData.some(w => w.firstName && w.lastName);
    if (hasWitnesses) witnessesScore = 15;
    totalScore += (witnessesScore / 15) * witnessesWeight;
    
    // Calcola punteggio per i documenti (15%)
    const documentsWeight = 15;
    let documentsScore = 0;
    const hasDocuments = documentsData.some(d => d.file);
    if (hasDocuments) documentsScore = 15;
    totalScore += (documentsScore / 15) * documentsWeight;
    
    // Calcola punteggio per la liquidazione (15%)
    const liquidationWeight = 15;
    let liquidationScore = 0;
    if (liquidationData.estimatedAmount) liquidationScore += 7.5;
    if (liquidationData.deductible) liquidationScore += 7.5;
    totalScore += (liquidationScore / 15) * liquidationWeight;
    
    setCompletionPercentage(Math.round(totalScore));
  };

  const fetchPolicies = async () => {
    try {
      const res = await axios.get("/Policy/GET/GetActivePolicies", {
        withCredentials: true,
      });
      setPolicies(res.data);
    } catch (error) {
      console.error("Error fetching policies:", error);
    }
  };

  const fetchVehicles = async () => {
    try {
      const res = await axios.get("/Vehicle/GET/GetAllVehicles", {
        withCredentials: true,
      });
      setVehicles(res.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const handleGeneralChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormTouched(true);
    const { name, value } = e.target;
    setGeneralData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePartecipantChange = (index: number, field: string, value: any) => {
    setFormTouched(true);
    setPartecipantsData(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };

  const handleWitnessChange = (index: number, field: string, value: string) => {
    setFormTouched(true);
    setWitnessesData(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };

  const handleDocumentChange = (index: number, field: string, value: any) => {
    setFormTouched(true);
    setDocumentsData(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });

    // Anteprima se è un file
    if (field === 'file' && value instanceof File) {
      const reader = new FileReader();
      reader.onload = () => {
        const newDocuments = [...documentsData];
        newDocuments[index].file = value;
        setDocumentsData(newDocuments);
      };
      reader.readAsDataURL(value);
    }
  };

  const handleLiquidationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormTouched(true);
    const { name, value } = e.target;
    setLiquidationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addPartecipant = () => {
    setPartecipantsData(prev => [
      ...prev, 
      {
        vehicleId: "",
        role: "Danneggiato",
        damages: "",
        injured: false
      }
    ]);
  };

  const removePartecipant = (index: number) => {
    if (partecipantsData.length > 1) {
      setPartecipantsData(prev => prev.filter((_, i) => i !== index));
    }
  };

  const addWitness = () => {
    setWitnessesData(prev => [
      ...prev, 
      {
        firstName: "",
        lastName: "",
        phone: "",
        email: ""
      }
    ]);
  };

  const removeWitness = (index: number) => {
    if (witnessesData.length > 1) {
      setWitnessesData(prev => prev.filter((_, i) => i !== index));
    }
  };

  const addDocument = () => {
    setDocumentsData(prev => [
      ...prev, 
      {
        type: "Foto",
        file: null
      }
    ]);
  };

  const removeDocument = (index: number) => {
    if (documentsData.length > 1) {
      setDocumentsData(prev => prev.filter((_, i) => i !== index));
    }
  };

  const openImagePreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewImage(e.target.result as string);
        onOpen();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Costruisci l'oggetto dati completo
      const accidentData = {
        ...generalData,
        policyId: Number(generalData.policyId),
        partecipants: partecipantsData.map(p => ({
          ...p,
          vehicleId: Number(p.vehicleId)
        })),
        witnesses: witnessesData,
        documents: documentsData,
        liquidation: {
          ...liquidationData,
          estimatedAmount: Number(liquidationData.estimatedAmount),
          liquidatedAmount: liquidationData.liquidatedAmount ? Number(liquidationData.liquidatedAmount) : 0,
          deductible: Number(liquidationData.deductible),
          responsibilityPercentage: Number(liquidationData.responsibilityPercentage)
        }
      };

      // Simulazione caricamento
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Chiamata API per salvare l'incidente
      await axios.post(
        "/Accident/POST/CreateAccident",
        accidentData,
        { withCredentials: true }
      );
      
      navigate("/accident");
    } catch (error) {
      console.error("Error creating accident:", error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    // Controlla che i campi obbligatori siano compilati
    if (!generalData.date || !generalData.time || !generalData.location || !generalData.policyId) {
      return false;
    }

    // Controlla che ogni partecipante abbia un veicolo selezionato
    if (partecipantsData.some(p => !p.vehicleId)) {
      return false;
    }

    // Controlla che la liquidazione abbia almeno l'importo stimato
    if (!liquidationData.estimatedAmount) {
      return false;
    }

    return true;
  };

  const generateWithAI = () => {
    setAiGenerating(true);
    
    // Simula l'elaborazione AI
    setTimeout(() => {
      // Aggiunge una descrizione generata dall'AI
      const aiDescriptions = [
        "Incidente avvenuto all'incrocio tra via Roma e corso Italia. Il veicolo A procedeva da nord verso sud quando, giunto all'incrocio, impattava con il veicolo B che proveniva da ovest. Entrambi i conducenti dichiarano di aver rispettato il semaforo verde. Danni riportati: veicolo A, danneggiamento della parte anteriore destra; veicolo B, danneggiamento della parte anteriore sinistra.",
        "Sinistro verificatosi sulla strada statale 106 in direzione nord. Il veicolo assicurato procedeva nella propria corsia quando, a causa dell'asfalto bagnato, perdeva il controllo slittando e urtando il guardrail sul lato destro. Non si segnalano altri veicoli coinvolti. Danni riportati: fiancata destra, paraurti anteriore e cerchione anteriore destro.",
        "Tamponamento a catena avvenuto in autostrada A1 km 34 in direzione sud. Il veicolo C, a causa di un improvviso rallentamento del traffico, urtava il veicolo B che, a sua volta, impattava contro il veicolo A. I tre conducenti confermano la dinamica. Si segnalano danni di lieve entità ai paraurti posteriori dei veicoli A e B e al paraurti anteriore del veicolo C."
      ];
      
      const randomDesc = aiDescriptions[Math.floor(Math.random() * aiDescriptions.length)];
      setGeneralData(prev => ({...prev, description: randomDesc}));
      
      // Aggiunge dettagli ai danni
      if (partecipantsData.length > 0) {
        const damageDescriptions = [
          "Paraurti anteriore danneggiato, faro destro rotto, cofano ammaccato",
          "Fiancata sinistra graffiata, specchietto retrovisore sinistro divelto",
          "Paraurti posteriore ammaccato, portellone posteriore danneggiato"
        ];
        
        setPartecipantsData(prev => {
          return prev.map((p, i) => ({
            ...p, 
            damages: damageDescriptions[i % damageDescriptions.length]
          }));
        });
      }
      
      setAiGenerating(false);
      setFormTouched(true);
    }, 2000);
  };

  const getWeatherByLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          // In una vera implementazione, chiameresti un'API meteo
          // Qui simulo una risposta casuale
          const weatherTypes = weatherOptions.map(w => w.value);
          const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
          
          setGeneralData(prev => ({
            ...prev, 
            weather: randomWeather,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
          
          // Simula l'aggiornamento della posizione sulla mappa
          if (mapRef.current) {
            const marker = document.createElement('div');
            marker.className = 'map-marker';
            marker.innerHTML = '<div class="marker-pin"></div>';
            mapRef.current.appendChild(marker);
          }
        } catch (error) {
          console.error("Errore nel recupero delle informazioni meteo:", error);
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4">
        <Card className="mx-auto max-w-5xl">
          <CardHeader className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Nuovo Incidente</h1>
              <p className="text-slate-500 mt-1">Compila il form per registrare un nuovo incidente</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:block">
                <Progress 
                  value={completionPercentage} 
                  size="sm" 
                  color={completionPercentage > 80 ? "success" : (completionPercentage > 40 ? "primary" : "warning")}
                  className="max-w-md" 
                  
                  showValueLabel={true}
                />
              </div>
              <Button
                variant="light"
                onPress={() => navigate("/accident")}
                startContent={<Icon icon="heroicons:arrow-left" className="w-4 h-4" />}
              >
                Indietro
              </Button>
            </div>
          </CardHeader>

          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(key as string)}
                aria-label="Accident form tabs"
                color="primary"
                variant="underlined"
                classNames={{
                  tabList: "gap-6",
                  cursor: "bg-primary-500",
                }}
              >
                <Tab 
                  key="general" 
                  title={
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:info-circle-linear" className="w-4 h-4" />
                      <span>Generale</span>
                    </div>
                  }
                >
                  <div className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Data *</label>
                        <Input
                          type="date"
                          name="date"
                          value={generalData.date}
                          onChange={handleGeneralChange}
                          required
                          variant="bordered"
                          className="max-w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Ora *</label>
                        <Input
                          type="time"
                          name="time"
                          value={generalData.time}
                          onChange={handleGeneralChange}
                          required
                          variant="bordered"
                          className="max-w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Luogo *</label>
                        <div className="relative">
                          <Input
                            type="text"
                            name="location"
                            value={generalData.location}
                            onChange={handleGeneralChange}
                            required
                            variant="bordered"
                            placeholder="Via/Piazza, Città"
                            className="max-w-full pr-10"
                          />
                          <Tooltip content="Rileva posizione attuale">
                            <button
                              type="button"
                              onClick={getWeatherByLocation}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-primary-500"
                            >
                              <Icon icon="solar:map-point-linear" className="w-5 h-5" />
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Polizza *</label>
                        <Select
                          name="policyId"
                          selectedKeys={generalData.policyId ? [generalData.policyId] : []}
                          onChange={(e) => setGeneralData(prev => ({...prev, policyId: e.target.value}))}
                          required
                          variant="bordered"
                          items={[
                            { id: "", text: "Seleziona una polizza" },
                            ...(policies || []).map(policy => ({
                              id: policy?.id?.toString() || "",
                              text: policy ? `${policy.policyNumber} - ${policy.customerName} - ${policy.vehiclePlate}` : ""
                            }))
                          ]}
                        >
                          {(item) => (
                            <SelectItem key={item.id}>
                              {item.text}
                            </SelectItem>
                          )}
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Condizioni meteo</label>
                        <div className="flex flex-wrap gap-2">
                          {weatherOptions.map((option) => (
                            <Chip
                              key={option.value}
                              variant={generalData.weather === option.value ? "solid" : "bordered"}
                              color={generalData.weather === option.value ? "primary" : "default"}
                              startContent={<Icon icon={option.icon} className="w-4 h-4" />}
                              className="cursor-pointer"
                              onClick={() => setGeneralData(prev => ({...prev, weather: option.value}))}
                            >
                              {option.value}
                            </Chip>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Condizioni stradali</label>
                        <div className="flex flex-wrap gap-2">
                          {roadConditions.map((condition) => (
                            <Chip
                              key={condition.value}
                              variant={generalData.roadConditions === condition.value ? "solid" : "bordered"}
                              color={generalData.roadConditions === condition.value ? condition.color : "default"}
                              className="cursor-pointer"
                              onClick={() => setGeneralData(prev => ({...prev, roadConditions: condition.value}))}
                            >
                              {condition.value}
                            </Chip>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-slate-700">Stato</label>
                        <Select
                          name="status"
                          selectedKeys={[generalData.status]}
                          onChange={(e) => setGeneralData(prev => ({...prev, status: e.target.value}))}
                          variant="bordered"
                        >
                          <SelectItem key="Aperto">Aperto</SelectItem>
                          <SelectItem key="In Lavorazione">In Lavorazione</SelectItem>
                          <SelectItem key="Liquidato">Liquidato</SelectItem>
                          <SelectItem key="Chiuso">Chiuso</SelectItem>
                          <SelectItem key="Rifiutato">Rifiutato</SelectItem>
                        </Select>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium text-slate-700">Descrizione</label>
                          <Button
                            size="sm"
                            variant="flat"
                            color="primary"
                            startContent={<Icon icon="solar:magic-stick-linear" className="w-4 h-4" />}
                            isLoading={aiGenerating}
                            onPress={generateWithAI}
                          >
                            Genera con AI
                          </Button>
                        </div>
                        <Textarea
                          name="description"
                          value={generalData.description}
                          onChange={handleGeneralChange}
                          variant="bordered"
                          placeholder="Descrivi cosa è successo..."
                          minRows={3}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <div className="border border-dashed border-slate-300 rounded-lg p-3 bg-slate-50">
                          <div className="flex items-center space-x-2 text-sm text-slate-600 mb-2">
                            <Icon icon="solar:map-linear" className="w-5 h-5 text-primary-500" />
                            <span className="font-medium">Posizione dell'incidente</span>
                          </div>
                          <div 
                            ref={mapRef} 
                            className="w-full h-48 bg-slate-100 rounded-lg relative overflow-hidden map-container"
                          >
                            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                              <p>Mappa interattiva</p>
                              <div className="map-loading absolute inset-0 bg-slate-100 flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab>
                
                <Tab 
                  key="partecipants" 
                  title={
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:car-linear" className="w-4 h-4" />
                      <span>Partecipanti</span>
                    </div>
                  }
                >
                  <div className="mt-6 space-y-6">
                    {partecipantsData.map((partecipant, index) => (
                      <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium text-slate-900">Veicolo {index + 1}</h3>
                          {partecipantsData.length > 1 && (
                            <Button
                              isIconOnly
                              variant="light"
                              color="danger"
                              onPress={() => removePartecipant(index)}
                            >
                              <Icon icon="solar:trash-bin-trash-linear" className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Veicolo *</label>
                            <Select
                              selectedKeys={partecipant.vehicleId ? [partecipant.vehicleId] : []}
                              onChange={(e) => handlePartecipantChange(index, 'vehicleId', e.target.value)}
                              required
                              variant="bordered"
                              items={[
                                { id: "", text: "Seleziona un veicolo" },
                                ...(vehicles || []).map(vehicle => ({
                                  id: vehicle?.id?.toString() || "",
                                  text: vehicle ? `${vehicle.plate} - ${vehicle.brand} ${vehicle.model}` : ""
                                }))
                              ]}
                            >
                              {(item) => (
                                <SelectItem key={item.id}>
                                  {item.text}
                                </SelectItem>
                              )}
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Ruolo</label>
                            <RadioGroup
                              value={partecipant.role}
                              onValueChange={(value) => handlePartecipantChange(index, 'role', value)}
                              orientation="horizontal"
                            >
                              <Radio value="Responsabile">Responsabile</Radio>
                              <Radio value="Danneggiato">Danneggiato</Radio>
                              <Radio value="Terzo">Terzo</Radio>
                            </RadioGroup>
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-700">Danni rilevati</label>
                            <Textarea
                              value={partecipant.damages}
                              onChange={(e) => handlePartecipantChange(index, 'damages', e.target.value)}
                              variant="bordered"
                              placeholder="Descrivi i danni rilevati..."
                              minRows={2}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Checkbox
                              isSelected={partecipant.injured}
                              onValueChange={(checked) => handlePartecipantChange(index, 'injured', checked)}
                            >
                              Presenza di feriti
                            </Checkbox>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-center">
                      <Button
                        variant="flat"
                        color="primary"
                        onPress={addPartecipant}
                        startContent={<Icon icon="solar:add-circle-linear" className="w-4 h-4" />}
                      >
                        Aggiungi veicolo
                      </Button>
                    </div>
                  </div>
                </Tab>
                
                <Tab 
                  key="witnesses" 
                  title={
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:users-group-rounded-linear" className="w-4 h-4" />
                      <span>Testimoni</span>
                    </div>
                  }
                >
                  <div className="mt-6 space-y-6">
                    {witnessesData.map((witness, index) => (
                      <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium text-slate-900">Testimone {index + 1}</h3>
                          {witnessesData.length > 1 && (
                            <Button
                              isIconOnly
                              variant="light"
                              color="danger"
                              onPress={() => removeWitness(index)}
                            >
                              <Icon icon="solar:trash-bin-trash-linear" className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Nome</label>
                            <Input
                              type="text"
                              value={witness.firstName}
                              onChange={(e) => handleWitnessChange(index, 'firstName', e.target.value)}
                              variant="bordered"
                              placeholder="Nome"
                              className="max-w-full"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Cognome</label>
                            <Input
                              type="text"
                              value={witness.lastName}
                              onChange={(e) => handleWitnessChange(index, 'lastName', e.target.value)}
                              variant="bordered"
                              placeholder="Cognome"
                              className="max-w-full"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Telefono</label>
                            <Input
                              type="tel"
                              value={witness.phone}
                              onChange={(e) => handleWitnessChange(index, 'phone', e.target.value)}
                              variant="bordered"
                              placeholder="+39 XXX XXXXXXX"
                              className="max-w-full"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Email</label>
                            <Input
                              type="email"
                              value={witness.email}
                              onChange={(e) => handleWitnessChange(index, 'email', e.target.value)}
                              variant="bordered"
                              placeholder="email@esempio.com"
                              className="max-w-full"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-center">
                      <Button
                        variant="flat"
                        color="primary"
                        onPress={addWitness}
                        startContent={<Icon icon="solar:add-circle-linear" className="w-4 h-4" />}
                      >
                        Aggiungi testimone
                      </Button>
                    </div>
                  </div>
                </Tab>
                
                <Tab 
                  key="documents" 
                  title={
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:document-linear" className="w-4 h-4" />
                      <span>Documenti</span>
                    </div>
                  }
                >
                  <div className="mt-6 space-y-6">
                    {documentsData.map((document, index) => (
                      <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium text-slate-900">Documento {index + 1}</h3>
                          {documentsData.length > 1 && (
                            <Button
                              isIconOnly
                              variant="light"
                              color="danger"
                              onPress={() => removeDocument(index)}
                            >
                              <Icon icon="solar:trash-bin-trash-linear" className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Tipo documento</label>
                            <Select
                              selectedKeys={[document.type]}
                              onChange={(e) => handleDocumentChange(index, 'type', e.target.value)}
                              variant="bordered"
                            >
                              <SelectItem key="Foto">Foto</SelectItem>
                              <SelectItem key="Modulo CAI">Modulo CAI</SelectItem>
                              <SelectItem key="Fattura">Fattura</SelectItem>
                              <SelectItem key="Perizia">Perizia</SelectItem>
                              <SelectItem key="Altro">Altro</SelectItem>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">File</label>
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
                              <Input
                                type="file"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleDocumentChange(index, 'file', e.target.files[0]);
                                  }
                                }}
                                className="hidden"
                                id={`file-upload-${index}`}
                              />
                              <label 
                                htmlFor={`file-upload-${index}`} 
                                className="cursor-pointer flex flex-col items-center justify-center"
                              >
                                <Icon icon="solar:upload-linear" className="w-6 h-6 text-slate-400" />
                                <p className="mt-2 text-sm text-slate-500">
                                  {document.file ? (document.file as File).name : "Clicca per caricare un file"}
                                </p>
                                {document.file && document.type === "Foto" && (
                                  <Button
                                    size="sm"
                                    variant="flat"
                                    color="primary"
                                    className="mt-2"
                                    onPress={() => openImagePreview(document.file as File)}
                                  >
                                    Anteprima
                                  </Button>
                                )}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-center">
                      <Button
                        variant="flat"
                        color="primary"
                        onPress={addDocument}
                        startContent={<Icon icon="solar:add-circle-linear" className="w-4 h-4" />}
                      >
                        Aggiungi documento
                      </Button>
                    </div>
                  </div>
                </Tab>
                
                <Tab 
                  key="liquidation" 
                  title={
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:euro-linear" className="w-4 h-4" />
                      <span>Liquidazione</span>
                    </div>
                  }
                >
                  <div className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Importo stimato *</label>
                        <Input
                          type="number"
                          name="estimatedAmount"
                          value={liquidationData.estimatedAmount}
                          onChange={handleLiquidationChange}
                          required
                          variant="bordered"
                          endContent={<div className="pointer-events-none">€</div>}
                          min="0"
                          step="0.01"
                          className="max-w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Importo liquidato</label>
                        <Input
                          type="number"
                          name="liquidatedAmount"
                          value={liquidationData.liquidatedAmount}
                          onChange={handleLiquidationChange}
                          variant="bordered"
                          endContent={<div className="pointer-events-none">€</div>}
                          min="0"
                          step="0.01"
                          className="max-w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Data liquidazione</label>
                        <Input
                          type="date"
                          name="liquidationDate"
                          value={liquidationData.liquidationDate}
                          onChange={handleLiquidationChange}
                          variant="bordered"
                          className="max-w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Franchigia</label>
                        <Input
                          type="number"
                          name="deductible"
                          value={liquidationData.deductible}
                          onChange={handleLiquidationChange}
                          required
                          variant="bordered"
                          endContent={<div className="pointer-events-none">€</div>}
                          min="0"
                          step="0.01"
                          className="max-w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Percentuale responsabilità</label>
                        <Input
                          type="number"
                          name="responsibilityPercentage"
                          value={liquidationData.responsibilityPercentage}
                          onChange={handleLiquidationChange}
                          required
                          variant="bordered"
                          endContent={<div className="pointer-events-none">%</div>}
                          min="0"
                          max="100"
                          step="1"
                          className="max-w-full"
                        />
                      </div>
                    </div>
                  </div>
                </Tab>
              </Tabs>

              <Divider className="my-6" />

              <div className="flex justify-end gap-2">
                <Button
                  variant="flat"
                  onPress={() => navigate("/accident")}
                >
                  Annulla
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={loading}
                  isDisabled={!isFormValid()}
                  startContent={<Icon icon="solar:check-circle-linear" className="w-4 h-4" />}
                >
                  Salva
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>Anteprima documento</ModalHeader>
          <ModalBody>
            {previewImage && (
              <img 
                src={previewImage} 
                alt="Anteprima documento" 
                className="w-full max-h-[70vh] object-contain"
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button onPress={onClose}>Chiudi</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <style jsx>{`
        .map-container {
          position: relative;
        }
        .map-loading {
          opacity: 1;
          transition: opacity 0.3s ease-in-out;
        }
        .map-loaded .map-loading {
          opacity: 0;
        }
        .map-marker {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 32px;
          height: 32px;
          z-index: 2;
        }
        .marker-pin {
          width: 20px;
          height: 20px;
          border-radius: 50% 50% 50% 0;
          background: #4f46e5;
          position: absolute;
          transform: rotate(-45deg);
          left: 50%;
          top: 50%;
          margin: -15px 0 0 -10px;
        }
        .marker-pin::after {
          content: '';
          width: 10px;
          height: 10px;
          margin: 5px 0 0 5px;
          background: white;
          position: absolute;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
} 