export interface FileDocument {
  id: number;
  name: string;
  size: number;
  type: string;
  performance_count: number;
  imported_by: ImportedBy;
  updated_at: Date;
}

export interface ImportedBy {
  id: number;
  email: string;
}

export interface ICreateImportPDF {
  file: File;
}
