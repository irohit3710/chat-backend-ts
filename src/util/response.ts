export class Response {
    data: any;
    message: string;
    status: number;
    constructor(data: any, message: string, status?: number) {
      this.data = data;
      this.message = message || "Operation completed successfully";
      this.status = status || 200;
    }
  }
  
  export function throwError(message: string, statusCode: number) {
    let newError: any = new Error(message || "Internal Server Error");
    newError["status"] = statusCode || 500;
    throw newError;
  }
  
  export function shuffleArr(arr: any[]) {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled;
  }
  