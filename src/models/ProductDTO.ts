import { Required, MaxLength, Min, CollectionOf } from '@tsed/schema';
import { ArrayMinSize } from 'class-validator';

export class ProductDTO {
    @MaxLength(150)
    @Required()
    name: string;

    @MaxLength(1000)
    @Required()
    description: string;

    @Min(0)
    @Required()
    price: number;

    @ArrayMinSize(1)
    @CollectionOf(Number)
    @Required()
    categoryIds: number[];

    @Min(0)
    stock: number = 0;

    @Min(0)
    discount: number = 0;

    @Min(0)
    weight: number = 0;

    @Min(0)
    shippingCost: number = 0;

    isFeatured: boolean = false;
}
