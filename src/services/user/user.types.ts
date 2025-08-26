export type TUser = {
  email: string;
  name: string;
};

export type TAuthPayload = {
  user: TUser;
  accessToken: string;
  refreshToken: string;
};
