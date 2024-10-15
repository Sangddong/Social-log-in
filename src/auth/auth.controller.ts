import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get(':platform')
  getSocialCode(
    @Param('platform') platform: string,
    @Res() response: Response,
  ) {
    const url = this.authService.getSocialSignInCode(platform);

    response.redirect(url);
  }

  @Get(':platform/callback')
  async socialCallback(
    @Param('platform') platform: string,
    @Query('code') code: string,
    @Res() response: Response,
  ) {
    const access_token = await this.authService.getSocialAccessToken(
      platform,
      code,
    );

    const userInfo = await this.authService.getSocialUserInfo(
      platform,
      access_token,
    );

    return access_token;
  }
}
