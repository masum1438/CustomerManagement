import { Component, OnInit } from '@angular/core';
import { Book } from '../book.model';
import { BookService } from '../book.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-book-list',
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css'
})
export class BookList implements OnInit {
    books: Book[] = [];

  constructor(
    private bookService: BookService,
    private router: Router,
    private documentService: DocumentService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe(data => (this.books = data));
  }

  deleteBook(id: number): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(id).subscribe(() => this.loadBooks());
    }
  }

  // Download single or multiple books as PDF

singlePDFDownload(book?: Book) {
  if (book) {
    const filename = `${book.bookName}`;
    this.documentService.singlePDFDownload(book, filename); // pass single book
  } else {
    const filename = 'Books';
    this.documentService.downloadPDF(this.books, filename); // use multi-PDF method
  }
}

downloadXLS(book?: Book) {
  const items = book ? [book] : this.books;
  const filename = book ? `${book.bookName}` : 'Books';
  this.documentService.downloadXLS(items, filename);
}

downloadPDF(book?: Book) {
  const items = book ? [book] : this.books;
  const filename = book ? `${book.bookName}.` : 'Books';
  this.documentService.downloadPDF(items, filename);
}
}
