import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable()
export class PublicationService extends DataService {

  constructor(http: Http) {
    super(http, "http://bookstore-trial.herokuapp.com/api/publications");
   }

}
