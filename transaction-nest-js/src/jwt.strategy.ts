// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
//   constructor() {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: process.env.JWT_SECRET || 'super_secret_shared_key',
//       ignoreExpiration: false,
//     });
//   }

//   validate(payload: { sub: string; [key: string]: any }) {
//     // Return only what is needed in req.user
//     return {
//       userId: payload.sub,
//       ...payload, // optional, but be careful
//     };
//   }
// }
