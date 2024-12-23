import { BadRequestException, ConflictException, Get, HttpException, HttpStatus, Injectable, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt'
import { LoginedGuard } from 'src/auth/utils/guards/LoginedGuard';
@Injectable()
export class UserService {
    constructor(private readonly databaseService: DatabaseService){}

    async create(createUserDto: Prisma.UserCreateInput){
        createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
        try{
        return await this.databaseService.user.create({
            data: createUserDto,
        })
        } catch(error){
            if (error.message.includes('Unique constraint')) {
                throw new ConflictException('username already exists');
            } else if((error.message.includes('Argument') && error.message.includes('is missing')) || (error.message.includes('Unknown argument'))){
                throw new BadRequestException('bad request, json format is incorrect')
            } else {
                throw error;
            }
        }
    }

    // find user's groups via userId
    async findGroups(userId: number){
        const groups = await this.databaseService.userGroup.findMany({
            select: {
                groupId:true
            },
            where:{
                userId: userId
            },
            
        })
        let groupReturnFormat = {
            groups: []
        }
        for(let group of groups){
            groupReturnFormat['groups'].push(group['groupId'])
        }
        return groupReturnFormat
    }

    async findOne(userId: number){
        const user = await this.databaseService.user.findUnique({
            where:{
                userId: userId
            } 
        })
        if(!user){
            throw new HttpException(`User ${userId} not found.`, HttpStatus.BAD_REQUEST);
        }
        return user
    }

    async findID(username: string){
        const user = await this.databaseService.user.findUnique({
            where:{
                username: username
            } 
        })
        if(!user){
            throw new HttpException(`User ${username} not found.`, HttpStatus.BAD_REQUEST);
        }
        return user.userId
    }



}
