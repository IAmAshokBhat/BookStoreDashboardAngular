import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  collapse:boolean = true;
  constructor() { }
  
  ngOnInit() {
  }
  toggle(){
    this.collapse = !(this.collapse);  
  }

  
}
