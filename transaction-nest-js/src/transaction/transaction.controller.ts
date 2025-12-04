import { Controller, Get, Req } from "@nestjs/common";

@Controller("transaction")
export class TransactionController {
    @Get("list")
    getList(@Req() req: Request) {
        // If API Gateway forwarded x-forwarded-user header:
        const forwarded = req.headers["x-forwarded-user"];
        let user = {};
        try {
            user = forwarded ? JSON.parse(forwarded) : {};
        } catch (e) {}

        return {
            message: "Transactions fetched",
            user,
            transactions: [
                { id: 1, amount: 100 },
                { id: 2, amount: 50 },
            ],
        };
    }
}
