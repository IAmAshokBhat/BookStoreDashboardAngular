import { BadInput } from './../common/bad-input';
import { AppError } from './../common/app.error';
import { BookService } from './../services/book.service';
import { Component, OnInit } from '@angular/core';
import { NotFoundError } from '../common/not-found-error';

@Component({
  selector: 'book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  bookList ;
  constructor(private service:BookService) { }

  ngOnInit() {
    this.service.get()
    .subscribe(bookList => this.bookList = bookList,
      (error:AppError) =>{
        if(error instanceof NotFoundError){
          console.log("404 in publication get");
        }else if(error instanceof BadInput){
          console.log("BadInput in publication get");
        }else{
          throw error;
        } 
      });
  }

}
