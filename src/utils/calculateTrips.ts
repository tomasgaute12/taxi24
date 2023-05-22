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

  export function calculateEstimatedArrivalTime(startLocation, endLocation) {
    
    const distanciaKm = calculateDistanceInKm(
      startLocation.lat,
      startLocation.long,
      endLocation.lat,
      endLocation.long
    );
    
    const velocidadPromedio = 60;
    const tiempoEstimadoHoras = distanciaKm / velocidadPromedio;
  
    // Tiempo adicional para retrasos o condiciones de tráfico
    const tiempoAdicionalHoras = 0.5; // Por ejemplo, 30 minutos adicionales
  
    const horaActual = new Date();
    const horaEstimadaLlegada = new Date(horaActual.getTime() + tiempoEstimadoHoras * 3600000 + tiempoAdicionalHoras * 3600000);
  
    return horaEstimadaLlegada;
  }
  

