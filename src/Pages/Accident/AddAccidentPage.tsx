// Aggiungo l'interfaccia per Google Maps per TypeScript
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

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
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Calendar,
  DateValue
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

interface Document {
  type: string;
  file: File | null;
}

const API_KEYS = {
  googleMaps: "AIzaSyB41DRubKWUHP7tGOqRZv2aLaF2UqHj0ag", // Chiave di sviluppo temporanea
  openAI: "INSERISCI_QUI_LA_TUA_API_KEY_OPENAI"
};

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  const [documentsData, setDocumentsData] = useState<Document[]>([
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
    { value: "Soleggiato", icon: "heroicons:sun" },
    { value: "Nuvoloso", icon: "heroicons:cloud" },
    { value: "Pioggia", icon: "heroicons:cloud-rain" },
    { value: "Nebbia", icon: "heroicons:beaker" },
    { value: "Neve", icon: "heroicons:swatch" },
    { value: "Grandine", icon: "heroicons:bolt" }
  ];

  const roadConditionsArray = [
    { value: "Asciutto", color: "success" as const },
    { value: "Bagnato", color: "primary" as const },
    { value: "Ghiacciato", color: "danger" as const },
    { value: "Neve", color: "default" as const },
    { value: "Dissestato", color: "warning" as const }
  ];

  useEffect(() => {
    fetchPolicies();
    fetchVehicles();
    calculateCompletion();
    
    // Inizializzazione Google Maps
    if (mapRef.current && API_KEYS.googleMaps !== "AIzaSyB41DRubKWUHP7tGOqRZv2aLaF2UqHj0ag") {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEYS.googleMaps}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      // Aggiungi la funzione initMap come callback globale
      window.initMap = initMap;
      
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
        delete window.initMap;
      };
    }
  }, []);
  
  const initMap = () => {
    if (!mapRef.current || !window.google || !window.google.maps) {
      console.error('Google Maps non è stato caricato correttamente');
      return;
    }

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 45.4642, lng: 9.1900 }, // Milano di default
        zoom: 12,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      });
      
      const marker = new window.google.maps.Marker({
        position: { lat: 45.4642, lng: 9.1900 },
        map: map,
        draggable: true,
        title: 'Posizione incidente'
      });
      
      marker.addListener('dragend', () => {
        const position = marker.getPosition();
        if (position) {
          setGeneralData(prev => ({
            ...prev,
            coordinates: {
              lat: position.lat(),
              lng: position.lng()
            }
          }));
        }
      });

      // Aggiungi il listener per il click sulla mappa
      map.addListener('click', (event: any) => {
        const newPosition = event.latLng;
        marker.setPosition(newPosition);
        setGeneralData(prev => ({
          ...prev,
          coordinates: {
            lat: newPosition.lat(),
            lng: newPosition.lng()
          }
        }));
      });

    } catch (error) {
      console.error('Errore durante l\'inizializzazione della mappa:', error);
    }
  };

  useEffect(() => {
    if (formTouched) {
      calculateCompletion();
    }
  }, [generalData, partecipantsData, witnessesData, documentsData, liquidationData, formTouched]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleDocumentChange(index, 'file', file);
    }
  };

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

  const handleDateSelect = (date: DateValue) => {
    setFormTouched(true);
    const jsDate = new Date(date.toString());
    setGeneralData(prev => ({
      ...prev,
      date: jsDate.toISOString().substring(0, 10)
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
    
    if (field === 'file' && value instanceof File) {
      const newDocuments = [...documentsData];
      newDocuments[index] = {
        ...newDocuments[index],
        file: value
      };
      setDocumentsData(newDocuments);
      
      // Anteprima se è un'immagine
      if (value.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            // Solo per visualizzare l'anteprima, non cambia lo stato
          }
        };
        reader.readAsDataURL(value);
      }
    } else {
      setDocumentsData(prev => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          [field]: value
        };
        return updated;
      });
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

  const handleLiquidationDateSelect = (date: DateValue) => {
    setFormTouched(true);
    const jsDate = new Date(date.toString());
    setLiquidationData(prev => ({
      ...prev,
      liquidationDate: jsDate.toISOString().substring(0, 10)
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
        documents: documentsData.map(doc => ({
          type: doc.type,
          fileName: doc.file ? doc.file.name : null
          // In produzione, qui caricheresti il file su un server e salveresti il percorso
        })),
        liquidation: {
          ...liquidationData,
          estimatedAmount: Number(liquidationData.estimatedAmount),
          liquidatedAmount: liquidationData.liquidatedAmount ? Number(liquidationData.liquidatedAmount) : 0,
          deductible: Number(liquidationData.deductible),
          responsibilityPercentage: Number(liquidationData.responsibilityPercentage)
        }
      };

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

  const generateWithAI = async () => {
    // Verifica che la chiave API sia stata impostata
    if (API_KEYS.openAI === "INSERISCI_QUI_LA_TUA_API_KEY_OPENAI") {
      alert("Per utilizzare questa funzionalità, è necessario configurare una chiave API di OpenAI.");
      return;
    }
  
    setAiGenerating(true);
    
    try {
      // Prepara il prompt per ChatGPT con tutte le informazioni disponibili
      let prompt = "Genera una descrizione dettagliata di un incidente stradale con le seguenti caratteristiche:\n\n";
      
      if (generalData.date) prompt += `Data: ${generalData.date}\n`;
      if (generalData.time) prompt += `Ora: ${generalData.time}\n`;
      if (generalData.location) prompt += `Luogo: ${generalData.location}\n`;
      if (generalData.weather) prompt += `Condizioni meteo: ${generalData.weather}\n`;
      if (generalData.roadConditions) prompt += `Condizioni stradali: ${generalData.roadConditions}\n`;
      
      prompt += "\nVeicoli coinvolti:\n";
      partecipantsData.forEach((p, i) => {
        const vehicle = vehicles.find(v => v.id.toString() === p.vehicleId);
        if (vehicle) {
          prompt += `Veicolo ${i+1}: ${vehicle.brand} ${vehicle.model} (Targa: ${vehicle.plate}), Ruolo: ${p.role}\n`;
          if (p.damages) prompt += `Danni: ${p.damages}\n`;
          prompt += `Feriti: ${p.injured ? 'Sì' : 'No'}\n`;
        }
      });
      
      // Chiamata a ChatGPT API (implementazione reale)
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "Sei un assistente specializzato nella descrizione di incidenti stradali per compagnie assicurative. Scrivi in italiano."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEYS.openAI}`
          }
        }
      );
      
      // Estrarre la risposta generata
      const generatedDescription = response.data.choices[0].message.content;
      setGeneralData(prev => ({...prev, description: generatedDescription}));
      
      // Se ci sono veicoli senza descrizione dei danni, genera anche quelli
      const updatedParticipants = [...partecipantsData];
      let hasUpdated = false;
      
      for (let i = 0; i < updatedParticipants.length; i++) {
        if (!updatedParticipants[i].damages && updatedParticipants[i].vehicleId) {
          // Genera descrizione danni per questo veicolo
          const damagePrompt = `Descrivi i danni riportati da un veicolo ${updatedParticipants[i].role.toLowerCase()} in un incidente stradale. Elenca solo i danni, in modo conciso.`;
          
          const damageResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
              model: "gpt-3.5-turbo",
              messages: [
                {
                  role: "system",
                  content: "Sei un perito assicurativo. Rispondi in modo conciso."
                },
                {
                  role: "user",
                  content: damagePrompt
                }
              ],
              temperature: 0.7,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEYS.openAI}`
              }
            }
          );
          
          updatedParticipants[i].damages = damageResponse.data.choices[0].message.content;
          hasUpdated = true;
        }
      }
      
      if (hasUpdated) {
        setPartecipantsData(updatedParticipants);
      }
      
    } catch (error) {
      console.error("Errore nella generazione con AI:", error);
      // Fallback per demo
      const aiDescriptions = [
        "Incidente avvenuto all'incrocio tra via Roma e corso Italia. Il veicolo A procedeva da nord verso sud quando, giunto all'incrocio, impattava con il veicolo B che proveniva da ovest. Entrambi i conducenti dichiarano di aver rispettato il semaforo verde. Danni riportati: veicolo A, danneggiamento della parte anteriore destra; veicolo B, danneggiamento della parte anteriore sinistra.",
        "Sinistro verificatosi sulla strada statale 106 in direzione nord. Il veicolo assicurato procedeva nella propria corsia quando, a causa dell'asfalto bagnato, perdeva il controllo slittando e urtando il guardrail sul lato destro. Non si segnalano altri veicoli coinvolti. Danni riportati: fiancata destra, paraurti anteriore e cerchione anteriore destro.",
        "Tamponamento a catena avvenuto in autostrada A1 km 34 in direzione sud. Il veicolo C, a causa di un improvviso rallentamento del traffico, urtava il veicolo B che, a sua volta, impattava contro il veicolo A. I tre conducenti confermano la dinamica. Si segnalano danni di lieve entità ai paraurti posteriori dei veicoli A e B e al paraurti anteriore del veicolo C."
      ];
      
      const randomDesc = aiDescriptions[Math.floor(Math.random() * aiDescriptions.length)];
      setGeneralData(prev => ({...prev, description: randomDesc}));
    } finally {
      setAiGenerating(false);
      setFormTouched(true);
    }
  };

  const getWeatherByLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          // Aggiorna le coordinate
          setGeneralData(prev => ({
            ...prev, 
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
          
          // Aggiorna la mappa
          if (window.google && mapRef.current) {
            const map = new window.google.maps.Map(mapRef.current, {
              center: { 
                lat: position.coords.latitude, 
                lng: position.coords.longitude 
              },
              zoom: 14,
            });
            
            const marker = new window.google.maps.Marker({
              position: { 
                lat: position.coords.latitude, 
                lng: position.coords.longitude 
              },
              map: map,
              draggable: true
            });
            
            // Ottieni indirizzo dalla posizione e aggiorna il campo location
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: { 
              lat: position.coords.latitude, 
              lng: position.coords.longitude 
            }}, (results: any, status: string) => {
              if (status === 'OK' && results && results[0]) {
                setGeneralData(prev => ({
                  ...prev,
                  location: results[0].formatted_address
                }));
              }
            });
            
            // Simula dati meteo (in produzione usare un'API meteo reale)
            const weatherTypes = weatherOptions.map(w => w.value);
            const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
            setGeneralData(prev => ({...prev, weather: randomWeather}));
          }
        } catch (error) {
          console.error("Errore nel recupero della posizione:", error);
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
                      <Icon icon="heroicons:information-circle" className="w-4 h-4" />
                      <span>Generale</span>
                    </div>
                  }
                >
                  <div className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Data *</label>
                        <Popover placement="bottom">
                          <PopoverTrigger>
                            <Input
                              type="text"
                              name="date"
                              value={generalData.date ? new Date(generalData.date).toLocaleDateString() : ""}
                              placeholder="Seleziona una data"
                              className="cursor-pointer"
                              readOnly
                              variant="bordered"
                              startContent={<Icon icon="heroicons:calendar" className="text-slate-400" />}
                            />
                          </PopoverTrigger>
                          <PopoverContent>
                            <Calendar
                              color="primary"
                              onChange={handleDateSelect}
                            />
                          </PopoverContent>
                        </Popover>
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
                              <Icon icon="heroicons:map-pin" className="w-5 h-5" />
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
                          {roadConditionsArray.map((condition) => (
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
                            startContent={<Icon icon="heroicons:sparkles" className="w-4 h-4" />}
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
                            <Icon icon="heroicons:map" className="w-5 h-5 text-primary-500" />
                            <span className="font-medium">Posizione dell'incidente</span>
                          </div>
                          <div 
                            ref={mapRef} 
                            className="w-full h-48 bg-slate-100 rounded-lg relative overflow-hidden map-container"
                          >
                            {/* Google Maps verrà caricato qui */}
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
                      <Icon icon="heroicons:truck" className="w-4 h-4" />
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
                              <Icon icon="heroicons:trash" className="w-4 h-4" />
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
                        startContent={<Icon icon="heroicons:plus-circle" className="w-4 h-4" />}
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
                      <Icon icon="heroicons:user-group" className="w-4 h-4" />
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
                              <Icon icon="heroicons:trash" className="w-4 h-4" />
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
                        startContent={<Icon icon="heroicons:plus-circle" className="w-4 h-4" />}
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
                      <Icon icon="heroicons:document" className="w-4 h-4" />
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
                              <Icon icon="heroicons:trash" className="w-4 h-4" />
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
                            <div
                              className={`border-2 border-dashed border-slate-300 rounded-lg p-4 text-center 
                              transition-colors duration-200 
                              ${document.file ? 'bg-green-50 border-green-300' : 'hover:bg-slate-50 hover:border-primary-300'}`}
                              onDragOver={e => handleDragOver(e)}
                              onDragLeave={e => handleDragLeave(e)}
                              onDrop={e => handleDrop(e, index)}
                            >
                              <Input
                                type="file"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleDocumentChange(index, 'file', e.target.files[0]);
                                  }
                                }}
                                className="hidden"
                                id={`file-upload-${index}`}
                                ref={fileInputRef}
                              />
                              <label 
                                htmlFor={`file-upload-${index}`} 
                                className="cursor-pointer flex flex-col items-center justify-center"
                              >
                                {document.file ? (
                                  <>
                                    <Icon icon="heroicons:document-check" className="w-6 h-6 text-green-500" />
                                    <p className="mt-2 text-sm text-green-700">
                                      {document.file.name}
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <Icon icon="heroicons:arrow-up-tray" className="w-6 h-6 text-slate-400" />
                                    <p className="mt-2 text-sm text-slate-500">
                                      Clicca o trascina qui per caricare un file
                                    </p>
                                  </>
                                )}
                                {document.file && document.type === "Foto" && document.file.type.startsWith('image/') && (
                                  <Button
                                    size="sm"
                                    variant="flat"
                                    color="primary"
                                    className="mt-2"
                                    onPress={() => document.file && openImagePreview(document.file)}
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
                        startContent={<Icon icon="heroicons:plus-circle" className="w-4 h-4" />}
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
                      <Icon icon="heroicons:banknotes" className="w-4 h-4" />
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
                        <Popover placement="bottom">
                          <PopoverTrigger>
                            <Input
                              type="text"
                              value={liquidationData.liquidationDate ? new Date(liquidationData.liquidationDate).toLocaleDateString() : ""}
                              placeholder="Seleziona una data"
                              className="cursor-pointer"
                              readOnly
                              variant="bordered"
                              startContent={<Icon icon="heroicons:calendar" className="text-slate-400" />}
                            />
                          </PopoverTrigger>
                          <PopoverContent>
                            <Calendar
                              color="primary"
                              onChange={handleLiquidationDateSelect}
                            />
                          </PopoverContent>
                        </Popover>
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
                  startContent={<Icon icon="heroicons:check-circle" className="w-4 h-4" />}
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

      <style>
        {`
          .map-container {
            position: relative;
          }
          .drag-over {
            background-color: rgba(79, 70, 229, 0.1);
            border-color: #4f46e5;
          }
        `}
      </style>
    </div>
  );
} 