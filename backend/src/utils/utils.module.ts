import { Module } from '@nestjs/common';
import { CFInterface } from './CFInterface.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [DatabaseModule],
    providers: [CFInterface],
    exports: [CFInterface]
})
export class UtilsModule {}
