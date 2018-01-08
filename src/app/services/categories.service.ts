import { DataService } from './data.service';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CategoriesService extends DataService {

  constructor(http:Http) {
    super(http,"http://bookstore-trial.herokuapp.com/api/categories");
   }

}
