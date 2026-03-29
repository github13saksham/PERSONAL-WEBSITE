const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DI = (name) => `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}`;

const seedSkills = [
  // Languages
  { category: "Languages", name: "Python", icon: DI("python/python-original.svg"), color: "#3776AB" },
  { category: "Languages", name: "JavaScript", icon: DI("javascript/javascript-original.svg"), color: "#F7DF1E" },
  { category: "Languages", name: "TypeScript", icon: DI("typescript/typescript-original.svg"), color: "#3178C6" },
  { category: "Languages", name: "C", icon: DI("c/c-original.svg"), color: "#A8B9CC" },
  { category: "Languages", name: "SQL", icon: DI("azuresqldatabase/azuresqldatabase-original.svg"), color: "#CC2927" },
  { category: "Languages", name: "PHP", icon: DI("php/php-original.svg"), color: "#777BB4" },
  // Frontend
  { category: "Frontend", name: "React", icon: DI("react/react-original.svg"), color: "#61DAFB" },
  { category: "Frontend", name: "Next.js", icon: DI("nextjs/nextjs-original.svg"), color: "#ffffff" },
  { category: "Frontend", name: "Tailwind", icon: DI("tailwindcss/tailwindcss-original.svg"), color: "#06B6D4" },
  { category: "Frontend", name: "CSS3", icon: DI("css3/css3-original.svg"), color: "#1572B6" },
  { category: "Frontend", name: "HTML5", icon: DI("html5/html5-original.svg"), color: "#E34F26" },
  { category: "Frontend", name: "Three.js", icon: DI("threejs/threejs-original.svg"), color: "#ffffff" },
  // Backend
  { category: "Backend", name: "Node.js", icon: DI("nodejs/nodejs-original.svg"), color: "#339933" },
  { category: "Backend", name: "Express", icon: DI("express/express-original.svg"), color: "#ffffff" },
  { category: "Backend", name: "REST APIs", icon: DI("fastapi/fastapi-original.svg"), color: "#009688" },
  // Databases
  { category: "Databases", name: "PostgreSQL", icon: DI("postgresql/postgresql-original.svg"), color: "#4169E1" },
  { category: "Databases", name: "MongoDB", icon: DI("mongodb/mongodb-original.svg"), color: "#47A248" },
  { category: "Databases", name: "MySQL", icon: DI("mysql/mysql-original.svg"), color: "#4479A1" },
  // Tools & DevOps
  { category: "Tools & DevOps", name: "Git", icon: DI("git/git-original.svg"), color: "#F05032" },
  { category: "Tools & DevOps", name: "GitHub", icon: DI("github/github-original.svg"), color: "#ffffff" },
  { category: "Tools & DevOps", name: "VS Code", icon: DI("vscode/vscode-original.svg"), color: "#007ACC" },
  { category: "Tools & DevOps", name: "Docker", icon: DI("docker/docker-original.svg"), color: "#2496ED" },
  { category: "Tools & DevOps", name: "Prisma", icon: DI("prisma/prisma-original.svg"), color: "#2D3748" },
  // Soft Skills
  { category: "Soft Skills", name: "Problem Solving", icon: "", color: "#8B5CF6" },
  { category: "Soft Skills", name: "Analytical Thinking", icon: "", color: "#6366F1" },
  { category: "Soft Skills", name: "Team Collaboration", icon: "", color: "#818CF8" },
  { category: "Soft Skills", name: "Communication", icon: "", color: "#A78BFA" }
];

async function main() {
  await prisma.skill.deleteMany({});
  await prisma.project.deleteMany({});
  console.log("Cleared old skills & projects.");

  for (const s of seedSkills) {
    await prisma.skill.create({ data: s });
  }
  console.log("Seeded default skills!");

  // Fetch from github to seed projects once
  const githubRes = await fetch("https://api.github.com/users/github13saksham/repos?per_page=12&sort=updated");
  if (githubRes.ok) {
    const repos = await githubRes.json();
    for (const r of repos) {
        if (r.name.toUpperCase() !== 'PERSONAL-WEBSITE' && r.name !== 'github13saksham') {
            await prisma.project.create({
                data: {
                    name: r.name,
                    description: r.description || "No description provided.",
                    html_url: r.html_url,
                    language: r.language || "Other",
                    stargazers_count: r.stargazers_count || 0,
                    forks_count: r.forks_count || 0
                }
            });
        }
    }
    console.log("Seeded projects from GitHub!");
  } else {
    console.log("Failed to fetch initial Github projects for seeding.");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
