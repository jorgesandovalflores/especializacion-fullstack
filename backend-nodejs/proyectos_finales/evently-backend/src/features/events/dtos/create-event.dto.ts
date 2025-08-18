import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEventDto {
    @ApiProperty() @IsString() @IsNotEmpty() @MaxLength(200)
    title: string;

    @ApiProperty({ required: false }) @IsOptional() @IsString()
    description?: string;

    @ApiProperty() @IsString() @IsNotEmpty() @MaxLength(200)
    location: string;

    @ApiProperty({ description: 'ISO date-time' }) @IsDateString()
    date: string;
}
