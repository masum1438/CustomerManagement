import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Book } from "./book.model";

@Injectable({ providedIn: 'root' }) 
export class BookService { 
    private apiUrl = 'https://localhost:7106/api/Book'; 
    constructor(private http: HttpClient) {}
     getBooks(): Observable<Book[]> { 
        return this.http.get<Book[]>(this.apiUrl);
     } 
     getBook(id: number): Observable<Book> { 
        return this.http.get<Book>(`${this.apiUrl}/${id}`); 
    } 
    addBook(book: Book): Observable<Book> {
         return this.http.post<Book>(this.apiUrl, book); 
        } 
        updateBook(id: number, book: Book): Observable<void> {
             return this.http.put<void>(`${this.apiUrl}/${id}`, book); 
            } 
            deleteBook(id: number): Observable<void> {
                 return this.http.delete<void>(`${this.apiUrl}/${id}`);
                 } 
 }