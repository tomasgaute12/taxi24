// Función para convertir grados a radianes
function deg2rad(grados) {
  return (grados * Math.PI) / 180;
}

// Función para calcular la distancia en kilómetros entre dos puntos
export function calculateDistanceInKm(latitud1: number, longitud1: number, latitud2: number, longitud2: number) {
    const radioTierraKm = 6371; // Radio promedio de la Tierra en kilómetros
    console.log("Calculando distancia: ", latitud1,latitud2,longitud1,longitud2);
    
    const latitudRad1 = deg2rad(latitud1);
    const longitudRad1 = deg2rad(longitud1);
    const latitudRad2 = deg2rad(latitud2);
    const longitudRad2 = deg2rad(longitud2);
  
    const distanciaLatitud = latitudRad2 - latitudRad1;
    const distanciaLongitud = longitudRad2 - longitudRad1;
  
    const a = Math.sin(distanciaLatitud / 2) ** 2 +
      Math.cos(latitudRad1) * Math.cos(latitudRad2) *
      Math.sin(distanciaLongitud / 2) ** 2;
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distancia = radioTierraKm * c;
  
    return distancia;
  }

  // Función para calcular el tiempo de llegada
export function calculateTimeArrival(ubicacionInicial, ubicacionFinal) {
  const lat1= ubicacionInicial.lat;
  const long1 = ubicacionInicial.long;
  const lat2 = ubicacionFinal.lat;
  const long2 = ubicacionFinal.long
  const distancia = calculateDistanceInKm(lat1,long1,lat2,long2);
  const velocidadPromedio = 60; // km/h 

  const tiempoEnHoras = distancia / velocidadPromedio;
  const tiempoEnMinutos = tiempoEnHoras * 60;

  const tiempoEstimadoEnMilisegundos = tiempoEnMinutos * 60000; // Convertir minutos a milisegundos

  const tiempoLlegada = new Date(Date.now() + tiempoEstimadoEnMilisegundos);

  return tiempoLlegada;
}

// Función para calcular el costo por kilómetro recorrido
export function calculatePrice(ubicacionInicial, ubicacionFinal) {
  const lat1= ubicacionInicial.lat;
  const long1 = ubicacionInicial.long;
  const lat2 = ubicacionFinal.lat;
  const long2 = ubicacionFinal.long
  const distancia = calculateDistanceInKm(lat1,long1,lat2,long2);
  const tarifaPorKilometro = 2.5; // (ejemplo: tarifa de USD 2.5 por kilómetro)

  const costoTotal = distancia * tarifaPorKilometro;

  return Number(costoTotal.toFixed(2));
}
