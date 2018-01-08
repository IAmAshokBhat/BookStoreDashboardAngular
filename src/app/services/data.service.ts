import { BadInput } from './../common/bad-input';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions  } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { AppError } from '../common/app.error';
import { NotFoundError } from '../common/not-found-error';

@Injectable()
export class DataService {
  private headers = new Headers({
    // 'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.ZW1haWxAbm9lbWFpbC5jb20.fGbjTahMFHe9Ad330JH5HfkhNuP4FdXICuQHgKS9Xag'		
  });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http:Http,public url:string) { }

  get(){
    return this.http.get(this.url,this.options)
    .map(response => response.json().data)
    .catch(this.handleError);
  }
  
  getWithId(url){
    return this.http.get(url,this.options)
    .map(response => response.json().data)
    .catch(this.handleError);
  }

  setUrl(url){
    this.url = url;
  }

  create(url, resource){
    return this.http.post(url,new Array(resource),this.options)
    .map(response => response.json())
    .catch(this.handleError);
  }

  update(url, resource){
    return this.http.put(url,resource,this.options)
    .map(response => response.json())
    .catch(this.handleError);
  }
  delete(url){
    return this.http.delete(url,this.options)
    .map(response => response.json())
    .catch(this.handleError);
  }


  private handleError(error:Response){
    if(error.status === 404){        
      return Observable.throw(new NotFoundError());
   }else if(error.status === 400){
     return Observable.throw(new BadInput);
   }else{
     return Observable.throw(new AppError(error));
   }
  }
}
