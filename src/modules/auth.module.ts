import { Module } from '@nestjs/common';
import { UserModule } from '../modules/user.module'
import { User } from '../entities/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../providers/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: '8bM@$D$NHp8ZS9BV*CXrt$heUtACoC7Y#7MGWC3oa*Kg5nB%r&cboxmv7XtEi^U@BD%8tt!#WsTqzL#T#w&I!V6q2I%gsFCR#InkpV2DS!cyoGfNjD*4QS9FDp499#@6',
      signOptions: {
        expiresIn: 3600,
      },
    },),
    TypeOrmModule.forFeature([User]),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule, AuthService],
})
export class AuthModule {}
