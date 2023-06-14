import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
  ) {}

  async create(productData: CreateProductDto) {
    const product = await this.productsRepository.create(productData);
    return await this.productsRepository.save(product);
  }

  async findAll() {
    return await this.productsRepository.find({
      select: ['id', 'name', 'description', 'category', 'donation', 'zipCode'],
    });
  }

  async findOne(id: string) {
    try {
      return await this.productsRepository.findOneOrFail({ where: { id: id } });
    } catch (error) {
      return new NotFoundException(error.message);
    }
  }

  async findByCreator(id: string) {
    return await this.productsRepository.find({ where: { creatorId: id } });
  }

  async update(id: string, newProductData: UpdateProductDto) {
    const product = await this.productsRepository.findOne({
      where: { id: id },
    });
    this.productsRepository.merge(product, newProductData);
    return await this.productsRepository.save(product);
  }

  async remove(id: string) {
    await this.productsRepository.findOne({ where: { id: id } });
    this.productsRepository.softDelete(id);
  }
}
