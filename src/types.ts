export interface Partida {
  esp: string;       // Especialidad (e.g., PRIMER NIVEL)
  subesp: string;    // Sub-especialidad / Ambiente (e.g., FACHADA)
  codigo: string;    // Código correlativo (e.g., 1.1)
  nombre: string;    // Nombre de la partida (e.g., Zócalo corrido fachada)
  inicio: number;    // Semana de inicio (e.g., 1)
  duracion: number;  // Duración en semanas (e.g., 4)
  mat: number;       // Costo de materiales en Soles (e.g., 403.75)
  mo: number;        // Costo de Mano de Obra en Soles (e.g., 358.05)
}

export interface PresupuestoData {
  user_id: string;
  contenido: Partida[];
  updated_at?: string;
}

export interface FlujoSemana {
  sem: number;
  mat: number;
  mo: number;
  total: number;
}
