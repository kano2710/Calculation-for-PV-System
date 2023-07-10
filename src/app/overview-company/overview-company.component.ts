import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-overview-company',
  templateUrl: './overview-company.component.html',
  styleUrls: ['./overview-company.component.css']
})

export class OverviewCompanyComponent implements OnInit {
  email: string = '';
  products: any[] = [];
  editingProductId: number | null = null;
  errorMessage: string = '';

  constructor(private http: HttpClient, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.email = localStorage.getItem('email') || '';
    this.http.get<any[]>(`http://localhost:3000/api/company-overview?company=${this.email}`).subscribe(
      (products: any[]) => {
        this.products = products;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  editProduct(id: number): void {
    this.editingProductId = id;
  }

  saveProduct(product: any): void {
    this.http.put(`http://localhost:3000/api/company-overview/${product.id}`, product).subscribe(
      () => {
        this.errorMessage = 'Product is Updated';
      this.dialog.open(ErrorDialogComponent, {
        data: this.errorMessage,
      });
        this.editingProductId = null;
        this.fetchProducts();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  deleteProduct(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Are you sure you want to delete this Product?',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
       
        this.http.delete(`http://localhost:3000/api/company-overview/${id}`).subscribe(() => {
      this.products = this.products.filter(product => product.id !== id);
    });
      }
    });
  }

  private fetchProducts(): void {
    this.http.get<any[]>(`http://localhost:3000/api/company-overview?company=${this.email}`).subscribe(
      (products: any[]) => {
        this.products = products;
      },
      (error) => {
        console.error(error);
      }
    );
  }
}