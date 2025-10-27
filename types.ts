
export enum Treatment {
  HYDRAFACIAL = "Hydrafacial",
  LASER_HAIR_REMOVAL = "Laser Hair Removal",
  BOTOX = "Botox Treatments",
  DERMAL_FILLERS = "Dermal Fillers",
  CHEMICAL_PEELS = "Chemical Peels",
  PRP_THERAPY = "PRP Therapy",
  MICRODERMABRASION = "Microdermabrasion",
  SKIN_TIGHTENING = "Skin Tightening",
  ACNE_TREATMENTS = "Acne Treatments",
  PIGMENTATION_TREATMENTS = "Pigmentation Treatments",
  VITAMIN_INJECTIONS = "Vitamin Injections",
  BODY_CONTOURING = "Body Contouring",
}

export interface PatientRecord {
  timestamp: string;
  patientName: string;
  age: string;
  date: string;
  treatment: Treatment;
  followUpDate: string;
  instructions: string;
  session: string;
}
