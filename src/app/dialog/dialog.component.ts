import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../modal';

import { ProductApiService } from '../services/product-api.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  freshness = ['brand new', 'second hand', 'refurbished'];

  productForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private prdApiService: ProductApiService,
    @Inject(MAT_DIALOG_DATA) public editProduct: Product,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      freshness: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required],
    });

    if (this.editProduct) {
      Object.keys(this.editProduct).forEach((key) => {
        if (key === 'id') return;
        this.productForm.controls[key].setValue(
          this.editProduct[key as keyof Product]
        );
      });
    }
  }

  submitForm = () => {
    if (this.editProduct) {
      this.updateProduct();
    } else {
      this.addProduct();
    }
  };

  addProduct = () => {
    if (this.productForm.valid) {
      this.prdApiService.postProduct(this.productForm.value).subscribe({
        next: (res) => {
          console.log(res);
          alert('product added');
          this.productForm.reset;
          this.dialogRef.close('save');
        },
        error: (err) => console.log(err),
      });
    } else {
      throw new Error('please fill the fields');
    }
  };

  updateProduct = () => {
    if (this.productForm.valid) {
      this.prdApiService
        .updateProduct(this.editProduct.id, this.productForm.value)
        .subscribe({
          next: (res) => {
            alert('product updated');
            this.productForm.reset;
            this.dialogRef.close('update');
          },
          error: (err) => console.log(err),
        });
    }
  };
}
