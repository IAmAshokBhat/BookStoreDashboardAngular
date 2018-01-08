import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { BookListComponent } from './book-list/book-list.component';
import { CategoriesComponent } from './categories/categories.component';
import { PublicationsComponent } from './publications/publications.component';
import { AuthorsComponent } from './authors/authors.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { AuthorService } from './services/author.service';
import { CategoriesService } from './services/categories.service';
import { PublicationService } from './services/publication.service';
import { BookService } from './services/book.service';
import { ErrorHandler } from '@angular/core';
import { AppErrorHandler } from './common/app-error-handler';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
  declarations: [
    AppComponent,
    BookListComponent,
    CategoriesComponent,
    PublicationsComponent,
    AuthorsComponent,
    NavbarComponent,
    FooterComponent,
    NotfoundComponent,
    BookDetailsComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFontAwesomeModule,
    NgbModule.forRoot(),
    RouterModule.forRoot([
      { path:'book/:id', component: BookDetailsComponent},
      { path:'categories', component: CategoriesComponent},
      { path:'publications', component: PublicationsComponent},
      { path:'authors', component: AuthorsComponent},
      { path:'', component: BookListComponent},
      { path:'**', component: NotfoundComponent},
    ])
  ],
  providers: [
    AuthorService,
    CategoriesService,
    PublicationService,
    BookService,
   { provide: ErrorHandler, useClass: AppErrorHandler}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
