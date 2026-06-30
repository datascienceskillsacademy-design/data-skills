import type { Instructor } from "@/lib/types";

export const instructors: Instructor[] = [
  {
    id: "instr-gias",
    name: "Prof. Dr. Gias U. Ahsan",
    role: "Chief Trainer · Advisor, Strategy & Innovation, DIU",
    bio: "With over 30 years of distinguished academic leadership, Dr. Ahsan served as Pro Vice Chancellor at North South University and founded the NSU Genome Research Institute — the first of its kind in Bangladesh. A WHO South-East Asia Technical Advisor and SEAPHEIN Executive Board Member, he has cultivated global research partnerships with Johns Hopkins, Cambridge, Oxford, and the University of Maryland, securing multi-million-dollar grants in public health and biosciences.",
    avatar: "/instructor-1.png",
    isFounder: true,
    socials: {
      linkedin:
        "https://www.linkedin.com/in/professor-dr-gias-u-ahsan-77567468/",
    },
  },
  {
    id: "instr-ahmed",
    name: "Ahmed Hossain, PhD",
    role: "Co-Instructor · Professor, University of Sharjah, UAE",
    bio: "Dr. Hossain holds a Professor position in Healthcare Management at the University of Sharjah and serves as Director of the Global Health Institute at NSU. He earned his PhD from the University of Toronto's Dalla Lana School of Public Health (2010) and was a Canadian Institute of Health Research Fellow at McMaster University. He has published over 118 articles in journals including The Lancet and JAMA, with research focused on statistical genomics, chronic disease, and infectious disease epidemiology.",
    avatar: "/instructor-2.jpeg",
    socials: {
      linkedin: "https://www.linkedin.com/in/ahmed-hossain-phd-00448934/",
    },
  },
];
