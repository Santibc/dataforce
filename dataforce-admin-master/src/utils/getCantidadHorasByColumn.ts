import moment from "moment";
import { ScheduleShift } from "src/api/scheduleJobsiteRepository";



export function getCantidadHorasByColumn(elementos: (ScheduleShift[] | undefined)[], index: number) {
  let acumuladorHoras = 0;

  elementos.forEach((elemento) => {
    if(elemento && elemento[index]){
      const element = elemento[index];
      const desde = element.from;
      const hasta = element.to;
      const diferenciaHoras = hasta.diff(desde, 'hours');
      acumuladorHoras += diferenciaHoras;  
    }
  });

  return acumuladorHoras;
}