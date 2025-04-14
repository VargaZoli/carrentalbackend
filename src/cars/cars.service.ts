import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; 
import { CreateCarDto } from './dto/create-car.dto';

@Injectable()
export class CarsService {
  constructor(private prisma: PrismaService) {}

 
  async findAll() {
    return this.prisma.cars.findMany({
      select: {
        id: true,
        license_plate_number: true,
        brand: true,
        model: true,
        daily_cost: true,
      },
    });
  }


  async create(createCarDto: CreateCarDto) {
    const { license_plate_number, brand, model, daily_cost } = createCarDto;
    const car = await this.prisma.cars.create({
      data: {
        license_plate_number,
        brand,
        model,
        daily_cost,
        created_at: new Date(),
      },
      select: {
        id: true,
        license_plate_number: true,
        brand: true,
        model: true,
        daily_cost: true,
      },
    });
    return car;
  }


  async rentCar(carId: number) {

    const car = await this.prisma.cars.findUnique({
      where: { id: Number(carId) },
    });
    if (!car) {
      throw new NotFoundException({
        error: `Nincs ${carId} azonosítójú autó.`,
      });
    }

   
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 7);


    const existingRental = await this.prisma.rentals.findFirst({
      where: {
        car_id: Number(carId),
        OR: [
          {
            Start_Date: { lte: endDate },
            End_Date: { gte: startDate },
          },
        ],
      },
    });

    if (existingRental) {
      throw new ConflictException({
        error: 'Az autó már foglalt az adott időszakra.',
      });
    }


    await this.prisma.rentals.create({
      data: {
        Start_Date: startDate,
        End_Date: endDate,
        car_id: Number(carId),
      },
    });

    return {
      start_date: startDate,
      end_date: endDate,
    };
  }
}
