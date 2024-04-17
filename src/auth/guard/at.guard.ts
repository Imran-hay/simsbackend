import { AuthGuard } from '@nestjs/passport';

export class AtAuthGuad extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
