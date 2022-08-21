import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product } from '../modal';

@Injectable({
  providedIn: 'root',
})
export class ProductApiService {
  constructor(private http: HttpClient) {}

  postProduct = (product: Product): Observable<Product> => {
    return this.http.post<Product>(
      'http://localhost:3000/productList',
      product
    );
  };

  getProducts = (): Observable<Product[]> => {
    return this.http.get<Product[]>('http://localhost:3000/productList');
  };

  updateProduct = (id: number, product: Product): Observable<Product> => {
    return this.http.put<Product>(
      `http://localhost:3000/productList/${id}`,
      product
    );
  };

  deleteProduct = (id: number): Observable<any> => {
    return this.http.delete<any>(`http://localhost:3000/productList/${id}`);
  };
}
