import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';
import { CartService } from '../../services/cart.service'; 
import { ProductVariant } from '../../models/productvariant.model';
import { Options } from '../../models/options.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {

  private productId: number; 
  public selectedProductVariant: [ProductVariant | null , number | null ] = [null, null];  
  public defaultprice: number = 0;   

  public copyProduct: Product; 
    
  public optionsDict: {[key: string]: Options} = {};   
  
  
  @Input() public product!: Product;
  @Output() public onBuyProduct: EventEmitter<Product> = new EventEmitter<Product>();


  constructor(
    private activatedRoute: ActivatedRoute,
    private productsService: ProductsService, 
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.productId = params['id'];
    });

    this.productsService
    .getProductByIndex(this.productId)
    .subscribe((product: Product) => {
      this.product = product; 
      this.product.price = product.price;   
      if(this.defaultprice == 0 ){ 
        this.defaultprice = product.price; 
        console.log("dit is een update van de prijs" + this.defaultprice);
      } 
      this.copyProduct = structuredClone(product);

      console.log(product.price);
    });  
    
   

  }   



  public addToPrice(additional_cost: number, productVariant:ProductVariant, productOptions:Options){    
      console.log(productVariant); 
      console.log(productOptions);     
      console.log(this.defaultprice);  

      // const productOptionsList[] =  productOptions; 
      
      let options_cost = productOptions.added_price;    
      
      this.optionsDict[productVariant.name] = productOptions  
      console.log(this.optionsDict);

      let total_additionalcost = 0; 

    
      for( let optionKey in this.optionsDict){ 
        let optionPrice = this.optionsDict[optionKey].added_price;   
        console.log(optionPrice);
        total_additionalcost += optionPrice; 
      }   

      this.product.price = this.defaultprice + total_additionalcost;     

  } 

  public removeFromPrice(additional_cost: number){
    this.product.price -= additional_cost;  
  }


  public buyProduct(product: Product) {
    console.log(this.optionsDict);
    console.log(product.variants); 


    for( let variantName in this.optionsDict){ 
        for(const variant of this.copyProduct.variants) { 
            if(variant.name == variantName){  
                variant.options  = []; 
                variant.options.push(this.optionsDict[variantName]); 
           
             }
        }   

    }       
 
    console.log(product); 
    console.log(this.copyProduct);

    this.cartService.addProductToCart(this.copyProduct)  
    

  }


}
