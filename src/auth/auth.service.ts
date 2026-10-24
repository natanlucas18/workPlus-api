import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from './hashing/hashing.service';
import jwtConfig from './config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import { ResponseLoginDto } from './dtos/response-login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfigurations: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<ResponseLoginDto> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado!');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuário inativo!');
    }

    if (!user.company.isActive) {
      throw new UnauthorizedException('Empresa suspensa!');
    }

    const passwordIsValid = await this.hashingService.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Senha incorreta!');
    }

    return this.issueTokens(user);
  }

  async refreshTokens(refreshToken: string): Promise<ResponseLoginDto> {
    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string }>(
        refreshToken,
        {
          secret: this.jwtConfigurations.secret,
          audience: this.jwtConfigurations.audience,
          issuer: this.jwtConfigurations.issuer,
        },
      );

      if (!payload) {
        throw new UnauthorizedException('Refresh token Inválido!');
      }

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Usuário não autorizado!');
      }

      return this.issueTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido ou expirado.');
    }
  }

  private async issueTokens(user: User): Promise<ResponseLoginDto> {
    const accessTokenPromise = this.jwtService.signAsync(
      {
        sub: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      {
        audience: this.jwtConfigurations.audience,
        issuer: this.jwtConfigurations.issuer,
        secret: this.jwtConfigurations.secret,
        expiresIn: this.jwtConfigurations.expiresIn,
      },
    );

    const refreshTokenPromise = this.jwtService.signAsync(
      {
        sub: user.id,
      },
      {
        audience: this.jwtConfigurations.audience,
        issuer: this.jwtConfigurations.issuer,
        secret: this.jwtConfigurations.secret,
        expiresIn: this.jwtConfigurations.jwtRefreshTtl,
      },
    );

    const [accessToken, refreshToken] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise,
    ]);

    return {
      auth: {
        accessToken,
        refreshToken,
        expiresIn: this.jwtConfigurations.expiresIn,
      },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
