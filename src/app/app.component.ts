import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { ProductApiService } from './services/product-api.service';

import { DialogComponent } from './dialog/dialog.component';
import { Product } from './modal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  products!: Product[];
  dataSource!: MatTableDataSource<Product>;
  displayedColumns: (keyof Product | string)[] = [
    'productName',
    'category',
    'date',
    'freshness',
    'price',
    'comment',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private prdServiceApi: ProductApiService
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  ngAfterViewInit(): void {}

  openDialog = () => {
    this.dialog
      .open(DialogComponent, {
        width: '30%',
        disableClose: true,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getProducts();
        }
      });
  };

  getProducts(): void {
    this.prdServiceApi.getProducts().subscribe((products) => {
      this.products = products;
      this.dataSource = new MatTableDataSource(products);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  editProduct(data: Product) {
    this.dialog
      .open(DialogComponent, {
        width: '30%',
        disableClose: true,
        data: data,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getProducts();
        }
      });
  }

  deleteProduct(id: number) {
    this.prdServiceApi.deleteProduct(id).subscribe(() => {
      alert('product deleted successfully');
      this.getProducts();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
