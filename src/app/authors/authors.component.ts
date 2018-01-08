import { NgForm } from '@angular/forms/src/directives/ng_form';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotFoundError } from './../common/not-found-error';
import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import { AuthorService } from '../services/author.service';
import { AppError } from '../common/app.error';
import { BadInput } from '../common/bad-input';

@Component({
  selector: 'authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.css']
})
export class AuthorsComponent implements OnInit {
  authors;
  author;
  form;
  closeResult: string;
  modelRef;
  loader = false;

  @ViewChild('content') private content;
  constructor(
    private service: AuthorService,
    private modalService: NgbModal) {
  
   }

  ngOnInit() {  
    this.initialiseForm();
    this.fetchAuthors();

  }

  initialiseForm(){
      this.author = {"author_id":"-1","author_name":""};
      this.form = new FormGroup({
        "author_id":new FormControl(this.author.author_id),
        "author_name":new FormControl(this.author.author_name,Validators.required)
      });    
  }
  get author_name(){
    return this.form.get('author_name');
  }

  get author_id(){
    return this.form.get('author_id');
  }

  fetchAuthors(){
    this.loader = true;
    this.service.get()
    .subscribe(authors => {this.authors = authors;this.loader = false;},
      (error:AppError) =>{
        this.loader = false;
        if(error instanceof NotFoundError){
          console.log("404 in publication get");
        }else if(error instanceof BadInput){
          console.log("BadInput in publication get");
        }else{
          throw error;
        } 
      })
  }

  addAuthor(){
    if(this.form.valid){
      if(this.form.value.author_id == "-1"){
        this.loader = true;
        this.service.create("http://bookstore-trial.herokuapp.com/api/author",this.form.value)
      .subscribe(()=>{
        this.fetchAuthors();
        this.modelRef.close()
      })
      }else{
        this.service.update("http://bookstore-trial.herokuapp.com/api/author",this.form.value)
        .subscribe(()=>{
          
          this.fetchAuthors();
          this.modelRef.close()
        })
      }
      
      
    }
  }

  open(content) {
    this.modelRef = this.modalService.open(content);
    
    this.modelRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    this.author = {"author_id":"-1","author_name":""};
    (this.form as NgForm).setValue(this.author);
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  editAuthorPopUp(author){
    this.author = author;
    (this.form as NgForm).setValue(author);
    this.open(this.content);
  }

  delete(event:Event,id){
    event.stopImmediatePropagation();
    this.loader = true;
    this.service.delete("http://bookstore-trial.herokuapp.com/api/author?author_id="+id)
        .subscribe(()=>{
          this.fetchAuthors();
          this.modelRef.close()
        })
  }

}
