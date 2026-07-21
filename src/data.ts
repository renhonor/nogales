import { Partida } from './types';

export const defaultPartidas: Partida[] = [
  // PRIMER NIVEL - FACHADA
  { esp: "PRIMER NIVEL", subesp: "FACHADA", codigo: "1.1", nombre: "Zócalo corrido fachada (Plinto)", inicio: 1, duracion: 4, mat: 403.75, mo: 358.05 },
  { esp: "PRIMER NIVEL", subesp: "FACHADA", codigo: "1.2", nombre: "Marquería de puertas", inicio: 1, duracion: 3, mat: 519.74, mo: 460.90 },
  { esp: "PRIMER NIVEL", subesp: "FACHADA", codigo: "1.3", nombre: "Marquería de ventanas", inicio: 3, duracion: 4, mat: 1425.66, mo: 1264.26 },
  { esp: "PRIMER NIVEL", subesp: "FACHADA", codigo: "1.4", nombre: "Cornizas horizontales e intermedias", inicio: 2, duracion: 2, mat: 1537.85, mo: 1363.75 },
  { esp: "PRIMER NIVEL", subesp: "FACHADA", codigo: "1.5", nombre: "Balaustrada de madera", inicio: 2, duracion: 3, mat: 4022.06, mo: 3566.74 },
  { esp: "PRIMER NIVEL", subesp: "FACHADA", codigo: "1.6", nombre: "Barandilla de fierro forjado", inicio: 2, duracion: 2, mat: 2594.88, mo: 2301.12 },
  { esp: "PRIMER NIVEL", subesp: "FACHADA", codigo: "1.7", nombre: "Luminarias tipo aplique/faroles (4 und)", inicio: 3, duracion: 1, mat: 636.00, mo: 564.00 },
  
  // JARDIN DELANTERO Y POSTERIOR
  { esp: "PRIMER NIVEL", subesp: "JARDÍN DELANTERO/POSTERIOR", codigo: "1.8", nombre: "Colocar luces decorativas perímetro", inicio: 3, duracion: 1, mat: 3530.00, mo: 970.00 },
  { esp: "PRIMER NIVEL", subesp: "JARDÍN DELANTERO/POSTERIOR", codigo: "1.9", nombre: "Construir camino delantero jardín", inicio: 3, duracion: 2, mat: 424.00, mo: 376.00 },
  { esp: "PRIMER NIVEL", subesp: "JARDÍN DELANTERO/POSTERIOR", codigo: "1.10", nombre: "2 Puntos de luz para macetas", inicio: 3, duracion: 1, mat: 159.00, mo: 141.00 },
  { esp: "PRIMER NIVEL", subesp: "JARDÍN DELANTERO/POSTERIOR", codigo: "1.11", nombre: "Punto de luz para árbol", inicio: 3, duracion: 1, mat: 53.00, mo: 47.00 },
  { esp: "PRIMER NIVEL", subesp: "JARDÍN DELANTERO/POSTERIOR", codigo: "1.12", nombre: "Cerradura puerta calle", inicio: 4, duracion: 1, mat: 1405.00, mo: 95.00 },
  { esp: "PRIMER NIVEL", subesp: "JARDÍN DELANTERO/POSTERIOR", codigo: "1.13", nombre: "Mantenimiento cerco eléctrico", inicio: 4, duracion: 1, mat: 1060.00, mo: 940.00 },
  { esp: "PRIMER NIVEL", subesp: "JARDÍN DELANTERO/POSTERIOR", codigo: "1.14", nombre: "Closet posterior limpieza", inicio: 4, duracion: 2, mat: 795.00, mo: 705.00 },

  // ESPACIO DE CAVA
  { esp: "PRIMER NIVEL", subesp: "ESPACIO DE CAVA", codigo: "1.15", nombre: "Cielo raso drywall diseño fosa", inicio: 5, duracion: 3, mat: 1761.08, mo: 1561.72 },
  { esp: "PRIMER NIVEL", subesp: "ESPACIO DE CAVA", codigo: "1.16", nombre: "Rosetón clásico circular", inicio: 5, duracion: 1, mat: 310.00, mo: 90.00 },
  { esp: "PRIMER NIVEL", subesp: "ESPACIO DE CAVA", codigo: "1.17", nombre: "Cornisas perimetrales", inicio: 5, duracion: 2, mat: 933.94, mo: 828.21 },
  { esp: "PRIMER NIVEL", subesp: "ESPACIO DE CAVA", codigo: "1.18", nombre: "Marquería de puerta", inicio: 5, duracion: 1, mat: 221.33, mo: 196.27 },
  { esp: "PRIMER NIVEL", subesp: "ESPACIO DE CAVA", codigo: "1.19", nombre: "Marquería alta decorativa muros", inicio: 6, duracion: 2, mat: 734.45, mo: 651.31 },
  { esp: "PRIMER NIVEL", subesp: "ESPACIO DE CAVA", codigo: "1.20", nombre: "Marquería baja decorativa muros", inicio: 6, duracion: 2, mat: 174.26, mo: 154.54 },
  { esp: "PRIMER NIVEL", subesp: "ESPACIO DE CAVA", codigo: "1.21", nombre: "Modulo central cava vinos (2 und)", inicio: 7, duracion: 3, mat: 10494.00, mo: 9306.00 },
  { esp: "PRIMER NIVEL", subesp: "ESPACIO DE CAVA", codigo: "1.22", nombre: "Jaladores metal dorado (12 und)", inicio: 7, duracion: 1, mat: 1020.00, mo: 120.00 },
  { esp: "PRIMER NIVEL", subesp: "ESPACIO DE CAVA", codigo: "1.23", nombre: "Detalle remarco color contraste", inicio: 7, duracion: 1, mat: 243.80, mo: 216.20 },
  { esp: "PRIMER NIVEL", subesp: "ESPACIO DE CAVA", codigo: "1.24", nombre: "Spots LED empotrable (6 und)", inicio: 8, duracion: 1, mat: 292.56, mo: 259.44 },
  { esp: "PRIMER NIVEL", subesp: "ESPACIO DE CAVA", codigo: "1.25", nombre: "Tira LED indirecta fosa techo", inicio: 8, duracion: 1, mat: 450.67, mo: 399.65 },

  // BAÑO VISITA
  { esp: "PRIMER NIVEL", subesp: "BAÑO VISITA", codigo: "1.26", nombre: "Corniza techo", inicio: 5, duracion: 1, mat: 300.40, mo: 266.40 },
  { esp: "PRIMER NIVEL", subesp: "BAÑO VISITA", codigo: "1.27", nombre: "Cielo raso drywall RH", inicio: 5, duracion: 1, mat: 296.38, mo: 262.82 },
  { esp: "PRIMER NIVEL", subesp: "BAÑO VISITA", codigo: "1.28", nombre: "Marquería/molduras doradas pared", inicio: 6, duracion: 2, mat: 462.50, mo: 410.14 },
  { esp: "PRIMER NIVEL", subesp: "BAÑO VISITA", codigo: "1.29", nombre: "Marquería de puerta", inicio: 5, duracion: 1, mat: 221.33, mo: 196.27 },
  { esp: "PRIMER NIVEL", subesp: "BAÑO VISITA", codigo: "1.30", nombre: "Mueble melamine baño", inicio: 6, duracion: 1, mat: 503.50, mo: 446.50 },
  { esp: "PRIMER NIVEL", subesp: "BAÑO VISITA", codigo: "1.31", nombre: "Tablero granito", inicio: 6, duracion: 1, mat: 1450.00, mo: 350.00 },
  { esp: "PRIMER NIVEL", subesp: "BAÑO VISITA", codigo: "1.32", nombre: "Spots LED (4 und)", inicio: 7, duracion: 1, mat: 195.04, mo: 172.96 },
  { esp: "PRIMER NIVEL", subesp: "BAÑO VISITA", codigo: "1.33", nombre: "Braquets/apliques pared (2 und)", inicio: 7, duracion: 1, mat: 233.20, mo: 206.80 },
  { esp: "PRIMER NIVEL", subesp: "BAÑO VISITA", codigo: "1.34", nombre: "Cinta LED fosa techo", inicio: 7, duracion: 1, mat: 140.05, mo: 124.19 },
  { esp: "PRIMER NIVEL", subesp: "BAÑO VISITA", codigo: "1.35", nombre: "Cinta LED contorno espejo", inicio: 7, duracion: 1, mat: 77.43, mo: 68.67 },
  { esp: "PRIMER NIVEL", subesp: "BAÑO VISITA", codigo: "1.36", nombre: "Toallero cromado (2 und)", inicio: 8, duracion: 1, mat: 160.00, mo: 30.00 },
  { esp: "PRIMER NIVEL", subesp: "BAÑO VISITA", codigo: "1.37", nombre: "Portarrollo papel", inicio: 8, duracion: 1, mat: 90.00, mo: 30.00 },
  { esp: "PRIMER NIVEL", subesp: "BAÑO VISITA", codigo: "1.38", nombre: "Espejo central", inicio: 8, duracion: 1, mat: 220.00, mo: 30.00 },

  // COCINA
  { esp: "PRIMER NIVEL", subesp: "COCINA", codigo: "1.39", nombre: "Lavaplatos 2 pozas inc instalación", inicio: 9, duracion: 1, mat: 1220.00, mo: 80.00 },
  { esp: "PRIMER NIVEL", subesp: "COCINA", codigo: "1.40", nombre: "Granito para mesones", inicio: 9, duracion: 2, mat: 3380.00, mo: 420.00 },
  { esp: "PRIMER NIVEL", subesp: "COCINA", codigo: "1.41", nombre: "Granito para isla", inicio: 9, duracion: 2, mat: 3320.00, mo: 180.00 },
  { esp: "PRIMER NIVEL", subesp: "COCINA", codigo: "1.42", nombre: "Cielo raso drywall diseño fosa", inicio: 8, duracion: 3, mat: 1209.67, mo: 1072.73 },
  { esp: "PRIMER NIVEL", subesp: "COCINA", codigo: "1.43", nombre: "Cornizas/molduras techo clásico", inicio: 8, duracion: 2, mat: 603.56, mo: 535.24 },
  { esp: "PRIMER NIVEL", subesp: "COCINA", codigo: "1.44", nombre: "Marquería alta decorativa muros", inicio: 9, duracion: 2, mat: 437.57, mo: 388.03 },
  { esp: "PRIMER NIVEL", subesp: "COCINA", codigo: "1.45", nombre: "Marquería baja decorativa muros", inicio: 9, duracion: 2, mat: 76.32, mo: 67.68 },
  { esp: "PRIMER NIVEL", subesp: "COCINA", codigo: "1.46", nombre: "Salpicadero mármol/cuarzo negro", inicio: 10, duracion: 2, mat: 383.11, mo: 339.74 },
  { esp: "PRIMER NIVEL", subesp: "COCINA", codigo: "1.47", nombre: "Muebles bajos cocina melamine", inicio: 10, duracion: 3, mat: 7287.50, mo: 1740.00 },
  { esp: "PRIMER NIVEL", subesp: "COCINA", codigo: "1.48", nombre: "Muebles altos cocina melamine", inicio: 10, duracion: 3, mat: 3855.00, mo: 870.00 },
  { esp: "PRIMER NIVEL", subesp: "COCINA", codigo: "1.49", nombre: "Torre de alacenas melamine", inicio: 10, duracion: 3, mat: 9239.00, mo: 1870.00 },
  { esp: "PRIMER NIVEL", subesp: "COCINA", codigo: "1.50", nombre: "Mesa diario melamine acoplada", inicio: 11, duracion: 2, mat: 2500.00, mo: 300.00 },
  { esp: "PRIMER NIVEL", subesp: "COCINA", codigo: "1.51", nombre: "Luminarias colgantes isla (3 und)", inicio: 11, duracion: 1, mat: 870.00, mo: 180.00 },
  { esp: "PRIMER NIVEL", subesp: "COCINA", codigo: "1.52", nombre: "Spots LED (8 und)", inicio: 11, duracion: 1, mat: 576.00, mo: 160.00 },
  { esp: "PRIMER NIVEL", subesp: "COCINA", codigo: "1.53", nombre: "Tira LED fosa techo", inicio: 11, duracion: 1, mat: 235.07, mo: 208.45 },
  { esp: "PRIMER NIVEL", subesp: "COCINA", codigo: "1.54", nombre: "Tira LED bajo mueble alto", inicio: 11, duracion: 1, mat: 59.15, mo: 52.45 },

  // SALA
  { esp: "PRIMER NIVEL", subesp: "SALA", codigo: "1.55", nombre: "Cielo raso drywall diseño fosa", inicio: 8, duracion: 3, mat: 2035.20, mo: 1804.80 },
  { esp: "PRIMER NIVEL", subesp: "SALA", codigo: "1.56", nombre: "Rosetón moldura circular", inicio: 8, duracion: 1, mat: 310.00, mo: 90.00 },
  { esp: "PRIMER NIVEL", subesp: "SALA", codigo: "1.57", nombre: "Cornisas perimetrales clásicas", inicio: 9, duracion: 2, mat: 800.96, mo: 710.29 },
  { esp: "PRIMER NIVEL", subesp: "SALA", codigo: "1.58", nombre: "Marquería alta decorativa muros", inicio: 9, duracion: 3, mat: 1068.48, mo: 947.52 },
  { esp: "PRIMER NIVEL", subesp: "SALA", codigo: "1.59", nombre: "Esquineros ornamentales", inicio: 9, duracion: 1, mat: 608.00, mo: 120.00 },
  { esp: "PRIMER NIVEL", subesp: "SALA", codigo: "1.60", nombre: "Marquería baja decorativa muros", inicio: 10, duracion: 3, mat: 966.72, mo: 857.28 },
  { esp: "PRIMER NIVEL", subesp: "SALA", codigo: "1.61", nombre: "Detalle remarco color contraste", inicio: 10, duracion: 1, mat: 287.68, mo: 255.12 },
  { esp: "PRIMER NIVEL", subesp: "SALA", codigo: "1.62", nombre: "Piedra sintetizada color negro", inicio: 10, duracion: 2, mat: 4278.00, mo: 250.00 },
  { esp: "PRIMER NIVEL", subesp: "SALA", codigo: "1.63", nombre: "Varillas divisorias metal dorado", inicio: 11, duracion: 1, mat: 1200.00, mo: 180.00 },
  { esp: "PRIMER NIVEL", subesp: "SALA", codigo: "1.64", nombre: "Estructura base sofa/banco integrado", inicio: 11, duracion: 2, mat: 503.50, mo: 446.50 },
  { esp: "PRIMER NIVEL", subesp: "SALA", codigo: "1.65", nombre: "Placas interruptores decorativos (9)", inicio: 12, duracion: 1, mat: 1980.00, mo: 270.00 },
  { esp: "PRIMER NIVEL", subesp: "SALA", codigo: "1.66", nombre: "Braquets/apliques pared (3)", inicio: 12, duracion: 1, mat: 900.00, mo: 150.00 },
  { esp: "PRIMER NIVEL", subesp: "SALA", codigo: "1.67", nombre: "Spots LED (10)", inicio: 12, duracion: 1, mat: 487.60, mo: 432.40 },
  { esp: "PRIMER NIVEL", subesp: "SALA", codigo: "1.68", nombre: "Tira LED panel mármol", inicio: 12, duracion: 1, mat: 207.97, mo: 184.43 },
  { esp: "PRIMER NIVEL", subesp: "SALA", codigo: "1.69", nombre: "Tira LED fosa techo", inicio: 12, duracion: 1, mat: 435.02, mo: 385.78 },

  // COMEDOR
  { esp: "PRIMER NIVEL", subesp: "COMEDOR", codigo: "1.70", nombre: "Cielo raso drywall diseño fosa", inicio: 8, duracion: 3, mat: 1450.08, mo: 1285.92 },
  { esp: "PRIMER NIVEL", subesp: "COMEDOR", codigo: "1.71", nombre: "Rosetón moldura circular", inicio: 8, duracion: 1, mat: 310.00, mo: 90.00 },
  { esp: "PRIMER NIVEL", subesp: "COMEDOR", codigo: "1.72", nombre: "Esquineros ornamentales", inicio: 9, duracion: 1, mat: 1540.00, mo: 280.00 },
  { esp: "PRIMER NIVEL", subesp: "COMEDOR", codigo: "1.73", nombre: "Cornizas/molduras techo clásico", inicio: 9, duracion: 2, mat: 785.46, mo: 696.54 },
  { esp: "PRIMER NIVEL", subesp: "COMEDOR", codigo: "1.74", nombre: "Marquería alta decorativa muros", inicio: 10, duracion: 3, mat: 1577.28, mo: 1398.72 },
  { esp: "PRIMER NIVEL", subesp: "COMEDOR", codigo: "1.75", nombre: "Marquería baja decorativa muros", inicio: 10, duracion: 3, mat: 686.88, mo: 609.12 },
  { esp: "PRIMER NIVEL", subesp: "COMEDOR", codigo: "1.76", nombre: "Detalle remarco color contraste", inicio: 10, duracion: 1, mat: 243.80, mo: 216.20 },
  { esp: "PRIMER NIVEL", subesp: "COMEDOR", codigo: "1.77", nombre: "Piedra sintetizada color negro", inicio: 11, duracion: 2, mat: 2909.00, mo: 380.00 },
  { esp: "PRIMER NIVEL", subesp: "COMEDOR", codigo: "1.78", nombre: "Varillas divisorias metal dorado", inicio: 11, duracion: 1, mat: 1200.00, mo: 180.00 },
  { esp: "PRIMER NIVEL", subesp: "COMEDOR", codigo: "1.79", nombre: "Placas interruptores decorativos (9)", inicio: 12, duracion: 1, mat: 1890.00, mo: 360.00 },
  { esp: "PRIMER NIVEL", subesp: "COMEDOR", codigo: "1.80", nombre: "Braquets/apliques pared (5)", inicio: 12, duracion: 1, mat: 927.50, mo: 822.50 },
  { esp: "PRIMER NIVEL", subesp: "COMEDOR", codigo: "1.81", nombre: "Spots LED (10)", inicio: 12, duracion: 1, mat: 487.60, mo: 432.40 },
  { esp: "PRIMER NIVEL", subesp: "COMEDOR", codigo: "1.82", nombre: "Tira LED fosa techo", inicio: 12, duracion: 1, mat: 435.02, mo: 385.78 },

  // SEGUNDO NIVEL - DORMITORIO CAYETANA
  { esp: "SEGUNDO NIVEL", subesp: "DORM. CAYETANA", codigo: "2.1", nombre: "Puertas antirruido aluminio (2)", inicio: 13, duracion: 2, mat: 0, mo: 0 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. CAYETANA", codigo: "2.2", nombre: "Cielo raso drywall fosa perimetral", inicio: 13, duracion: 3, mat: 1444.36, mo: 1280.84 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. CAYETANA", codigo: "2.3", nombre: "Rosetón moldura circular", inicio: 13, duracion: 1, mat: 310.00, mo: 90.00 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. CAYETANA", codigo: "2.4", nombre: "Cornisas perimetrales clásicas", inicio: 14, duracion: 2, mat: 601.50, mo: 533.40 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. CAYETANA", codigo: "2.5", nombre: "Marquería decorativa muros", inicio: 14, duracion: 2, mat: 783.08, mo: 694.43 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. CAYETANA", codigo: "2.6", nombre: "Marquería de puerta", inicio: 13, duracion: 1, mat: 221.33, mo: 196.27 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. CAYETANA", codigo: "2.7", nombre: "Armarios/closets empotrados", inicio: 15, duracion: 4, mat: 5501.40, mo: 4878.60 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. CAYETANA", codigo: "2.8", nombre: "Mueble entretenimiento TV", inicio: 15, duracion: 2, mat: 1510.50, mo: 1339.50 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. CAYETANA", codigo: "2.9", nombre: "Jaladores metal dorado (17)", inicio: 15, duracion: 1, mat: 405.45, mo: 359.55 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. CAYETANA", codigo: "2.10", nombre: "Mesas noche estilo clásico (2)", inicio: 16, duracion: 1, mat: 763.20, mo: 676.80 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. CAYETANA", codigo: "2.11", nombre: "Braquets/apliques cabecera (2)", inicio: 16, duracion: 1, mat: 600.00, mo: 100.00 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. CAYETANA", codigo: "2.12", nombre: "Spots LED redondos (8)", inicio: 16, duracion: 1, mat: 496.00, mo: 240.00 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. CAYETANA", codigo: "2.13", nombre: "Tira LED fosa techo", inicio: 16, duracion: 1, mat: 180.50, mo: 160.06 },
  
  // SS.HH. CAYETANA
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. CAYETANA", codigo: "2.14", nombre: "Corniza techo", inicio: 14, duracion: 1, mat: 323.14, mo: 286.56 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. CAYETANA", codigo: "2.15", nombre: "Cielo raso drywall RH", inicio: 14, duracion: 1, mat: 1128.58, mo: 1000.82 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. CAYETANA", codigo: "2.16", nombre: "Marquería/molduras doradas pared", inicio: 15, duracion: 2, mat: 814.84, mo: 722.60 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. CAYETANA", codigo: "2.17", nombre: "Marquería de puerta", inicio: 14, duracion: 1, mat: 221.33, mo: 196.27 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. CAYETANA", codigo: "2.18", nombre: "Enchape mármol pared", inicio: 15, duracion: 2, mat: 1161.10, mo: 200.00 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. CAYETANA", codigo: "2.19", nombre: "Spots LED (4)", inicio: 16, duracion: 1, mat: 248.00, mo: 120.00 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. CAYETANA", codigo: "2.20", nombre: "Braquets/apliques clásico (2)", inicio: 16, duracion: 1, mat: 340.00, mo: 100.00 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. CAYETANA", codigo: "2.21", nombre: "Cinta LED fosa techo", inicio: 16, duracion: 1, mat: 98.64, mo: 87.48 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. CAYETANA", codigo: "2.22", nombre: "Cinta LED contorno espejo", inicio: 16, duracion: 1, mat: 77.43, mo: 68.67 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. CAYETANA", codigo: "2.23", nombre: "Colocación granito y mueble baño", inicio: 17, duracion: 2, mat: 2100.00, mo: 350.00 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. CAYETANA", codigo: "2.24", nombre: "Toallero cromado", inicio: 17, duracion: 1, mat: 65.00, mo: 30.00 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. CAYETANA", codigo: "2.25", nombre: "Portarrollo papel", inicio: 17, duracion: 1, mat: 90.00, mo: 30.00 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. CAYETANA", codigo: "2.26", nombre: "Espejo central + C Gótica", inicio: 17, duracion: 1, mat: 320.00, mo: 60.00 },

  // DORMITORIO NIÑO
  { esp: "SEGUNDO NIVEL", subesp: "DORM. NIÑO", codigo: "2.27", nombre: "Cielo raso drywall fosa perimetral", inicio: 13, duracion: 3, mat: 1066.57, mo: 945.83 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. NIÑO", codigo: "2.28", nombre: "Rosetón moldura circular", inicio: 13, duracion: 1, mat: 212.00, mo: 188.00 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. NIÑO", codigo: "2.29", nombre: "Cornisas perimetrales clásicas", inicio: 14, duracion: 2, mat: 566.36, mo: 502.24 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. NIÑO", codigo: "2.30", nombre: "Marquería decorativa muros", inicio: 14, duracion: 2, mat: 1001.70, mo: 888.30 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. NIÑO", codigo: "2.31", nombre: "Marquería de puerta", inicio: 13, duracion: 1, mat: 221.33, mo: 196.27 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. NIÑO", codigo: "2.32", nombre: "Armarios/closets empotrados", inicio: 15, duracion: 3, mat: 7200.00, mo: 1200.00 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. NIÑO", codigo: "2.33", nombre: "Mueble entretenimiento TV", inicio: 15, duracion: 2, mat: 980.50, mo: 869.50 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. NIÑO", codigo: "2.34", nombre: "Jaladores metal dorado (17)", inicio: 15, duracion: 1, mat: 495.55, mo: 439.45 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. NIÑO", codigo: "2.35", nombre: "Mesas noche estilo clásico (2)", inicio: 16, duracion: 1, mat: 763.20, mo: 676.80 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. NIÑO", codigo: "2.36", nombre: "Braquets/apliques cabecera (2)", inicio: 16, duracion: 1, mat: 580.00, mo: 120.00 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. NIÑO", codigo: "2.37", nombre: "Spots LED redondos (8)", inicio: 16, duracion: 1, mat: 390.08, mo: 345.92 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. NIÑO", codigo: "2.38", nombre: "Tira LED fosa techo", inicio: 16, duracion: 1, mat: 180.50, mo: 160.06 },

  // SS.HH. NIÑO
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. DORM. NIÑO", codigo: "2.39", nombre: "Corniza techo", inicio: 14, duracion: 1, mat: 353.11, mo: 313.14 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. DORM. NIÑO", codigo: "2.40", nombre: "Cielo raso drywall RH", inicio: 14, duracion: 1, mat: 393.05, mo: 348.55 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. DORM. NIÑO", codigo: "2.41", nombre: "Marquería/molduras doradas pared", inicio: 15, duracion: 2, mat: 704.94, mo: 625.14 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. DORM. NIÑO", codigo: "2.42", nombre: "Marquería de puerta", inicio: 14, duracion: 1, mat: 221.33, mo: 196.27 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. DORM. NIÑO", codigo: "2.43", nombre: "Enchape mármol pared", inicio: 15, duracion: 2, mat: 1112.50, mo: 350.00 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. DORM. NIÑO", codigo: "2.44", nombre: "Spots LED (4)", inicio: 16, duracion: 1, mat: 195.04, mo: 172.96 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. DORM. NIÑO", codigo: "2.45", nombre: "Braquets/apliques clásico (2)", inicio: 16, duracion: 1, mat: 340.00, mo: 100.00 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. DORM. NIÑO", codigo: "2.46", nombre: "Cinta LED fosa techo", inicio: 16, duracion: 1, mat: 115.43, mo: 102.37 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. DORM. NIÑO", codigo: "2.47", nombre: "Cinta LED contorno espejo", inicio: 16, duracion: 1, mat: 77.43, mo: 68.67 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. DORM. NIÑO", codigo: "2.48", nombre: "Colocación granito y mueble baño", inicio: 17, duracion: 2, mat: 2000.00, mo: 450.00 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. DORM. NIÑO", codigo: "2.49", nombre: "Toallero cromado", inicio: 17, duracion: 1, mat: 50.35, mo: 44.65 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. DORM. NIÑO", codigo: "2.50", nombre: "Portarrollo papel", inicio: 17, duracion: 1, mat: 63.60, mo: 56.40 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. DORM. NIÑO", codigo: "2.51", nombre: "Espejo central", inicio: 17, duracion: 1, mat: 200.00, mo: 50.00 },

  // DORMITORIO PRINCIPAL
  { esp: "SEGUNDO NIVEL", subesp: "DORM. PPAL", codigo: "2.52", nombre: "Ventana hermética antirruido", inicio: 13, duracion: 2, mat: 0, mo: 0 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. PPAL", codigo: "2.53", nombre: "Cielo raso drywall fosa perimetral", inicio: 13, duracion: 3, mat: 1494.60, mo: 1325.40 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. PPAL", codigo: "2.54", nombre: "Rosetón moldura circular", inicio: 13, duracion: 1, mat: 310.00, mo: 90.00 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. PPAL", codigo: "2.55", nombre: "Cornisas perimetrales clásicas", inicio: 14, duracion: 2, mat: 671.78, mo: 595.73 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. PPAL", codigo: "2.56", nombre: "Marquería de puerta", inicio: 13, duracion: 1, mat: 221.33, mo: 196.27 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. PPAL", codigo: "2.57", nombre: "Armarios/Closets + W.I.C.", inicio: 15, duracion: 5, mat: 17280.00, mo: 5400.00 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. PPAL", codigo: "2.58", nombre: "Mesas noche estilo clásico (2)", inicio: 16, duracion: 1, mat: 763.20, mo: 676.80 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. PPAL", codigo: "2.59", nombre: "Lámparas colgantes mesa noche (2)", inicio: 16, duracion: 1, mat: 800.00, mo: 100.00 },
  { esp: "SEGUNDO NIVEL", subesp: "DORM. PPAL", codigo: "2.60", nombre: "Tira LED fosa techo", inicio: 16, duracion: 1, mat: 372.06, mo: 329.94 },

  // SS.HH. PRINCIPAL
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. DORM. PPAL", codigo: "2.61", nombre: "Corniza techo", inicio: 14, duracion: 1, mat: 299.03, mo: 265.17 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. DORM. PPAL", codigo: "2.62", nombre: "Cielo raso drywall RH", inicio: 14, duracion: 1, mat: 293.20, mo: 260.00 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. DORM. PPAL", codigo: "2.63", nombre: "Marquería/molduras doradas pared", inicio: 15, duracion: 2, mat: 839.52, mo: 744.48 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. DORM. PPAL", codigo: "2.64", nombre: "Marquería de puerta", inicio: 14, duracion: 1, mat: 221.33, mo: 196.27 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. DORM. PPAL", codigo: "2.65", nombre: "Enchape mármol pared", inicio: 15, duracion: 2, mat: 1173.50, mo: 250.00 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. DORM. PPAL", codigo: "2.66", nombre: "Spots LED (4)", inicio: 16, duracion: 1, mat: 195.04, mo: 172.96 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. DORM. PPAL", codigo: "2.67", nombre: "Braquets/apliques clásico (2)", inicio: 16, duracion: 1, mat: 430.00, mo: 120.00 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. DORM. PPAL", codigo: "2.68", nombre: "Cinta LED fosa techo", inicio: 16, duracion: 1, mat: 86.05, mo: 76.31 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. DORM. PPAL", codigo: "2.69", nombre: "Cinta LED contorno espejo", inicio: 16, duracion: 1, mat: 79.50, mo: 70.50 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. DORM. PPAL", codigo: "2.70", nombre: "Colocación granito y mueble baño", inicio: 17, duracion: 2, mat: 1800.00, mo: 450.00 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. DORM. PPAL", codigo: "2.71", nombre: "Toallero cromado (2)", inicio: 17, duracion: 1, mat: 100.70, mo: 89.30 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. DORM. PPAL", codigo: "2.72", nombre: "Portarrollo papel", inicio: 17, duracion: 1, mat: 63.60, mo: 56.40 },
  { esp: "SEGUNDO NIVEL", subesp: "SS.HH. DORM. PPAL", codigo: "2.73", nombre: "Espejo central", inicio: 17, duracion: 1, mat: 200.00, mo: 50.00 },

  // W.I.C. PRINCIPAL
  { esp: "SEGUNDO NIVEL", subesp: "W.I.C. DORM. PPAL", codigo: "2.74", nombre: "Cielo raso drywall fosa perimetral", inicio: 15, duracion: 2, mat: 1845.83, mo: 1636.87 },
  { esp: "SEGUNDO NIVEL", subesp: "W.I.C. DORM. PPAL", codigo: "2.75", nombre: "Cornisas perimetrales clásicas", inicio: 15, duracion: 1, mat: 331.06, mo: 293.59 },
  { esp: "SEGUNDO NIVEL", subesp: "W.I.C. DORM. PPAL", codigo: "2.76", nombre: "Spots LED (4)", inicio: 16, duracion: 1, mat: 195.04, mo: 172.96 },
  { esp: "SEGUNDO NIVEL", subesp: "W.I.C. DORM. PPAL", codigo: "2.77", nombre: "Cinta LED fosa techo", inicio: 16, duracion: 1, mat: 183.36, mo: 162.60 },
  { esp: "SEGUNDO NIVEL", subesp: "W.I.C. DORM. PPAL", codigo: "2.78", nombre: "Instalar closets ropa blanca (2)", inicio: 17, duracion: 2, mat: 2400.00, mo: 600.00 },

  // TERCER NIVEL - AZOTEA BBQ
  { esp: "TERCER NIVEL", subesp: "AZOTEA BBQ", codigo: "3.1", nombre: "Colocar closets", inicio: 18, duracion: 3, mat: 5800.00, mo: 1800.00 },
  { esp: "TERCER NIVEL", subesp: "AZOTEA BBQ", codigo: "3.2", nombre: "Estructura BBQ y espacio horno", inicio: 18, duracion: 4, mat: 2279.00, mo: 2021.00 },
  { esp: "TERCER NIVEL", subesp: "AZOTEA BBQ", codigo: "3.3", nombre: "Enlucido BBQ", inicio: 19, duracion: 2, mat: 991.19, mo: 878.98 },
  { esp: "TERCER NIVEL", subesp: "AZOTEA BBQ", codigo: "3.4", nombre: "Enchape porcelanato BBQ", inicio: 19, duracion: 3, mat: 3731.18, mo: 1100.00 },
  { esp: "TERCER NIVEL", subesp: "AZOTEA BBQ", codigo: "3.5", nombre: "Iluminación BBQ (4 ptos)", inicio: 20, duracion: 1, mat: 1046.77, mo: 200.00 },

  // LAVANDERIA
  { esp: "TERCER NIVEL", subesp: "LAVANDERÍA", codigo: "3.6", nombre: "Lavaropa cemento enchapado", inicio: 18, duracion: 2, mat: 636.00, mo: 564.00 },
  { esp: "TERCER NIVEL", subesp: "LAVANDERÍA", codigo: "3.7", nombre: "Muros cerramiento y puerta", inicio: 18, duracion: 3, mat: 3940.00, mo: 560.00 },

  // TECHO SOL Y SOMBRA
  { esp: "TERCER NIVEL", subesp: "TECHO SOL/SOMBRA", codigo: "3.8", nombre: "Puntos de luz", inicio: 20, duracion: 1, mat: 1484.00, mo: 1316.00 },
  { esp: "TERCER NIVEL", subesp: "TECHO SOL/SOMBRA", codigo: "3.9", nombre: "Estructura aluminio textura madera", inicio: 20, duracion: 4, mat: 12296.00, mo: 10904.00 },
  { esp: "TERCER NIVEL", subesp: "TECHO SOL/SOMBRA", codigo: "3.10", nombre: "Cobertura liviana PC", inicio: 21, duracion: 3, mat: 5465.27, mo: 4846.56 },

  // BAÑO SERVICIO
  { esp: "TERCER NIVEL", subesp: "BAÑO SERV.", codigo: "3.11", nombre: "Enchapar con cerámica", inicio: 19, duracion: 2, mat: 318.00, mo: 282.00 },

  // PARTIDAS GENERALES SC ALBAÑILERIA
  { esp: "PARTIDAS GENERALES", subesp: "ALBAÑILERIA", codigo: "4.1", nombre: "Construcción balcón y puertas Cayetana", inicio: 1, duracion: 4, mat: 4240.00, mo: 3760.00 },
  { esp: "PARTIDAS GENERALES", subesp: "ALBAÑILERIA", codigo: "4.2", nombre: "Construcción terminado baño azotea visita", inicio: 18, duracion: 3, mat: 5035.00, mo: 4465.00 },
  { esp: "PARTIDAS GENERALES", subesp: "ALBAÑILERIA", codigo: "4.3", nombre: "Tarrajeo paredes y rodon techo", inicio: 2, duracion: 6, mat: 4955.93, mo: 4394.88 },
  { esp: "PARTIDAS GENERALES", subesp: "ALBAÑILERIA", codigo: "4.4", nombre: "Vaciado pisos nuevos", inicio: 3, duracion: 4, mat: 2202.64, mo: 1953.28 },
  { esp: "PARTIDAS GENERALES", subesp: "ALBAÑILERIA", codigo: "4.5", nombre: "Vaciado contrapisos", inicio: 3, duracion: 3, mat: 2753.29, mo: 2441.60 },
  { esp: "PARTIDAS GENERALES", subesp: "ALBAÑILERIA", codigo: "4.6", nombre: "Enchape porcelanato pisos c/ zócalo (MO)", inicio: 4, duracion: 5, mat: 0, mo: 16800.00 },
  { esp: "PARTIDAS GENERALES", subesp: "ALBAÑILERIA", codigo: "4.7", nombre: "Enchape porcelanato paredes (MO)", inicio: 4, duracion: 5, mat: 0, mo: 6233.87 },
  { esp: "PARTIDAS GENERALES", subesp: "ALBAÑILERIA", codigo: "4.8", nombre: "Muro ladrillo vestíbulo y 3er piso", inicio: 2, duracion: 3, mat: 991.19, mo: 878.98 },
  { esp: "PARTIDAS GENERALES", subesp: "ALBAÑILERIA", codigo: "4.9", nombre: "Colocación pastelero filoo fachada", inicio: 2, duracion: 2, mat: 1321.58, mo: 1171.97 },

  // SC REFACCION TECHOS
  { esp: "REFACCIÓN TECHOS", subesp: "TECHOS", codigo: "5.1", nombre: "Remoción falso cielo (rehabilitación)", inicio: 1, duracion: 2, mat: 3241.98, mo: 2874.96 },
  { esp: "REFACCIÓN TECHOS", subesp: "TECHOS", codigo: "5.2", nombre: "Limpieza viguetas y curado óxido", inicio: 2, duracion: 2, mat: 2181.98, mo: 1934.96 },
  { esp: "REFACCIÓN TECHOS", subesp: "TECHOS", codigo: "5.3", nombre: "Aplicación concreto refuerzo Sikarep", inicio: 3, duracion: 2, mat: 2381.58, mo: 2111.97 },
  { esp: "REFACCIÓN TECHOS", subesp: "TECHOS", codigo: "5.4", nombre: "Colocación poliestireno", inicio: 3, duracion: 2, mat: 838.98, mo: 1200.00 },
  { esp: "REFACCIÓN TECHOS", subesp: "TECHOS", codigo: "5.5", nombre: "Colocación cielo raso MDF/Drywall", inicio: 4, duracion: 5, mat: 8810.54, mo: 7813.12 },

  // SC REFUERZO METALICO TECHOS
  { esp: "REFUERZO METÁLICO", subesp: "METÁLICO", codigo: "6.1", nombre: "Empotramiento vigas metálicas", inicio: 2, duracion: 4, mat: 14723.18, mo: 13056.40 },
  { esp: "REFUERZO METÁLICO", subesp: "METÁLICO", codigo: "6.2", nombre: "Pintado base sincrom + final", inicio: 5, duracion: 2, mat: 3262.64, mo: 2893.28 },

  // SC REFACCION PISOS
  { esp: "REFACCIÓN PISOS", subesp: "PISOS", codigo: "7.1", nombre: "Sellado grietas con Sikaflex", inicio: 3, duracion: 3, mat: 4591.05, mo: 4071.31 },
  { esp: "REFACCIÓN PISOS", subesp: "PISOS", codigo: "7.2", nombre: "Relleno vacíos poliestireno", inicio: 3, duracion: 2, mat: 550.66, mo: 488.32 },
  { esp: "REFACCIÓN PISOS", subesp: "PISOS", codigo: "7.3", nombre: "Capa sellador plastificante azotea", inicio: 4, duracion: 2, mat: 1941.05, mo: 1721.31 },
  { esp: "REFACCIÓN PISOS", subesp: "PISOS", codigo: "7.4", nombre: "Resina epóxica pavimento base", inicio: 5, duracion: 2, mat: 1411.05, mo: 1251.31 },

  // CARPINTERIA METAL
  { esp: "CARPINTERÍA METAL", subesp: "METAL", codigo: "8.1", nombre: "Fabricación escalera metálica 1-3 piso", inicio: 5, duracion: 4, mat: 6566.59, mo: 5823.20 },

  // CARPINTERIA MADERA
  { esp: "CARPINTERÍA MADERA", subesp: "MADERA", codigo: "9.1", nombre: "Mantenimiento 14 puertas interiores", inicio: 10, duracion: 3, mat: 4632.20, mo: 4107.80 },
  { esp: "CARPINTERÍA MADERA", subesp: "MADERA", codigo: "9.2", nombre: "Mantenimiento portón exterior", inicio: 10, duracion: 2, mat: 2226.00, mo: 1974.00 },
  { esp: "CARPINTERÍA MADERA", subesp: "MADERA", codigo: "9.3", nombre: "Cerrajería renov/nuevo calle", inicio: 10, duracion: 2, mat: 2438.00, mo: 2162.00 },
  { esp: "CARPINTERÍA MADERA", subesp: "MADERA", codigo: "9.4", nombre: "Cambio contraplacado portón y pintura", inicio: 11, duracion: 2, mat: 2570.50, mo: 2279.50 },
  { esp: "CARPINTERÍA MADERA", subesp: "MADERA", codigo: "9.5", nombre: "Mant. escalera 1-2 piso + baranda", inicio: 12, duracion: 4, mat: 10234.83, mo: 9076.17 },

  // PINTURA
  { esp: "PINTURA", subesp: "GENERAL", codigo: "10.1", nombre: "Pintura general interior/exterior y molduras", inicio: 15, duracion: 5, mat: 9361.20, mo: 8301.44 },
  { esp: "PINTURA", subesp: "GENERAL", codigo: "10.2", nombre: "Pintura ventana/mamparas", inicio: 16, duracion: 3, mat: 4405.27, mo: 3906.56 },

  // VIDRIOS / MANTENIMIENTO
  { esp: "VIDRIOS / MANTTO", subesp: "GENERAL", codigo: "11.1", nombre: "Mantenimiento ventanas", inicio: 18, duracion: 2, mat: 2753.29, mo: 2441.60 },
  { esp: "VIDRIOS / MANTTO", subesp: "GENERAL", codigo: "11.2", nombre: "Mantenimiento mamparas jardín", inicio: 18, duracion: 2, mat: 881.05, mo: 781.31 },
  { esp: "JARDINERÍA", subesp: "PAISAJISMO", codigo: "12.1", nombre: "Liberar juntas dilatación + Etsapol", inicio: 19, duracion: 2, mat: 1060.00, mo: 940.00 },
  { esp: "JARDINERÍA", subesp: "PAISAJISMO", codigo: "12.2", nombre: "Agregar ducha teléfono baños", inicio: 17, duracion: 2, mat: 420.00, mo: 980.00 },
  { esp: "JARDINERÍA", subesp: "PAISAJISMO", codigo: "12.3", nombre: "Colocar mampara ducha baños (3)", inicio: 17, duracion: 2, mat: 1350.00, mo: 450.00 },
  { esp: "JARDINERÍA", subesp: "PAISAJISMO", codigo: "12.4", nombre: "Agregar puntos luz pasadizos (4)", inicio: 12, duracion: 2, mat: 530.00, mo: 470.00 },

  // INSTALACIONES SANITARIAS (ACTUALIZADO)
  { esp: "SC INSTALACIONES SANITARIAS", subesp: "SANITARIAS", codigo: "13.1", nombre: "Tendido de red de agua fria", inicio: 22, duracion: 3, mat: 4743.5, mo: 4206.5 },
  { esp: "SC INSTALACIONES SANITARIAS", subesp: "SANITARIAS", codigo: "13.2", nombre: "Tendido de red de agua caliente", inicio: 22, duracion: 3, mat: 4505, mo: 3995 },
  { esp: "SC INSTALACIONES SANITARIAS", subesp: "SANITARIAS", codigo: "13.3", nombre: "Tendido de red de desague", inicio: 22, duracion: 3, mat: 3392, mo: 3008 },
  { esp: "SC INSTALACIONES SANITARIAS", subesp: "SANITARIAS", codigo: "13.4", nombre: "Conexion de tanque elevado", inicio: 23, duracion: 2, mat: 881.05, mo: 781.31 },
  { esp: "SC INSTALACIONES SANITARIAS", subesp: "SANITARIAS", codigo: "13.5", nombre: "Conexion de electrobomba", inicio: 23, duracion: 2, mat: 881.05, mo: 781.31 },
  { esp: "SC INSTALACIONES SANITARIAS", subesp: "SANITARIAS", codigo: "13.6", nombre: "Colocacion de aparatos sanitarios", inicio: 24, duracion: 2, mat: 2003.4, mo: 1776.6 },
  { esp: "SC INSTALACIONES SANITARIAS", subesp: "SANITARIAS", codigo: "13.7", nombre: "Colocacion de accesorios sanitarios", inicio: 24, duracion: 2, mat: 2691.32, mo: 2386.64 },
  { esp: "SC INSTALACIONES SANITARIAS", subesp: "SANITARIAS", codigo: "13.8", nombre: "Instalacion de riego en jardines", inicio: 25, duracion: 2, mat: 3471.5, mo: 3078.5 },
  { esp: "SC INSTALACIONES SANITARIAS", subesp: "SANITARIAS", codigo: "13.9", nombre: "Agua desague BBQ", inicio: 25, duracion: 2, mat: 550.66, mo: 488.32 },

  // INSTALACIONES ELECTRICAS (ACTUALIZADO)
  { esp: "SC INSTALACIONES ELECTRICAS", subesp: "ELECTRICAS", codigo: "14.1", nombre: "Instalar circuito 07 modems internet y camara", inicio: 22, duracion: 2, mat: 8268, mo: 7332 },
  { esp: "SC INSTALACIONES ELECTRICAS", subesp: "ELECTRICAS", codigo: "14.2", nombre: "Colocacion de circuitos de luz 1o a 3er piso", inicio: 22, duracion: 4, mat: 2381.58, mo: 2111.97 },
  { esp: "SC INSTALACIONES ELECTRICAS", subesp: "ELECTRICAS", codigo: "14.3", nombre: "Colocacion de circuitos de tomacorrientes 1o a 3er piso", inicio: 22, duracion: 4, mat: 2471.05, mo: 2191.31 },
  { esp: "SC INSTALACIONES ELECTRICAS", subesp: "ELECTRICAS", codigo: "14.4", nombre: "Circuito de electrobomba", inicio: 23, duracion: 1, mat: 874.5, mo: 775.5 },
  { esp: "SC INSTALACIONES ELECTRICAS", subesp: "ELECTRICAS", codigo: "14.5", nombre: "Circuito de intercomunicador", inicio: 23, duracion: 1, mat: 1101.32, mo: 976.64 },
  { esp: "SC INSTALACIONES ELECTRICAS", subesp: "ELECTRICAS", codigo: "14.6", nombre: "Circuito porton levadizo", inicio: 23, duracion: 1, mat: 385.46, mo: 341.82 },
  { esp: "SC INSTALACIONES ELECTRICAS", subesp: "ELECTRICAS", codigo: "14.7", nombre: "Circuito telefono", inicio: 23, duracion: 1, mat: 974.66, mo: 864.32 },
  { esp: "SC INSTALACIONES ELECTRICAS", subesp: "ELECTRICAS", codigo: "14.8", nombre: "Circuito cable # 6.0, 4.0 y 2.5 THW", inicio: 23, duracion: 2, mat: 715.5, mo: 634.5 },
  { esp: "SC INSTALACIONES ELECTRICAS", subesp: "ELECTRICAS", codigo: "14.9", nombre: "Conexion de automatico de TE", inicio: 24, duracion: 1, mat: 371, mo: 329 },
  { esp: "SC INSTALACIONES ELECTRICAS", subesp: "ELECTRICAS", codigo: "14.10", nombre: "Instalacion de tableros y llaves termomagneticas", inicio: 24, duracion: 2, mat: 4452, mo: 3948 },
  { esp: "SC INSTALACIONES ELECTRICAS", subesp: "ELECTRICAS", codigo: "14.11", nombre: "Luminarias, intercom., telf.) general 1o a 3er piso", inicio: 25, duracion: 3, mat: 2711.98, mo: 2404.96 },
  { esp: "SC INSTALACIONES ELECTRICAS", subesp: "ELECTRICAS", codigo: "14.12", nombre: "Circuito de tuberia de emergencia, lampara de emergencia", inicio: 25, duracion: 2, mat: 1007, mo: 893 },
  { esp: "SC INSTALACIONES ELECTRICAS", subesp: "ELECTRICAS", codigo: "14.13", nombre: "Accesorios tomacorriente", inicio: 25, duracion: 2, mat: 1590, mo: 1410 },
  { esp: "SC INSTALACIONES ELECTRICAS", subesp: "ELECTRICAS", codigo: "14.14", nombre: "Tuberias de luz 1/2, 5/8\"", inicio: 22, duracion: 3, mat: 2385, mo: 2115 },

  // PARTIDAS ESPECIALES - AIRE ACONDICIONADO (ACTUALIZADO)
  { esp: "PARTIDAS ESPECIALES - AIRE ACONDICIONADO", subesp: "AIRE ACONDICIONADO", codigo: "15.1", nombre: "Equipo eacon split inverter 12/24k", inicio: 26, duracion: 2, mat: 9766.48, mo: 8660.84 },
  { esp: "PARTIDAS ESPECIALES - AIRE ACONDICIONADO", subesp: "AIRE ACONDICIONADO", codigo: "15.2", nombre: "Instalacion equipos sistemas aire acond.", inicio: 26, duracion: 3, mat: 5506.59, mo: 4883.2 }
];
