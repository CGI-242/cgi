import "axios";

declare module "axios" {
  interface AxiosRequestConfig {
    _skipAuthRetry?: boolean;
  }
}
