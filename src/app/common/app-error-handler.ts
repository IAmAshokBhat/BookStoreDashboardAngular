import { ErrorHandler } from "@angular/core";

export class AppErrorHandler implements ErrorHandler{
    handleError(error){
        console.log("Global Error Handler");
        console.log(error);
    }
}