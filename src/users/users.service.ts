import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(platform: string, userInfo) {
    let id: string;
    if (platform === 'naver') id = userInfo.response.id;
    else id = userInfo.id;

    const checkUser = await this.usersRepository.findOne({
      where: { socialId: id },
    });

    if (!checkUser) {
      const user = this.usersRepository.create({
        social: platform,
        socialId: id,
      });
      return await this.usersRepository.save(user);
    } else console.log('이미 존재하는 사용자입니다.');
  }

  async findUser(id: string) {
    return await this.usersRepository.findOne({ where: { socialId: id } });
  }
}
