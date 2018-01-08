import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { DataService } from './data.service';

@Injectable()
export class AuthorService extends DataService{ 
  
  constructor(http: Http ) { 
    super(http,"http://bookstore-trial.herokuapp.com/api/authors");
  }
  
 
}
