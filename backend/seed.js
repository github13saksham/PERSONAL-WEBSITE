const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear old experiences
  await prisma.experience.deleteMany({});
  console.log('Old experiences cleared!');

  // Frontend Developer Intern
  await prisma.experience.create({
    data: {
      type: "job",
      date: "May 2025 – July 2025",
      title: "Frontend Developer Intern",
      subtitle: "Primus Partners Solution Pvt Ltd",
      description: "Built Parivar Pehchan Patra Govt. website login page & family dashboard using React.js, TailwindCSS, and inext18ts translation tool. Collaborated with backend teams for API integration & UI consistency. Strengthened debugging and independent problem-solving skills."
    }
  });

  // B.Tech CSE (AI)
  await prisma.experience.create({
    data: {
      type: "education",
      date: "2022 – 2026",
      title: "B.Tech CSE (AI Specialization)",
      subtitle: "Sharda University",
      description: "Pursuing B.Tech in Computer Science & Engineering with specialization in Artificial Intelligence. Focusing on full-stack development, AI/ML, and scalable backend architectures. Active in programming clubs and open-source contributions."
    }
  });

  // Class XII
  await prisma.experience.create({
    data: {
      type: "education",
      date: "2021 – 2022",
      title: "AISSE (Class XII) – CBSE",
      subtitle: "Manav Sthali School",
      description: "Completed Senior Secondary Education under the CBSE board with a focus on Science stream (PCM with Computer Science)."
    }
  });

  // Class X
  await prisma.experience.create({
    data: {
      type: "education",
      date: "2019 – 2020",
      title: "AISSE (Class X) – CBSE",
      subtitle: "Manav Sthali School",
      description: "Completed Secondary Education under the CBSE board with excellent academics."
    }
  });

  console.log('Journey seeded with all experiences!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
