import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();


function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}


async function seedRentals() {
  try {
    
    const cars = await prisma.cars.findMany();
    if (cars.length === 0) {
      console.error('Nincsenek autók az adatbázisban. Kérlek, először töltsd fel a cars táblát.');
      return;
    }


    const rentalPromises = Array.from({ length: 15 }, async () => {
      const startDate = randomDate(new Date(2024, 0, 1), new Date(2025, 3, 14));
      const endDate = new Date(startDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
      const randomCar = cars[Math.floor(Math.random() * cars.length)];

      return prisma.rentals.create({
        data: {
          Start_Date: startDate,
          End_Date: endDate,
          car_id: randomCar.id,
        },
      });
    });

    await Promise.all(rentalPromises);
    console.log('Sikeresen létrehoztunk 15 rentals rekordot.');
  } catch (error) {
    console.error('Hiba történt a seed-elés során:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedRentals();
