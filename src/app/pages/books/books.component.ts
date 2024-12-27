import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { merge, of as observableOf, Subject } from 'rxjs';
import { catchError, debounceTime, map, startWith, switchMap } from 'rxjs/operators';
import { BookModalComponent } from '../../components/book-modal/book-modal.component';
import { DeleteModalComponent } from '../../components/delete-modal/delete-modal.component';
import { Book } from '../../models/Book';
import { BookService } from '../../services/book.service';
import { SnackbarService } from '../../services/snackbar.service';

const bookExample: Book = { title: 'title test', classification: 'classtest', shelf: 'shelfTest', country: 'Brasil', city: 'cityTest', edition: 'editionTest', quantity: 50, language: 'languageTest', page_count: 237, year: 2025, isbn: '978-0-306-40615-7', entry_date: new Date(), tomb_date: new Date(), observations: 'test example observation', author_id: 1, subject_id: 1, publisher_id: 1, collection_id: 1, book_type_id: 1 };

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
  standalone: true,
  imports: [MatProgressSpinnerModule, MatLabel, MatIcon, MatFormFieldModule, MatInputModule, MatButton, MatTableModule, MatSortModule, MatPaginatorModule, MatProgressBarModule, DatePipe, FormsModule],
})

export class BooksComponent implements AfterViewInit {
  private searchSubject = new Subject<string>();
  private readonly debounceTimeMs = 500;

  displayedColumns: string[] = ['title', 'created_at', 'updated_at', 'actions'];
  data: Book[] = [];

  resultsLength = 0;
  pageSize = 20;
  pageSizeOptions = [10, 25, 50, 100];
  loading = true;
  search: string = '';

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private service: BookService,
    private cdr: ChangeDetectorRef,
    private snackbarService: SnackbarService
  ) {
    this.searchSubject.pipe(
      debounceTime(this.debounceTimeMs),
      switchMap((searchValue) => {
        this.loading = true;
        this.cdr.markForCheck();
        return this.service.get(
          this.sort.active,
          this.sort.direction,
          this.paginator.pageIndex,
          this.paginator.pageSize,
          searchValue
        ).pipe(catchError(() => observableOf(null)));
      })
    ).subscribe((response: any) => {
      this.loading = false;

      if (response === null) {
        this.data = [];
        return;
      }

      this.resultsLength = response.body.total;
      this.data = response.body.data;
      this.cdr.markForCheck();
    });

  }

  ngAfterViewInit() {
    this.sort.active = 'created_at';
    this.sort.direction = 'desc';
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    this.getData();
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  onSearchClear() {
    this.search = "";
    this.paginator.pageIndex = 0;
    this.getData();
  }

  onSearchChange() {
    this.paginator.pageIndex = 0;
    this.searchSubject.next(this.search);
  }

  getData() {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;
          this.cdr.markForCheck();
          return this.service.get(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.search
          ).pipe(catchError(() => observableOf(null)));
        }),
        map((response: any) => {
          this.loading = false;
          if (response === null) {
            return [];
          }

          this.resultsLength = response.body.total;
          return response.body.data;
        })
      )
      .subscribe((data) => {
        this.data = data;
        this.cdr.markForCheck();
      });
  }

  openDeleteModal(item: Book) {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      data: { item },
    });

    dialogRef.afterClosed().subscribe((id) => {
      if (id) {
        this.loading = true;
        this.cdr.markForCheck();
        this.service.delete(id).subscribe(() => {

          this.snackbarService.showMessage('Registro removido com sucesso!', 'Fechar', 5000);
          this.getData();
        });
      }
    });
  }

  openCreateModal() {
    const dialogRef = this.dialog.open(BookModalComponent, {
      data: { mode: 'create', item: [] },
      height: "calc(100% - 15px)",
      width: "calc(100% - 15px)",
      maxWidth: "100%",
      maxHeight: "100%"
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('result', result);
        this.getData();
      }
    });
  }

  openEditModal(item: Book) {
    this.dialog.open(BookModalComponent, {
      data: { mode: 'edit', item },
      height: "calc(100% - 15px)",
      width: "calc(100% - 15px)",
      maxWidth: "100%",
      maxHeight: "100%"
    });
  }
}
