import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
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
        scope: `https://www.googleapis.com/auth/userinfo.email`,
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

  async getSocialAccessToken(platform: string, code: string) {
    const url = this.getSocialTokenUrl(platform);
    const params = this.getSocialTokenParams(platform, code);
    const header = this.getSocialTokenHeader(platform);

    const response = await axios.post(url, params, { headers: header });

    return response.data.access_token;
  }

  private getSocialTokenUrl(platform: string) {
    const url = {
      naver: `https://nid.naver.com/oauth2.0/token`,
      google: `https://oauth2.googleapis.com/token`,
      kakao: `https://kauth.kakao.com/oauth/token`,
    };

    return url[platform];
  }

  private getSocialTokenParams(platform: string, code: string) {
    const params = {
      naver: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.N_CLIENT_ID,
        client_secret: process.env.N_SECRET_KEY,
        redirect_uri: process.env.N_REDIRECT_URI,
        state: process.env.N_STATE,
        code,
      }),
      google: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.G_CLIENT_ID,
        client_secret: process.env.G_SECRET_KEY,
        redirect_uri: process.env.G_REDIRECT_URI,
        code,
      }),
      kakao: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.K_REST_API_KEY,
        redirect_uri: process.env.K_REDIRECT_URI,
        code,
      }),
    };

    return params[platform];
  }

  private getSocialTokenHeader(platform: string) {
    const header = {
      naver: {
        'X-Naver-Client-Id': process.env.N_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.N_CLIENT_SECRET,
      },
      google: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      kakao: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    };

    return header[platform];
  }

  async getSocialUserInfo(platform: string, accessToken: string) {
    const url = {
      naver: `https://openapi.naver.com/v1/nid/me`,
      google: `https://www.googleapis.com/oauth2/v2/userinfo`,
      kakao: `https://kapi.kakao.com/v2/user/me`,
    };

    return await axios.get(url[platform], {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
}
