import { AbstractControl,ValidationErrors } from "@angular/forms";

export class CustomValidator{
    static cannotContainSpace(control: AbstractControl) : ValidationErrors | null{
        if((control.value as string).indexOf(' ') >= 0){
            return { cannotContainSpace:true  }
        }
        return null
    }

    //Async validator

    static isGreaterThanCurrentYear(control: AbstractControl) : Promise <ValidationErrors | null>{
        return new Promise((resolve, reject) =>{
            setTimeout(()=>{
                if(control.value > 2018 )
                    resolve({isGreaterThanCurrentYear:true});
                else resolve(null);
               
            },2000) ;   
           

        });
    }
} 