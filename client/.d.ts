declare module '*.png' {
    const value: string;
    export default value;
  }
  

  declare module 'jwt-decode' {
    export default function jwt_decode<T>(token: string): T;
  }
  

