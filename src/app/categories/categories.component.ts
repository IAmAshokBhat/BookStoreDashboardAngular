import { BadInput } from './../common/bad-input';
import { AppError } from './../common/app.error';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { NotFoundError } from '../common/not-found-error';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {  FormGroup, Validators,  FormControl } from '@angular/forms';
import { NgForm } from '@angular/forms/src/directives/ng_form';


@Component({
  selector: 'categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories ;
  closeResult: string;
  modelRef;
  form;
  category;
  loader = false;

  @ViewChild('content') private content;

  constructor(
    private service:CategoriesService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.initialiseForm();
    this.fetchCategories();
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
    this.category = {"category_id":"-1","category_name":""};
    (this.form as NgForm).setValue(this.category);
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
    
  }

  fetchCategories(){
    this.loader = true;
    this.service.get()
    .subscribe(categories =>{ 
      this.categories = categories ;  
       this.loader = false;
      },    
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
  initialiseForm(){
    this.category = {"category_id":"-1","category_name":""};
    this.form = new FormGroup({
      "category_id":new FormControl(this.category.category_id),
      "category_name":new FormControl(this.category.category_name,Validators.required)
    })
  }
  get category_name(){
    return this.form.get('category_name');
  }
  get category_id(){
    return this.form.get('category_id');
  }
  addCategory(){
    if(this.form.valid){
      if(this.form.value.category_id == "-1"){
        this.loader = true;
        this.service.create("http://bookstore-trial.herokuapp.com/api/category",this.form.value)
        .subscribe(()=>{
          this.fetchCategories();
          this.modelRef.close()
        })
      }else{
        this.loader = true;
        this.service.update("http://bookstore-trial.herokuapp.com/api/category",this.form.value)
        .subscribe(()=>{
          this.fetchCategories();
          this.modelRef.close()
        })
      }
     
      
    }
  }

  editCategoryPopUp(category){
    console.log(category)
    this.category = category;
    (this.form as NgForm).setValue(category);
    this.open(this.content);
  }

  delete(event : Event,id){
    this.loader = true;
    event.stopImmediatePropagation();
    this.service.delete("http://bookstore-trial.herokuapp.com/api/category?category_id="+id)
        .subscribe(()=>{
          this.fetchCategories();
          this.modelRef.close()
        })
  }
}
