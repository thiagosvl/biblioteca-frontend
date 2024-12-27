import { Routes } from '@angular/router';
import { AuthorsComponent } from './pages/authors/authors.component';
import { BookTypesComponent } from './pages/book-types/book-types.component';
import { BooksComponent } from './pages/books/books.component';
import { CollectionsComponent } from './pages/collections/collections.component';
import { HomeComponent } from './pages/home/home.component';
import { PublishersComponent } from './pages/publishers/publishers.component';
import { SubjectsComponent } from './pages/subjects/subjects.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'authors', component: AuthorsComponent },
  { path: 'books', component: BooksComponent },
  { path: 'collections', component: CollectionsComponent },
  { path: 'publishers', component: PublishersComponent },
  { path: 'subjects', component: SubjectsComponent },
  { path: 'book-types', component: BookTypesComponent },
];
