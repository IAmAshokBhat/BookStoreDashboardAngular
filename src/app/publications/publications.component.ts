import { NgForm } from '@angular/forms/src/directives/ng_form';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BadInput } from './../common/bad-input';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PublicationService } from '../services/publication.service';
import { AppError } from '../common/app.error';
import { NotFoundError } from '../common/not-found-error';

@Component({
  selector: 'publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.css']
})
export class PublicationsComponent implements OnInit {
  publications;
  publication;
  form;
  modelRef;
  closeResult: string;
  loader;
  @ViewChild('content') private content;
  constructor(
    private service: PublicationService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.initialiseForm();
    this.fetchPublishers();

  }

  initialiseForm(){
      this.publication = {"publication_id":"-1","publication_name":""};
      this.form = new FormGroup({
        "publication_id":new FormControl(this.publication.publication_id),
        "publication_name":new FormControl(this.publication.publication_name,Validators.required)
      });    
  }
  get publication_name(){
    return this.form.get('publication_name');
  }
  fetchPublishers(){
    this.loader = true;
    this.service.get()
    .subscribe(publications => {this.publications = publications;this.loader = false;},
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
  addPublication(){
    if(this.form.valid){
      if(this.form.value.publication_id == "-1"){
        this.loader = true;
        this.service.create("http://bookstore-trial.herokuapp.com/api/publication",this.form.value)
        .subscribe(()=>{
          this.fetchPublishers();
          this.modelRef.close()
        })
      }else{
        this.loader = true;
        this.service.update("http://bookstore-trial.herokuapp.com/api/publication",this.form.value)
        .subscribe(()=>{
          this.fetchPublishers();
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
    this.publication = {"publication_id":"-1","publication_name":""};
    (this.form as NgForm).setValue(this.publication);
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }


  editPublicationPopUp(publication){
    this.publication = publication;
    (this.form as NgForm).setValue(publication);
    this.open(this.content);
  }

  delete(event: Event,id){
    this.loader = true;
    event.stopImmediatePropagation();

    this.service.delete("http://bookstore-trial.herokuapp.com/api/publication?publication_id="+id)
        .subscribe(()=>{
          this.fetchPublishers();
          this.modelRef.close()
        })
  }
}
