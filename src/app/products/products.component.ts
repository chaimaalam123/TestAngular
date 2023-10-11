import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../Model/product.model';
import { Router } from '@angular/router';
import { AppStateService } from '../services/app-state.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  constructor(private productService: ProductService, private router: Router, public appState: AppStateService) { }
  // public products: Array<Product> = this.appState.productState.products;
  // public keyword: string = this.appState.productState.keyword;
  // totalPages: number = this.appState.productState.totalPages;
  // pageSize: number = this.appState.productState.pageSize;
  // currentPage: number = this.appState.productState.currentPage;

  ngOnInit() {
    this.getProducts();
  }

  handleGotoPage(page: number) {
    this.appState.productState.currentPage = page;
    this.getProducts();
  }
  getProducts() {
    this.productService.getProducts(this.appState.productState.keyword, this.appState.productState.currentPage, this.appState.productState.pageSize).subscribe(
      {
        next: (response) => {
          this.appState.productState.products = response.body as Product[];
          let totalProducts: number = parseInt(response.headers.get('x-total-count')!);
          this.appState.productState.totalProducts = totalProducts;
          this.appState.productState.totalPages = Math.floor(totalProducts / this.appState.productState.pageSize);
          if (totalProducts % this.appState.productState.pageSize != 0) {
            this.appState.productState.totalPages += 1;
          }
        },
        error: err => { console.log(err) }
      },
    );
  }

  handleCheckProduct(product: Product) {
    this.productService.checkProduct(product).subscribe(
      {
        next: updatedProduct => { product.checked = !product.checked; }
        //this.getProducts()
        ,
        error: err => { console.log(err) }
      }
    )
  }
  handleDelete(product: Product) {
    this.productService.deleteProduct(product).subscribe(
      {
        next: data => {
          //this.appState.productState.products = this.appState.productState.products.filter((p: { id: number; }) => p.id != product.id);
          this.getProducts()
        },
        error: err => { console.log(err) }
      }
    )
  }
  // searchProducts() {
  //   this.currentPage = 1;
  //   this.totalPages = 0;
  //   this.productService.searchProducts(this.keyword, this.currentPage, this.pageSize).subscribe(
  //     {
  //       next: data => { this.products = data; },
  //       error: err => { console.log(err); }
  //     },
  //   );
  // }
  handleEdit(product: Product) {
    this.router.navigateByUrl(`/editProduct/${product.id}`)
  }

}
