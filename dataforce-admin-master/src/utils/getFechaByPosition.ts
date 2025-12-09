import { capitalize } from "lodash";
import moment from "moment";
import { Moment } from "moment";


// Función para cambiar solo el día manteniendo el mismo horario
export function getFechaByPosition(momentOriginal: Moment, nuevaFecha: Moment) {
  // Parsea la nueva fecha
  const momentNuevaFecha = moment(nuevaFecha);

  // Cambia solo el día manteniendo el mismo horario
  const momentResultado = momentOriginal.clone().set({
    year: momentNuevaFecha.year(),
    month: momentNuevaFecha.month(),
    date: momentNuevaFecha.date(),
  }).utc();

  return momentResultado;
}



export const getStartOfWeek = (moment: Moment) => {
  const domingoDeLaSemana = moment.clone().startOf('isoWeek').subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss');
  return domingoDeLaSemana;
}

export const getToday = (moment: Moment) => {
  const today = moment.clone().format('YYYY-MM-DD HH:mm:ss');
  return today;
}

export const getEndOfWeek = (moment: Moment, weeks: number) => {
  const sabadoDeLaSemana = moment.clone().endOf('isoWeek').subtract(1, 'day').add(weeks, 'weeks').format('YYYY-MM-DD HH:mm:ss');
  return sabadoDeLaSemana;
}

export const getDateForHeaderSchedule = (moment: Moment, weeks: number) => {

  const año = moment.clone().startOf('isoWeek').subtract(1, 'day').format('YYYY');

  if(weeks === 1) {
    const domingo = moment.clone().startOf('isoWeek').subtract(1, 'day').format('MMM DD');
    const sabado = moment.clone().endOf('isoWeek').subtract(1, 'day').format('MMM DD')
    return `${capitalize(domingo.replace('.', ''))} - ${capitalize(sabado.replace('.', ''))}, ${año}`
  }

  if(weeks === 0){
    const dia = moment.clone().format('MMM DD')
    return `${capitalize(dia.replace('.', ''))}, ${año}`
  }

  const domingo = moment.clone().startOf('isoWeek').subtract(1, 'day').format('MMM DD');
  const sabado = moment.clone().add(1, 'week').endOf('isoWeek').subtract(1, 'day').format('MMM DD')

  return `${capitalize(domingo.replace('.', ''))} - ${capitalize(sabado.replace('.', ''))}, ${año}`

  
}