import { AuthGuard } from '@nestjs/passport';

export class Local_Auth_Strategy extends AuthGuard('local') {
  constructor() {
    super();
  }
}
