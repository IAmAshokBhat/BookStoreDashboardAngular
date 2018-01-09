import { BadInput } from './../common/bad-input';
import { AppError } from './../common/app.error';
import { BookService } from './../services/book.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NotFoundError } from '../common/not-found-error';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit {
  bookList ;
  deleteModelRef;
  loader = false;
  deleteId = -1;
  closeResult: string;

  @ViewChild('deleteConfirmation') private deleteConfirmation;
  constructor(
    private service:BookService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.fetchBooks();
  }
  fetchBooks(){
    this.loader = true;
    this.service.get()
    .subscribe(bookList =>{ this.bookList = bookList;this.loader = false;},
      (error:AppError) =>{
        this.loader = false;
        if(error instanceof NotFoundError){
          console.log("404 in publication get");
        }else if(error instanceof BadInput){
          console.log("BadInput in publication get");
        }else{
          throw error;
        } 
      });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
    
  }
  confirmModalOpen(content) {
    this.deleteModelRef = this.modalService.open(content,{keyboard:false} );    
    this.deleteModelRef.result.then((result) => {        
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  delete(event:Event,id){
    event.preventDefault();
    event.stopImmediatePropagation();  
     this.confirmModalOpen(this.deleteConfirmation);
     this.deleteId = id;    
  }
  deleteConfirmed(){
    this.loader = true;
    this.service.delete("http://bookstore-trial.herokuapp.com/api/book?bookId="+this.deleteId)
    .subscribe(()=>{
      this.fetchBooks();
      this.deleteModelRef.close()
    })
  }  

}
