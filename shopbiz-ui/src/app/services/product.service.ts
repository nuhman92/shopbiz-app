import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Product } from '../models/product';
import { MessageService } from './message.service';
import { baseURL } from 'src/environments/environment';

export interface PageableProducts {
  content: Product[];
  pageable: {
    pageNumber: number,
    pageSize: number,
    offset: number,
    sort: any
  };
  totalPages: number;
  size: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService implements Resolve<Product> {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Product> | Promise<Product> | Product {
    this.log('From ProductService resolve');
    return this.getProduct(+route.params['id']);
  }

  /** GET products from the server */
  getProducts(
    pageNum: number = 0,
    categoryId: number = 0
  ): Observable<PageableProducts> {
    let productsUrl = `${baseURL}products?page=${pageNum}`;
    if (categoryId !== 0) {
      productsUrl = productsUrl.concat(`&categoryId=${categoryId}`);
    }
    return this.http.get<PageableProducts>(productsUrl).pipe(
      tap((res) => {
        this.log('fetched products**' + res.content.length);
      }),
      catchError(this.handleError)
    );
  }

  getProduct(id: number): Observable<Product> {
    const url = `${baseURL}products/${id}`;
    return this.http.get<Product>(url).pipe(
      tap((_) => this.log(`fetched product id=${id}`)),
      catchError(this.handleError<Product>(`getProduct id=${id}`))
    );
  }

  deleteProduct(id: number): Observable<Product> {
    const url = `${baseURL}products/${id}`;
    return this.http.delete<Product>(url, this.httpOptions).pipe(
      tap((_) => this.log(`deleted product id=$id`)),
      catchError(this.handleError<Product>('deleteProduct'))
    );
  }

  /** PUT: update the product on the server */
  // 'Content-Type': 'multipart/form-data'
  updateProduct(data, product: Product): Observable<Product> {
    const url = `${baseURL}products/${product.id}`;
    console.log('url ' + url);
    const httpOptions = {
      headers: new HttpHeaders({}),
    };
    return this.http.put<Product>(url, data, httpOptions).pipe(
      tap((_) => this.log(`updated product id=${product.id}`)),
      catchError(this.handleError<any>('updateProduct'))
    );
  }

  /** POST: add a new hero to the server */
  addProduct(data): Observable<Product> {
    const url = `${baseURL}products`;
    const httpOptions = {
      headers: new HttpHeaders({}),
    };
    return this.http.post<Product>(url, data, httpOptions).pipe(
      tap((newProduct: Product) =>
        this.log(`added product w/ id=${newProduct.id}`)
      ),
      catchError(this.handleError<Product>('addProduct'))
    );
  }

  searchProductsPaginate(
    thePage: number,
    thePageSize: number,
    theKeyword: string
  ): Observable<PageableProducts> {
    const searchUrl =
      `${baseURL}search/findByNameContaining?name=${theKeyword}` +
      `&page=${thePage}&size=${thePageSize}`;
    return this.http
      .get<PageableProducts>(searchUrl)
      .pipe(
        catchError(this.handleError<PageableProducts>('searchProductsPaginate'))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private handleError2(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }

  private log(message: string) {
    this.messageService.add(`ProductService: ${message}`);
  }
}
