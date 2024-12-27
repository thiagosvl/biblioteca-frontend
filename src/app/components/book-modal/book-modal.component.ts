import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { AuthorService } from '../../services/author.service';
import { BookService } from '../../services/book.service';
import { SnackbarService } from '../../services/snackbar.service';

import { finalize } from 'rxjs';
import { Author } from '../../models/Author';
import { BookType } from '../../models/BookType';
import { Collection } from '../../models/Collection';
import { Publisher } from '../../models/Publisher';
import { Subject } from '../../models/Subject';
import { BookTypeService } from '../../services/book-type.service';
import { CollectionService } from '../../services/collection.service';
import { PublisherService } from '../../services/publisher.service';
import { SubjectService } from '../../services/subject.service';
import countries from '../../shared/utils/countries.mock.json';
import { AuthorModalComponent } from '../author-modal/author-modal.component';
import { BookTypeModalComponent } from '../book-type-modal/book-type-modal.component';
import { CollectionModalComponent } from '../collection-modal/collection-modal.component';
import { PublisherModalComponent } from '../publisher-modal/publisher-modal.component';
import { SubjectModalComponent } from '../subject-modal/subject-modal.component';

@Component({
  selector: 'app-book-modal',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButton,
    MatIcon,
    MatProgressBarModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './book-modal.component.html',
  styleUrls: ['./book-modal.component.scss']
})
export class BookModalComponent {
  form: FormGroup;
  loading: boolean = false;
  loadingAuthors: boolean = false;
  loadingBookTypes: boolean = false;
  loadingPublishers: boolean = false;
  loadingCollections: boolean = false;
  loadingSubjects: boolean = false;
  isEditMode: boolean;
  countries: String[] = countries;
  authors: Author[] = [];
  bookTypes: BookType[] = [];
  publishers: Publisher[] = [];
  collections: Collection[] = [];
  subjects: Subject[] = [];

  constructor(
    private dialogRef: MatDialogRef<BookModalComponent>,
    private dialog: MatDialog,
    private authorService: AuthorService,
    private bookTypeService: BookTypeService,
    private publisherService: PublisherService,
    private collectionService: CollectionService,
    private subjectService: SubjectService,
    private service: BookService,
    private snackbarService: SnackbarService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = data.mode === 'edit';
    this.form = this.fb.group({
      title: [data.item ? data.item.title : '', Validators.required],
      classification: [data.item ? data.item.classification : '', Validators.required],
      shelf: [data.item ? data.item.shelf : '', Validators.required],
      country: [data.item ? data.item.country : '', Validators.required],
      city: [data.item ? data.item.city : '', Validators.required],
      edition: [data.item ? data.item.edition : '', Validators.required],
      quantity: [data.item ? data.item.quantity : '', Validators.required],
      language: [data.item ? data.item.language : '', Validators.required],
      page_count: [data.item ? data.item.page_count : '', Validators.required],
      year: [data.item ? data.item.year : '', [Validators.required, Validators.minLength(4)]],
      isbn: [data.item ? data.item.isbn : ''],
      entry_date: [data.item ? data.item.entry_date : ''],
      tomb_date: [data.item ? data.item.tomb_date : ''],
      observations: [data.item ? data.item.observations : ''],
      author_id: [data.item ? data.item.author_id : '', Validators.required],
      book_type_id: [data.item ? data.item.book_type_id : '', Validators.required],
      publisher_id: [data.item ? data.item.publisher_id : '', Validators.required],
      collection_id: [data.item ? data.item.collection_id : ''],
      subject_id: [data.item ? data.item.subject_id : '', Validators.required],
    });

    this.getAuthors();
    this.getBookTypes();
    this.getPublishers();
    this.getCollections();
    this.getSubjects();
  }

  getSubjects() {
    this.loadingSubjects = true;
    this.cdr.markForCheck();
    return this.subjectService.get().subscribe(
      (response: any) => {
        this.subjects = response.body;
      },
      (error: any) => {
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
      },
      () => {
        this.loadingSubjects = false;
        this.cdr.markForCheck();
      }
    );
  }

  getCollections() {
    this.loadingCollections = true;
    this.cdr.markForCheck();
    return this.collectionService.get().subscribe(
      (response: any) => {
        this.collections = response.body;
      },
      (error: any) => {
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
      },
      () => {
        this.loadingCollections = false;
        this.cdr.markForCheck();
      }
    );
  }

  getPublishers() {
    this.loadingPublishers = true;
    this.cdr.markForCheck();
    return this.publisherService.get().subscribe(
      (response: any) => {
        this.publishers = response.body;
      },
      (error: any) => {
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
      },
      () => {
        this.loadingPublishers = false;
        this.cdr.markForCheck();
      }
    );
  }

  getBookTypes() {
    this.loadingBookTypes = true;
    this.cdr.markForCheck();
    return this.bookTypeService.get().subscribe(
      (response: any) => {
        this.bookTypes = response.body;
      },
      (error: any) => {
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
      },
      () => {
        this.loadingBookTypes = false;
        this.cdr.markForCheck();
      }
    );
  }

  getAuthors() {
    this.loadingAuthors = true;
    this.cdr.markForCheck();
    return this.authorService.get().subscribe(
      (response: any) => {
        this.authors = response.body;
      },
      (error: any) => {
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
      },
      () => {
        this.loadingAuthors = false;
        this.cdr.markForCheck();
      }
    );
  }

  onAuthorChange(event: any): void {
    const selectedValue = event.value;

    if (selectedValue === 'create-new') {
      this.openAuthorCreateModal();
      this.form.get('author_id')?.setValue(null);
    }
  }

  onSubjectChange(event: any): void {
    const selectedValue = event.value;

    if (selectedValue === 'create-new') {
      this.openSubjectCreateModal();
      this.form.get('subject_id')?.setValue(null);
    }
  }

  onCollectionChange(event: any): void {
    const selectedValue = event.value;

    if (selectedValue === 'create-new') {
      this.openCollectionCreateModal();
      this.form.get('collection_id')?.setValue(null);
    }
  }

  onBookTypeChange(event: any): void {
    const selectedValue = event.value;

    if (selectedValue === 'create-new') {
      this.openBookTypeCreateModal();
      this.form.get('book_type_id')?.setValue(null);
    }
  }

  onPublisherChange(event: any): void {
    const selectedValue = event.value;

    if (selectedValue === 'create-new') {
      this.openPublisherCreateModal();
      this.form.get('publisher_id')?.setValue(null);
    }
  }

  openSubjectCreateModal() {
    const dialogRef = this.dialog.open(SubjectModalComponent, {
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadingSubjects = true;
        this.cdr.markForCheck();
        this.form.get(`subject_id`)?.disable();
        this.subjectService.add(result)
          .pipe(
            finalize(() => {
              this.loadingCollections = false;
              this.cdr.markForCheck();
              this.form.get(`subject_id`)?.enable();
            })
          )
          .subscribe((res: any) => {
            this.getSubjects();
            this.form.get('subject_id')?.setValue(res.body.id);
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

  openCollectionCreateModal() {
    const dialogRef = this.dialog.open(CollectionModalComponent, {
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadingCollections = true;
        this.cdr.markForCheck();
        this.form.get(`collection_id`)?.disable();
        this.collectionService.add(result)
          .pipe(
            finalize(() => {
              this.loadingCollections = false;
              this.cdr.markForCheck();
              this.form.get(`collection_id`)?.enable();
            })
          )
          .subscribe((res: any) => {
            this.getCollections();
            this.form.get('collection_id')?.setValue(res.body.id);
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

  openPublisherCreateModal() {
    const dialogRef = this.dialog.open(PublisherModalComponent, {
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadingPublishers = true;
        this.cdr.markForCheck();
        this.form.get(`publisher_id`)?.disable();
        this.publisherService.add(result)
          .pipe(
            finalize(() => {
              this.loadingPublishers = false;
              this.cdr.markForCheck();
              this.form.get(`publisher_id`)?.enable();
            })
          )
          .subscribe((res: any) => {
            this.getPublishers();
            this.form.get('publisher_id')?.setValue(res.body.id);
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

  openBookTypeCreateModal() {
    const dialogRef = this.dialog.open(BookTypeModalComponent, {
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadingBookTypes = true;
        this.cdr.markForCheck();
        this.form.get(`book_type_id`)?.disable();
        this.bookTypeService.add(result)
          .pipe(
            finalize(() => {
              this.loadingBookTypes = false;
              this.cdr.markForCheck();
              this.form.get(`book_type_id`)?.enable();
            })
          )
          .subscribe((res: any) => {
            this.getBookTypes();
            this.form.get('book_type_id')?.setValue(res.body.id);
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

  openAuthorCreateModal() {
    const dialogRef = this.dialog.open(AuthorModalComponent, {
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadingAuthors = true;
        this.cdr.markForCheck();
        this.form.get(`author_id`)?.disable();
        this.authorService.add(result)
          .pipe(
            finalize(() => {
              this.loadingAuthors = false;
              this.cdr.markForCheck();
              this.form.get(`author_id`)?.enable();
            })
          )
          .subscribe((res: any) => {
            this.getAuthors();
            this.form.get('author_id')?.setValue(res.body.id);
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

  onCancel(): void {
    this.dialogRef.close();
  }

  onSaveForm(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
    } else {
      this.loading = true;
      this.cdr.markForCheck();

      if (this.isEditMode) {
        this.updateBook();
      } else {
        this.createBook();
      }

    }
  }

  createBook(): void {
    this.service.add(this.form.value)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe((res) => {
        this.dialogRef.close(res);
        this.snackbarService.showMessage('Cadastro realizado com sucesso!', 'Fechar', 5000);
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
        } else {
          this.snackbarService.showMessage(`ERRO: ${error.message}`, 'Fechar', 5000);
        }
      })
  }

  updateBook(): void {
    this.service.update(this.data.item.id, this.form.value)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe((res) => {
        this.dialogRef.close(res);
        this.snackbarService.showMessage('Alterações realizadas com sucesso!', 'Fechar', 5000);
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
        } else {
          this.snackbarService.showMessage(`ERRO: ${error.message}`, 'Fechar', 5000);
        }
      })
  }
}