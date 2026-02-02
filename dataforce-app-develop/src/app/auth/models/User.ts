export interface Usuario {
  id?: number;
  email: string;
  password?: string;
  activo?: boolean;
  staff?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const usuarioBuilder = {
  fromBackEnd: (user: any): Usuario => ({
    id: user.id,
    email: user.email,
    activo: user.is_active,
    password: user.password,
    staff: user.is_staff
  })
};
