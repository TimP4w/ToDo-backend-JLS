import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../../strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../user/user.schema';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: '8bM@$D$NHp8ZS9BV*CXrt$heUtACoC7Y#7MGWC3oa*Kg5nB%r&cboxmv7XtEi^U@BD%8tt!#WsTqzL#T#w&I!V6q2I%gsFCR#InkpV2DS!cyoGfNjD*4QS9FDp499#@6',
      signOptions: {
        expiresIn: 3600,
      },
    },),
    //TypeOrmModule.forFeature([User]),
    UserModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])

  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule, AuthService],
})
export class AuthModule {}
