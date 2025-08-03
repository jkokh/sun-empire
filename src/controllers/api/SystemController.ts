import { PrismaClient } from '@prisma/client';
import { Controller, Res } from '@tsed/common';
import { Get } from '@tsed/schema';
const prisma = new PrismaClient();

@Controller('/')
export class SystemController {

    @Get('/health-check')
    async healthCheck(@Res() res: Res): Promise<void> {
        try {
            // Execute a simple query to test DB connectivity
            const result = await prisma.$queryRaw`SELECT 1`;
            if (result) {
                res.json({ status: 'ok', hash: process.env.COMMIT_HASH });
            } else {
                res.status(503).json({ status: 'error', message: 'Database query failed' });
            }
        } catch (error) {
            console.error('Database health check failed:', error);
            res.status(503).json({ status: 'error', message: 'Database connectivity error' });
        }
    }
}
