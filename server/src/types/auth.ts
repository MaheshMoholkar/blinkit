export interface CustomerAuthBody {
  phone: string;
}

export interface DeliveryPartnerAuthBody {
  email: string;
  password: string;
}

export interface JwtTokenBody {
  role: string;
  userId: string;
}
