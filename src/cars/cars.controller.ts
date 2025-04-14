import { Body, Controller, Get, Post, Param, ParseIntPipe, HttpStatus, HttpCode } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';

@Controller('api/cars') 
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  async findAll() {
    return this.carsService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCarDto: CreateCarDto) {
    return this.carsService.create(createCarDto);
  }

  @Post(':car/rent')
  async rentCar(@Param('car', ParseIntPipe) carId: number) {
    return this.carsService.rentCar(carId);
  }
}
