import { Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { platform } from 'os';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly usersService: UsersService,
  ) {}

  getSocialSignInCode(platform: string) {
    const baseUrl = this.getSocialBaseUrl(platform);
    const params = this.getSocialParams(platform);

    return `${baseUrl}?${new URLSearchParams(params)}`;
  }

  private getSocialBaseUrl(platform: string) {
    const baseUrls = {
      naver: 'https://nid.naver.com/oauth2.0/authorize',
      google: 'https://accounts.google.com/o/oauth2/v2/auth',
      kakao: 'https://kauth.kakao.com/oauth/authorize',
    };

    return baseUrls[platform];
  }

  private getSocialParams(platform: string) {
    const queryParams = {
      naver: {
        response_type: 'code',
        client_id: process.env.N_CLIENT_ID,
        redirect_uri: process.env.N_REDIRECT_URI,
        state: process.env.N_STATE,
      },
      google: {
        response_type: 'code',
        client_id: process.env.G_CLIENT_ID,
        redirect_uri: process.env.G_REDIRECT_URI,
        scope: `https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email`,
        access_type: 'offline',
      },
      kakao: {
        response_type: 'code',
        client_id: process.env.K_REST_API_KEY,
        redirect_uri: process.env.K_REDIRECT_URI,
      },
    };

    return queryParams[platform];
  }
}
