const fs = require("fs");
const path = require("path");

// Paths
const imagesDir = "./src/assets/photos/portfolio";
const outputFile = "./src/app/data/clients.data.ts";

// Read images
let files = fs.readdirSync(imagesDir);

// Only images
files = files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));

// Sort numerically
files.sort((a, b) => parseInt(a) - parseInt(b));

const clients = files.map((file, index) => {

  const cleanName = path.parse(file).name;
  const parts = cleanName.split(" - ");

  const name = parts[1]?.trim() || "Unknown";
  const type = parts[2]?.replace(/\s+/g, " ").trim() || "Unknown";

  return `
  {
    name: "${name}",
    type: "${type}",
    logo: "assets/photos/portfolio/${file}"
  }`;
});

// Final TS file
const output = `
/**
 * ⚠️ AUTO-GENERATED FILE
 * Do NOT edit manually
 */

export interface Client {
  name: string;
  type: string;
  logo: string;
  delay: number;
}

export const CLIENTS: Client[] = [
${clients.join(",")}
];
`;

fs.writeFileSync(outputFile, output);

