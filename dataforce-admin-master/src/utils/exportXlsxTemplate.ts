

import FileSaver from 'file-saver';
import { ScheduleShift } from 'src/api/scheduleJobsiteRepository';
import { getAmPmFromDateString } from 'src/features/positions/PositionsTable';
import * as XLSX from 'xlsx';

interface TableExportProps {
  data: ({
    completedShifts: ScheduleShift[];
    cantidad_horas: number;
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone_number: string;
    driver_amazon_id: string;
    company_id: number;
    shifts: ScheduleShift[];
  } | null)[];
  columns: string[];
  fileName: string;
}

export const exportToXLSX = ({ data, columns, fileName }: TableExportProps) => {
  
  const workbook = XLSX.utils.book_new();
  const data2 = data.map(x => {
    return [
      x?.firstname + ' ' + x?.lastname,
      x?.cantidad_horas,
      ...x!.completedShifts.map(y => 
        y === undefined 
          ? "-" 
          : y.name + ' ' + getAmPmFromDateString(y.from) + ' - ' + getAmPmFromDateString(y.to) + ' | ' + `${y.delete_after_published ? 'Deleted after published' : `Publish: ${y.published ? 'Yes' : 'No'}`}`
      )
    ];
  });


  const worksheetData = [columns, ...data2];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  XLSX.utils.book_append_sheet(workbook, worksheet, fileName);

  const exportData = XLSX.writeFile(workbook, `${fileName}.xlsx`);

  const exportToCSV = () => {
    FileSaver.saveAs(exportData, fileName + '.xlsx');
  };

  return exportToCSV();

}