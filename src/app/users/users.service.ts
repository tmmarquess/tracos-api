import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(userData: CreateUserDto) {
    const user = await this.usersRepository.create(userData);
    return await this.usersRepository.save(user);
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
      return new NotFoundException(error.message);
    }
  }

  async getProducts(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: { products: true },
    });

    return user.products;
  }

  async findOneByEmail(email: string) {
    return await this.usersRepository.findOneOrFail({
      where: { email: email },
    });
  }

  async update(id: string, newUserData: UpdateUserDto) {
    const user = await this.usersRepository.findOneOrFail({
      where: { id: id },
    });
    this.usersRepository.merge(user, newUserData);
    return await this.usersRepository.save(user);
  }

  async remove(id: string) {
    await this.usersRepository.findOne({ where: { id: id } });
    this.usersRepository.softDelete(id);
  }
}
