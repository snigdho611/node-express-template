export interface SuccessResponse {
  success: true;
  message: string;
  results: any[];
}

export interface SuccessProps {
  message: string;
  data?: any;
}

export interface FailureResponse {
  success: false;
  message: string;
  errors: any[];
}

export interface FailureProps {
  message: string;
  error?: any[];
}

export interface IUser {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  type: string;
  balance: number;
}
