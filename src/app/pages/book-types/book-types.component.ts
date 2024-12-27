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
import { catchError, debounceTime, finalize, map, startWith, switchMap } from 'rxjs/operators';
import { BookTypeModalComponent } from '../../components/book-type-modal/book-type-modal.component';
import { DeleteModalComponent } from '../../components/delete-modal/delete-modal.component';
import { BookType } from '../../models/BookType';
import { BookTypeService } from '../../services/book-type.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-book-types',
  templateUrl: './book-types.component.html',
  styleUrls: ['./book-types.component.scss'],
  standalone: true,
  imports: [MatProgressSpinnerModule, MatLabel, MatIcon, MatFormFieldModule, MatInputModule, MatButton, MatTableModule, MatSortModule, MatPaginatorModule, MatProgressBarModule, DatePipe, FormsModule],
})
export class BookTypesComponent implements AfterViewInit {
  private searchSubject = new Subject<string>();
  private readonly debounceTimeMs = 500;

  displayedColumns: string[] = ['name', 'created_at', 'updated_at', 'actions'];
  data: BookType[] = [];

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
    private service: BookTypeService,
    private cdr: ChangeDetectorRef,
    private snackbarService: SnackbarService
  ) {
    this.searchSubject.pipe(
      debounceTime(this.debounceTimeMs),
      switchMap((searchValue) => {
        this.loading = true;
        this.cdr.markForCheck();
        return this.service.getPaginated(
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
          return this.service.getPaginated(
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

  openDeleteModal(item: BookType) {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      data: { item },
    });

    dialogRef.afterClosed().subscribe((id) => {
      if (id) {
        this.loading = true;
        this.cdr.markForCheck();
        this.service.delete(id).subscribe(() => {
          this.getData();
        });
      }
    });
  }

  openCreateModal() {
    const dialogRef = this.dialog.open(BookTypeModalComponent, {
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = true;
        this.cdr.markForCheck();
        this.service.add(result)
          .pipe(
            finalize(() => {
              this.loading = false;
              this.cdr.markForCheck();
            })
          )
          .subscribe(() => {
            this.getData();
          }, (error: any) => {
            if (error && error.error && error.error.errors) {
              const errors = error.error.errors;
              Object.keys(errors).forEach((key) => {
                const messages = errors[key];
                if (Array.isArray(messages)) {
                  messages.forEach((message) => {
                    this.snackbarService.showMessage(`ERRO: ${message}`, 'Fechar', 5000);
                  });
                }
              });
            }
          })
      }
    });
  }

  openEditModal(item: BookType) {
    const dialogRef = this.dialog.open(BookTypeModalComponent, {
      data: { mode: 'edit', item }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = true;
        this.cdr.markForCheck();
        this.service.update(item.id, result)
          .pipe(
            finalize(() => {
              this.loading = false;
              this.cdr.markForCheck();
            })
          )
          .subscribe(() => {
            this.getData();
          }, (error: any) => {
            if (error && error.error && error.error.errors) {
              const errors = error.error.errors;
              Object.keys(errors).forEach((key) => {
                const messages = errors[key];
                if (Array.isArray(messages)) {
                  messages.forEach((message) => {
                    this.snackbarService.showMessage(`ERRO: ${message}`, 'Fechar', 5000);
                  });
                }
              });
            }
          })
      }
    });
  }
}
