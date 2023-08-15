import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async uploadPicture(productPicture: Express.Multer.File, productId: string) {
    const storage = getStorage();
    const extensionPattern = /\.[0-9a-z]+$/i;
    const picture_name = `${productId}${
      productPicture.originalname.match(extensionPattern)[0]
    }`;
    const storageRef = ref(storage, picture_name);

    const metadata = {
      contentType: productPicture.mimetype,
    };

    await uploadBytes(storageRef, productPicture.buffer, metadata);

    return getDownloadURL(storageRef);
  }

  async deletePicture(pictureUrl: string) {
    console.log(pictureUrl);
    if (pictureUrl === '' || pictureUrl === null || pictureUrl === undefined) {
      return;
    }
    const storage = getStorage();
    const storageRef = ref(storage, pictureUrl);

    deleteObject(storageRef).catch((error) => {
      console.log(error);
    });
  }

  async create(
    productData: CreateProductDto,
    productImage: Express.Multer.File,
  ) {
    await this.usersService.findOne(productData.owner);

    let product = await this.productsRepository.create(productData);
    product = await this.productsRepository.save(product);

    if (productImage != undefined) {
      product.pictureUrl = await this.uploadPicture(productImage, product.id);
      return await await this.productsRepository.save(product);
    } else {
      return product;
    }
  }

  async findAll() {
    return await this.productsRepository.find({
      select: [
        'id',
        'name',
        'description',
        'category',
        'donation',
        'owner',
        'traded',
        'pictureUrl',
      ],
    });
  }

  async findOne(id: string) {
    try {
      const product = await this.productsRepository.findOneOrFail({
        where: { id: id },
      });

      const owner = await this.usersService.findOne(product.owner);

      const ownerEmail = owner.email;
      let ownerPhone = null;
      if (owner.sharePhone) {
        ownerPhone = owner.phone;
      }
      return {
        id: product.id,
        owner: product.owner,
        name: product.name,
        description: product.description,
        category: product.category,
        pictureUrl: product.pictureUrl,
        donation: product.donation,
        phone: ownerPhone,
        email: ownerEmail,
      };
    } catch (error) {
      throw new NotFoundException("There's no product with this id");
    }
  }

  async findByCreator(id: string) {
    return await this.productsRepository.find({
      where: { owner: id },
    });
  }

  async update(id: string, newProductData: UpdateProductDto) {
    const product = await this.productsRepository.findOne({
      where: { id: id },
    });
    this.productsRepository.merge(product, newProductData);
    return await this.productsRepository.save(product);
  }

  async remove(id: string, traded: boolean) {
    const product = await this.productsRepository.findOne({
      where: { id: id },
    });

    if (traded) {
      const owner = await this.usersService.findOne(product.owner);

      if (product.donation) {
        this.usersService.updateScore(owner.id, owner.score + 10);
      } else {
        this.usersService.updateScore(owner.id, owner.score + 5);
      }
      product.traded = true;
      this.productsRepository.save(product);
    }

    this.deletePicture(product.pictureUrl);
    this.productsRepository.softDelete(id);
  }
}
