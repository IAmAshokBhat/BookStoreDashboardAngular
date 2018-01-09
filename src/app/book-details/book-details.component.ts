import { BadInput } from './../common/bad-input';
import { AppError } from './../common/app.error';
import { BookService } from './../services/book.service';
import { PublicationService } from './../services/publication.service';
import { AuthorService } from './../services/author.service';
import { CustomValidator } from './../common/custom.validator';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { CategoriesService } from '../services/categories.service';
import { NotFoundError } from '../common/not-found-error';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  book;
  form;
  authors;
  publications;
  categories;
  loader = false;
  showFileSelector = false;

  constructor(
    private authorService: AuthorService,
    private publicationService: PublicationService,
    private categoryService: CategoriesService,
    private bookService: BookService,
    private route: ActivatedRoute,
  private router: Router){
      this.initialse();
    }
    initialse(){
      this.book = {
            "book_id": "",
            "book_name": "",
            "thumb_url": "",
            "author_name": "",
            "author_id": -1,
            "category_name": "",
            "category_id": -1,
            "publication_name": "",
            "publication_id": -1,
            "yop": "",
            "description": "",
            "price": ""
          }
          this.form = new FormGroup({
            "book_id": new FormControl(this.book.book_id),
            "book_name": new FormControl(this.book.book_name,Validators.required),
            "author": new FormControl(this.book.author_id,Validators.required),
            "category": new FormControl(this.book.category_id,Validators.required),
            "publication": new FormControl(this.book.publication_id,Validators.required),
            "yop": new FormControl(this.book.yop.toString(),[Validators.required,Validators.minLength(4),Validators.maxLength(4),CustomValidator.cannotContainSpace], CustomValidator.isGreaterThanCurrentYear),
            "description": new FormControl(this.book.description),
            "price":new FormControl(this.book.price,Validators.required),
            "thumb_url":new FormControl(this.book.thumb_url)
        })
    }

  ngOnInit(){
    this.loader = true;
    this.authorService.get().subscribe(authors => this.authors = authors);
    this.categoryService.get().subscribe(categories => this.categories = categories);
    this.publicationService.get().subscribe(publications => this.publications = publications );
    this.route.paramMap.subscribe(params => {    
      let specificBookUrl = "http://bookstore-trial.herokuapp.com/api/getBookWithId?bookId=" + params.get('id');   
      if(params.get('id') != '-1'){
        this.bookService.getWithId(specificBookUrl)
        .subscribe(book => {  
                this.loader = false;       
                this.book = book[0];
                this.form = new FormGroup({
                  "book_id": new FormControl(this.book.book_id),
                  "book_name": new FormControl(this.book.book_name,Validators.required),
                  "author": new FormControl(this.book.author_id,Validators.required),
                  "category": new FormControl(this.book.category_id,Validators.required),
                  "publication": new FormControl(this.book.publication_id,Validators.required),
                  "yop": new FormControl(this.book.yop.toString(),[Validators.required,Validators.minLength(4),Validators.maxLength(4),CustomValidator.cannotContainSpace], CustomValidator.isGreaterThanCurrentYear),
                  "description": new FormControl(this.book.description),
                  "price":new FormControl(this.book.price,Validators.required),
                  "thumb_url":new FormControl(this.book.thumb_url,Validators.required)
              })            
            },
          (error:AppError) =>{
            if(error instanceof NotFoundError){
              console.log("404 in book get");
            }else if(error instanceof BadInput){
              console.log("BadInput in book get");
            }else{
              throw error;
            } 
          });
      }else{
        this.loader = false;  
        this.showFileSelector = true;
      }    
   
    })
  }


  get book_name(){
    return this.form.get('book_name');
  }
  get author(){
    return this.form.get('author');
  }
  get category(){
    return this.form.get('category');
  }
  get publication(){
    return this.form.get('publication');
  }
  get yop(){
    return this.form.get('yop');
  }
  get price(){
    return this.form.get('price');
  } 
  get thumb_url(){
    return this.form.get('thumb_url');
  }

  addBook(){
    console.log(this.form.value);
    const formModel:FormData = this.prepareSave();
    console.log(formModel);
     this.loader = true;
    let updatedBook = {      
    "book_name": this.form.value.book_name,
      "author_id": this.form.value.author,
      "category_id": this.form.value.category,
      "publication_id": this.form.value.publication,
      "yop": this.form.value.yop.toString(),
      "description": this.form.value.description,
      "price":this.form.value.price,
      "thumb_url":this.form.value.thumb_url
    };

    
    this.route.paramMap.subscribe(params => { 
      if(params.get("id") != "-1"){
       // updatedBook['book_id'] = this.form.value.book_id,
       formModel.append('book_id', this.form.get('book_id').value);
        this.bookService.updateWithFormData("http://bookstore-trial.herokuapp.com/api/book",formModel)
        .subscribe(response => {console.log(response) ;  this.loader = false;},
          (error:AppError) =>{
            if(error instanceof NotFoundError){
              console.log("404 in book get");
            }else if(error instanceof BadInput){
              console.log("BadInput in book get");
            }else{
              throw error;
            } 
          });  
      }else{

        this.bookService.createWithFormData("http://bookstore-trial.herokuapp.com/api/book",formModel)
        .subscribe(response =>{
          if(response.status == 1){
            this.router.navigate(['/']);
            this.loader = false;
          }
        },
          (error:AppError) =>{
            this.loader = false;
            if(error instanceof NotFoundError){
              console.log("404 in book get");
            }else if(error instanceof BadInput){
              console.log("BadInput in book get");
            }else{
              throw error;
            } 
          });
      }
    
     });
  

  }

  onFileChange(event) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.form.get('thumb_url').setValue(file);
    }
  }

  private prepareSave(): any {
    let input = new FormData();
    input.append('book_name', this.form.get('book_name').value);
    input.append('author_id', this.form.get('author').value);
    input.append('category_id', this.form.get('category').value);
    input.append('publication_id', this.form.get('publication').value);
    input.append('yop', this.form.get('yop').value);
    input.append('description', this.form.get('description').value);
    input.append('price', this.form.get('price').value);
    input.append('thumb_url', this.form.get('thumb_url').value);
    return input;
  }

  toggleFileSelector(){
    this.showFileSelector = true;
  }
}
