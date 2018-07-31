export class ResponseType {
    message: string;
    error: string;
    status: number;
}

export const getResponse =  async (responseType: any): Promise<any> => {

     let response = {
         message: responseType.message,
         error: responseType.error
     };

     return Promise.resolve(response);
}

export const getStatus =  async (responseType: any): Promise<number> => {
    console.log(responseType.status);
    return Promise.resolve(responseType.status);
}