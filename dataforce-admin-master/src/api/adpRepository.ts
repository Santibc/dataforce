import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { httpClient } from 'src/utils/httpClient';

// ----------------------------------------------------------------------
// Tipos
// ----------------------------------------------------------------------

export interface IAdpConnectionStatus {
  configured: boolean;
  active: boolean;
  client_id: string | null;
  base_url: string | null;
  token_url: string | null;
  token_expires_at: string | null;
  /** Certificado guardado (parte publica, se devuelve completo). */
  certificate_pem: string | null;
  has_certificate: boolean;
  has_client_secret: boolean;
  /** Client secret enmascarado (solo los ultimos 4 caracteres). */
  client_secret_preview: string | null;
  has_private_key: boolean;
  /** Cabecera del PEM de la clave privada, sin el contenido. */
  private_key_preview: string | null;
  updated_at: string | null;
}

export interface IAdpConnectionInput {
  client_id: string;
  /** Vacio = conservar el secreto ya guardado en la base de datos. */
  client_secret?: string;
  certificate_pem?: string;
  private_key?: string;
  base_url?: string;
  token_url?: string;
  active?: boolean;
}

export interface IAdpTestConnectionResult {
  ok: boolean;
  status?: number;
  token_ok?: boolean;
  sample_count?: number;
  error?: string | null;
}

export interface IAdpUserSummary {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone_number: string | null;
  driver_amazon_id: string | null;
  adp_aoid?: string | null;
}

export interface IAdpPossibleMatch {
  user_id: number;
  match_type: 'aoid' | 'email' | 'phone' | 'name' | 'amazon_id';
  user: IAdpUserSummary | null;
}

export interface IAdpWorkerPayload {
  aoid: string;
  worker_id: string | null;
  firstname: string | null;
  lastname: string | null;
  emails: string[];
  phones: string[];
  status: string | null;
  job_title: string | null;
  department: string | null;
  hire_date: string | null;
  amazon_id: string | null;
  manager_aoid: string | null;
}

export interface IAdpCandidate {
  id: number;
  adp_aoid: string;
  classification: 'matched' | 'ambiguous' | 'new';
  status: 'pending' | 'linked' | 'created' | 'ignored';
  resolved_user_id: number | null;
  worker: IAdpWorkerPayload;
  possible_matches: IAdpPossibleMatch[];
}

export interface IAdpSyncPreview {
  amazon_id_available: boolean;
  counts: { matched: number; ambiguous: number; new: number; only_in_bosmetrics: number };
  matched: IAdpCandidate[];
  ambiguous: IAdpCandidate[];
  new: IAdpCandidate[];
  only_in_bosmetrics: IAdpUserSummary[];
}

export interface IAdpSyncDecision {
  aoid: string;
  action: 'link' | 'create' | 'ignore';
  user_id?: number;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone_number?: string;
  driver_amazon_id?: string;
  position_id?: number;
  jobsite_id?: number;
}

export interface IAdpWeeklyHoursRow {
  user_id: number;
  minutes: number;
  hours: number;
  status: 'normal' | 'orange' | 'red';
}

export interface IAdpWeeklyHours {
  week_start: string;
  week_end: string;
  threshold: number;
  warning: number;
  drivers: IAdpWeeklyHoursRow[];
}

export interface IAdpTimeCard {
  id: number;
  user_id: number | null;
  adp_aoid: string;
  period_code: string | null;
  period_start: string;
  period_end: string;
  period_status: string | null;
  total_minutes: number;
  daily_totals: { date: string | null; pay_code: string; minutes: number }[] | null;
}

export interface IAdpUserHistory {
  user_id: number;
  time_cards: IAdpTimeCard[];
  total_minutes: number;
  total_hours: number;
}

// ----------------------------------------------------------------------
// Repository
// ----------------------------------------------------------------------

export class AdpRepository {
  keys = {
    connection: () => ['adp', 'connection'],
    candidates: () => ['adp', 'candidates'],
    weekly: (week?: string) => ['adp', 'weekly', week ?? 'current'],
    history: (userId: number, from?: string, to?: string) => ['adp', 'history', userId, from, to],
  };

  // --- Conexion ---
  getConnection = async () => {
    const { data } = await httpClient.get<IAdpConnectionStatus>('admin/adp/connection');
    return data;
  };

  saveConnection = (input: IAdpConnectionInput) => httpClient.put('admin/adp/connection', input);

  testConnection = async () => {
    const { data } = await httpClient.get<IAdpTestConnectionResult>('admin/adp/test-connection');
    return data;
  };

  // --- Sincronizacion de trabajadores ---
  syncPreview = async () => {
    const { data } = await httpClient.post<IAdpSyncPreview>('admin/adp/sync/preview');
    return data;
  };

  getCandidates = async () => {
    const { data } = await httpClient.get<{ candidates: IAdpCandidate[] }>('admin/adp/sync/candidates');
    return data.candidates;
  };

  confirmSync = (decisions: IAdpSyncDecision[]) =>
    httpClient.post('admin/adp/sync/confirm', { decisions });

  bulkCreateActive = async () => {
    const { data } = await httpClient.post<{ created: number; skipped: number }>(
      'admin/adp/sync/bulk-create-active'
    );
    return data;
  };

  // --- Horas ---
  syncHours = async () => {
    const { data } = await httpClient.post('admin/adp/time-cards/sync');
    return data;
  };

  getWeeklyHours = async (week?: string) => {
    const { data } = await httpClient.get<IAdpWeeklyHours>(
      `admin/adp/time-cards/weekly${week ? `?week=${week}` : ''}`
    );
    return data;
  };

  refreshWeeklyHours = async (week?: string) => {
    const { data } = await httpClient.post<IAdpWeeklyHours>(
      `admin/adp/time-cards/weekly/refresh${week ? `?week=${week}` : ''}`
    );
    return data;
  };

  getUserHistory = async (userId: number, from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    const qs = params.toString();
    const { data } = await httpClient.get<IAdpUserHistory>(
      `admin/adp/users/${userId}/time-cards${qs ? `?${qs}` : ''}`
    );
    return data;
  };

  refreshUserHistory = async (userId: number) => {
    const { data } = await httpClient.post<IAdpUserHistory>(
      `admin/adp/users/${userId}/time-cards/refresh`
    );
    return data;
  };
}

const repo = new AdpRepository();

// ----------------------------------------------------------------------
// Hooks
// ----------------------------------------------------------------------

/**
 * Mensaje de error que devuelve el backend. Los endpoints de ADP responden 422 con
 * `{ error: '...' }` (p. ej. cuando la compania no tiene conexion configurada), asi
 * que hay que leerlo del body y no quedarse con el "Request failed with status code".
 */
export const adpErrorMessage = (error: any, fallback = 'Unexpected error connecting to ADP') =>
  error?.response?.data?.error ||
  error?.response?.data?.message ||
  error?.message ||
  fallback;

/** Muestra el error del backend en un snackbar. */
const notifyAdpError = (error: any) =>
  enqueueSnackbar(adpErrorMessage(error), { variant: 'error' } as any);

export const useAdpConnectionQuery = () =>
  useQuery({ queryKey: repo.keys.connection(), queryFn: repo.getConnection });

export const useSaveAdpConnectionMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.saveConnection,
    onError: notifyAdpError,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.connection());
      enqueueSnackbar('ADP connection saved', { variant: 'success' } as any);
    },
  });
};

export const useTestAdpConnectionMutation = () =>
  useMutation({ mutationFn: repo.testConnection, onError: notifyAdpError });

export const useAdpSyncPreviewMutation = () =>
  useMutation({ mutationFn: repo.syncPreview, onError: notifyAdpError });

export const useConfirmAdpSyncMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.confirmSync,
    onError: notifyAdpError,
    onSuccess: () => {
      qc.invalidateQueries(repo.keys.candidates());
      enqueueSnackbar('Sync applied', { variant: 'success' } as any);
    },
  });
};

export const useBulkCreateActiveMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => repo.bulkCreateActive(),
    onError: notifyAdpError,
    onSuccess: (data) => {
      qc.invalidateQueries(repo.keys.candidates());
      enqueueSnackbar(`${data.created} drivers created`, { variant: 'success' } as any);
    },
  });
};

export const useSyncAdpHoursMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: repo.syncHours,
    onError: notifyAdpError,
    onSuccess: () => {
      qc.invalidateQueries(['adp', 'weekly']);
      enqueueSnackbar('Hours synced', { variant: 'success' } as any);
    },
  });
};

export const useAdpWeeklyHoursQuery = (week?: string, enabled = true) =>
  useQuery({ queryKey: repo.keys.weekly(week), queryFn: () => repo.getWeeklyHours(week), enabled });

/**
 * Dispara el refresco del periodo de la semana desde ADP (en segundo plano) y, al
 * terminar, actualiza la cache de las horas semanales sin recargar la pagina.
 */
export const useRefreshAdpWeeklyMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (week?: string) => repo.refreshWeeklyHours(week),
    onSuccess: (data, week) => {
      qc.setQueryData(repo.keys.weekly(week), data);
    },
  });
};

export const useAdpUserHistoryQuery = (userId: number, from?: string, to?: string, enabled = true) =>
  useQuery({
    queryKey: repo.keys.history(userId, from, to),
    queryFn: () => repo.getUserHistory(userId, from, to),
    enabled,
  });

/**
 * Refresca el historico del driver desde ADP (en segundo plano, con throttle) y, al
 * terminar, invalida la cache para que el perfil muestre los datos actualizados.
 */
export const useRefreshAdpUserHistoryMutation = (userId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => repo.refreshUserHistory(userId),
    onSuccess: () => {
      qc.invalidateQueries(['adp', 'history', userId]);
    },
  });
};
