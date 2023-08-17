import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { ProductsService } from '../products/products.service';
import { hashSync } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => ProductsService))
    private readonly productService: ProductsService,
  ) {}

  async uploadPicture(
    profilePicture: Express.Multer.File,
    userNickname: string,
  ) {
    const storage = getStorage();
    const extensionPattern = /\.[0-9a-z]+$/i;
    const picture_name = `pfp-${userNickname}${
      profilePicture.originalname.match(extensionPattern)[0]
    }`;
    const storageRef = ref(storage, picture_name);

    const metadata = {
      contentType: profilePicture.mimetype,
    };

    await uploadBytes(storageRef, profilePicture.buffer, metadata);

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

  async create(userData: CreateUserDto, profilePicture: Express.Multer.File) {
    let user = await this.usersRepository.create(userData);

    user = await this.usersRepository.save(user);

    if (profilePicture != undefined) {
      user.pictureUrl = await this.uploadPicture(profilePicture, user.id);
      return await this.usersRepository.save(user);
    } else {
      return user;
    }
  }

  async findAll() {
    return await this.usersRepository.find({
      select: ['id', 'name', 'nickname', 'cpf', 'phone', 'email'],
    });
  }

  async findOne(id: string) {
    try {
      return await this.usersRepository.findOneOrFail({ where: { id: id } });
    } catch (error) {
      throw new NotFoundException("There's no user with this id");
    }
  }

  async getRanking() {
    const result = await this.usersRepository.find({
      select: { name: true, score: true },
      order: { score: 'DESC', createdAt: 'ASC' },
    });

    return result.slice(0, 10);
  }

  async findOneByEmail(email: string) {
    return await this.usersRepository.findOneOrFail({
      where: { email: email },
    });
  }

  async update(id: string, newUserData: UpdateUserDto) {
    if (newUserData.password !== undefined) {
      newUserData.password = hashSync(newUserData.password, 10);
    }

    const user = await this.usersRepository.findOneOrFail({
      where: { id: id },
    });
    this.usersRepository.merge(user, newUserData);
    return await this.usersRepository.save(user);
  }

  async updateScore(id: string, score: number) {
    const user = await this.findOne(id);
    user.score = score;
    return await this.usersRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.usersRepository.findOne({ where: { id: id } });

    const user_products = await this.productService.findByCreator(id);

    user_products.forEach((product) => {
      this.productService.remove(product.id, false);
    });

    this.deletePicture(user.pictureUrl);
    this.usersRepository.softDelete(id);
  }
}
