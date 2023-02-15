import {
  FailureProps,
  FailureResponse,
  SuccessProps,
  SuccessResponse,
} from "../interfaces/commmon";

export const success = ({ message, data = [] }: SuccessProps): SuccessResponse => {
  return {
    success: true,
    message: message,
    results: data ? data : [],
  };
};

export const failure = ({ message, error }: FailureProps): FailureResponse => {
  return {
    success: false,
    message: message,
    errors: error ? error : [],
  };
};
