export type User = {
  id: string;
  name: string;
  shortId: string; // e.g. #1234
  companyId?: string | null;
};

export type AuthLoginRequest = {
  login: string; // email или username
  password: string;
};

export type AuthRegisterRequest = {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  passwordConfirm: string;
  agreements: boolean[];
};

export type AuthLoginResponse = {
  accessToken: string;
  user: User;
};

export type AuthRegisterResponse = AuthLoginResponse;

export type AuthRefreshResponse = {
  accessToken: string;
};

export type MeResponse = {
  user: User;
};


