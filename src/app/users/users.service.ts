import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
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
