import db from './db.js'; 

async function main() {
    await db.user.createMany({
      data: [
        { email: 'agus@student.umn.ac.id', name: 'Agus' },
        { email: 'bambang@iak.id', name: 'Bambang' },
        { email: 'cahyo@bca.id', name: 'Cahyo' },
      ],
    });
    console.log('Data seeded successfully');
  }
  
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await db.$disconnect();
    }); 