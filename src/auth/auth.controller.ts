import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    console.log(code);
  }
}
