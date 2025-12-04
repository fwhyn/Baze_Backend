import { Controller, Get, Req } from '@nestjs/common';

@Controller('transaction')
export class TransactionController {
  @Get('list')
  getList(@Req() req: Request) {
    // If API Gateway forwarded x-forwarded-user header:
    const forwarded = req.headers['x-forwarded-user'] as string | undefined;
    let user: Record<string, any> = {};
    if (forwarded) {
      try {
        user = JSON.parse(forwarded) as Record<string, any>;
      } catch (e) {
        console.error(e);
      }
    }

    return {
      message: 'Transactions fetched',
      user,
      transactions: [
        { id: 1, amount: 100 },
        { id: 2, amount: 50 },
      ],
    };
  }
}
