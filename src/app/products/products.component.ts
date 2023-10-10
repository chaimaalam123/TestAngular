
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../Model/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  constructor(private productService: ProductService , private router:Router) { }
  public products: Array<Product> = [];
  public keyword: string = "";
  totalPages: number = 0;
  pageSize: number = 3;
  currentPage: number = 1;

  ngOnInit() {
    this.getProducts();
  }

  handleGotoPage(page: number) {
    this.currentPage = page;
    this.getProducts();
  }
  getProducts() {
    this.productService.getProducts(this.keyword,this.currentPage, this.pageSize).subscribe(
      {
        next: (response) => {
          this.products = response.body as Product[];
          let totalProducts: number = parseInt(response.headers.get('x-total-count')!);
          this.totalPages = Math.floor(totalProducts / this.pageSize);
          if (totalProducts % this.pageSize != 0) {
            this.totalPages += 1;
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
          this.products = this.products.filter(p => p.id != product.id);
          //this.getProducts() 
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
  handleEdit(product:Product){
   this.router.navigateByUrl(`/editProduct/${product.id}`)
  }

}
